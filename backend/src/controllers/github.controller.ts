import { Request, Response } from 'express';
import crypto from 'crypto';
import { pool } from '../config/db';
import { ENV } from '../config/env';
import {
  encryptToken,
  decryptToken,
  exchangeCodeForToken,
  getGitHubUser,
  getUserRepositories,
  verifyRepoPushAccess,
  pushFilesToGitHub,
  revokeToken,
  generateJavaSolutionContent,
  generateReadmeContent,
  sanitizePathSegment,
  GitHubFile,
  GitHubAuthError,
} from '../services/github/github.service';

// ---------------------------------------------------------------------------
// Helper: Cleanly handle GitHub API errors, detecting 401 token expiry/revocation
// ---------------------------------------------------------------------------
async function handleGitHubError(
  error: any,
  userId: number,
  res: Response,
  fallbackMessage: string
): Promise<void> {
  const isAuthError =
    error instanceof GitHubAuthError ||
    error.name === 'GitHubAuthError' ||
    (typeof error.message === 'string' &&
      (error.message.includes('401') ||
        error.message.toLowerCase().includes('bad credentials') ||
        error.message.toLowerCase().includes('token expired')));

  if (isAuthError) {
    try {
      await pool.query('DELETE FROM github_connections WHERE user_id = $1', [userId]);
      await pool.query('DELETE FROM github_oauth_states WHERE user_id = $1', [userId]);
    } catch (cleanErr: any) {
      console.warn('[GitHub] Could not clear stale connection:', cleanErr.message);
    }
    res.status(401).json({
      success: false,
      reconnect_required: true,
      message: 'Your GitHub authorization has expired or was revoked. Please reconnect your GitHub account.',
      data: null,
    });
    return;
  }

  res.status(500).json({ success: false, message: fallbackMessage || error.message, data: null });
}

// ---------------------------------------------------------------------------
// Helper: Check if GitHub OAuth is configured
// ---------------------------------------------------------------------------
const DEFAULT_PLACEHOLDER_KEY = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2';

function isGitHubConfigured(): boolean {
  const hasCredentials = !!(ENV.GITHUB.CLIENT_ID && ENV.GITHUB.CLIENT_SECRET &&
    ENV.GITHUB.CLIENT_ID !== 'your_github_client_id_here' &&
    ENV.GITHUB.CLIENT_SECRET !== 'your_github_client_secret_here');
  const hasRealEncryptionKey = !!(ENV.GITHUB.ENCRYPTION_KEY &&
    ENV.GITHUB.ENCRYPTION_KEY !== DEFAULT_PLACEHOLDER_KEY &&
    ENV.GITHUB.ENCRYPTION_KEY.length >= 64);
  return hasCredentials && hasRealEncryptionKey;
}

// ---------------------------------------------------------------------------
// Helper: Resolve frontend base URL for OAuth redirects
// ---------------------------------------------------------------------------
function getFrontendUrl(): string {
  if (ENV.CLIENT_URL && !ENV.CLIENT_URL.includes('localhost')) {
    return ENV.CLIENT_URL;
  }
  if (ENV.NODE_ENV === 'production') {
    return 'https://practice-portal-mu.vercel.app';
  }
  return ENV.CLIENT_URL || 'http://localhost:5173';
}

// ---------------------------------------------------------------------------
// GET /api/github/health  (public — no auth required)
// Returns whether GitHub OAuth is fully configured on this server.
// Safe to call without a JWT — never returns secrets.
// ---------------------------------------------------------------------------
export const getGitHubHealth = (_req: Request, res: Response): void => {
  const configured = isGitHubConfigured();
  const missing: string[] = [];
  if (!ENV.GITHUB.CLIENT_ID || ENV.GITHUB.CLIENT_ID === 'your_github_client_id_here') {
    missing.push('GITHUB_CLIENT_ID');
  }
  if (!ENV.GITHUB.CLIENT_SECRET || ENV.GITHUB.CLIENT_SECRET === 'your_github_client_secret_here') {
    missing.push('GITHUB_CLIENT_SECRET');
  }
  if (!ENV.GITHUB.ENCRYPTION_KEY || ENV.GITHUB.ENCRYPTION_KEY === DEFAULT_PLACEHOLDER_KEY) {
    missing.push('GITHUB_ENCRYPTION_KEY (must not be the default placeholder)');
  }
  res.json({
    success: true,
    data: {
      configured,
      missing_variables: configured ? [] : missing,
      callback_url: ENV.GITHUB.CALLBACK_URL || null,
    },
  });
};

// ---------------------------------------------------------------------------
// GET /api/github/auth
// Redirects the authenticated user to GitHub OAuth authorization page.
// ---------------------------------------------------------------------------
export const initiateOAuth = async (req: Request, res: Response): Promise<void> => {
  if (!isGitHubConfigured()) {
    const missing: string[] = [];
    if (!ENV.GITHUB.CLIENT_ID || ENV.GITHUB.CLIENT_ID === 'your_github_client_id_here') {
      missing.push('GITHUB_CLIENT_ID');
    }
    if (!ENV.GITHUB.CLIENT_SECRET || ENV.GITHUB.CLIENT_SECRET === 'your_github_client_secret_here') {
      missing.push('GITHUB_CLIENT_SECRET');
    }
    if (!ENV.GITHUB.ENCRYPTION_KEY || ENV.GITHUB.ENCRYPTION_KEY === DEFAULT_PLACEHOLDER_KEY) {
      missing.push('GITHUB_ENCRYPTION_KEY');
    }
    res.status(503).json({
      success: false,
      message: `GitHub OAuth is not configured. Missing or placeholder values for: ${missing.join(', ')}. Set these in your Render backend environment variables and redeploy.`,
      data: { missing_variables: missing },
    });
    return;
  }


  const userId = req.user!.id;
  const state = crypto.randomBytes(32).toString('hex');

  try {
    // Clean up expired states for this user
    await pool.query(
      'DELETE FROM github_oauth_states WHERE user_id = $1 OR expires_at < NOW()',
      [userId]
    );

    // Store CSRF state with 10-minute expiry
    await pool.query(
      `INSERT INTO github_oauth_states (user_id, state, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '10 minutes')`,
      [userId, state]
    );

    const params = new URLSearchParams({
      client_id: ENV.GITHUB.CLIENT_ID,
      redirect_uri: ENV.GITHUB.CALLBACK_URL,
      scope: ENV.GITHUB.SCOPES,
      state,
      allow_signup: 'true',
    });

    res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
  } catch (error: any) {
    console.error('[GitHub] initiateOAuth error:', error.message);
    const frontendUrl = getFrontendUrl();
    res.redirect(`${frontendUrl}/settings?github=error&reason=state_failed`);
  }
};

// ---------------------------------------------------------------------------
// GET /api/github/callback
// GitHub redirects here after user approves/denies access.
// ---------------------------------------------------------------------------
export const handleCallback = async (req: Request, res: Response): Promise<void> => {
  const frontendUrl = getFrontendUrl();
  const { code, state, error: oauthError } = req.query as Record<string, string>;

  // User denied access
  if (oauthError === 'access_denied') {
    res.redirect(`${frontendUrl}/settings?github=denied`);
    return;
  }

  if (!code || !state) {
    res.redirect(`${frontendUrl}/settings?github=error&reason=missing_params`);
    return;
  }

  try {
    // Validate CSRF state
    const stateResult = await pool.query(
      `SELECT * FROM github_oauth_states
       WHERE state = $1 AND expires_at > NOW() AND used_at IS NULL`,
      [state]
    );

    if (stateResult.rows.length === 0) {
      res.redirect(`${frontendUrl}/settings?github=error&reason=invalid_state`);
      return;
    }

    const stateRow = stateResult.rows[0];
    const userId = stateRow.user_id as number;

    // Mark state as used (one-time use)
    await pool.query(
      'UPDATE github_oauth_states SET used_at = NOW() WHERE state = $1',
      [state]
    );

    // Exchange code for access token
    const { access_token, scope } = await exchangeCodeForToken(code);

    // Fetch GitHub user info
    const ghUser = await getGitHubUser(access_token);

    // Encrypt token before storage
    const { encrypted, iv } = encryptToken(access_token);

    // Upsert github_connections (one record per portal user)
    await pool.query(
      `INSERT INTO github_connections
         (user_id, github_user_id, github_username, github_avatar_url, github_profile_url,
          encrypted_access_token, encryption_iv, token_scope, connected_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       ON CONFLICT (user_id) DO UPDATE SET
         github_user_id = EXCLUDED.github_user_id,
         github_username = EXCLUDED.github_username,
         github_avatar_url = EXCLUDED.github_avatar_url,
         github_profile_url = EXCLUDED.github_profile_url,
         encrypted_access_token = EXCLUDED.encrypted_access_token,
         encryption_iv = EXCLUDED.encryption_iv,
         token_scope = EXCLUDED.token_scope,
         connected_at = NOW(),
         updated_at = NOW()`,
      [
        userId,
        ghUser.id,
        ghUser.login,
        ghUser.avatar_url,
        ghUser.html_url,
        encrypted,
        iv,
        scope,
      ]
    );

    res.redirect(`${frontendUrl}/settings?github=connected&username=${encodeURIComponent(ghUser.login)}`);
  } catch (error: any) {
    console.error('[GitHub] handleCallback error:', error.message);
    const frontendUrl2 = getFrontendUrl();
    res.redirect(`${frontendUrl2}/settings?github=error&reason=callback_failed`);
  }
};

// ---------------------------------------------------------------------------
// GET /api/github/status
// Returns GitHub connection status for the authenticated portal user.
// ---------------------------------------------------------------------------
export const getGitHubStatus = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const verify = req.query.verify === 'true';

  try {
    const result = await pool.query(
      `SELECT github_username, github_avatar_url, github_profile_url,
              selected_repo_full_name, selected_repo_owner, selected_repo_name,
              selected_branch, is_private_repo, token_scope, auto_push_on_accept, connected_at,
              encrypted_access_token, encryption_iv
       FROM github_connections WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      res.json({
        success: true,
        data: {
          connected: false,
          configured: isGitHubConfigured(),
        },
      });
      return;
    }

    const row = result.rows[0];

    // If active verification is requested, check if token is still valid on GitHub
    if (verify) {
      try {
        const accessToken = decryptToken(row.encrypted_access_token, row.encryption_iv);
        await getGitHubUser(accessToken);
      } catch (authErr: any) {
        if (
          authErr instanceof GitHubAuthError ||
          authErr.name === 'GitHubAuthError' ||
          (typeof authErr.message === 'string' &&
            (authErr.message.includes('401') || authErr.message.toLowerCase().includes('bad credentials')))
        ) {
          await pool.query('DELETE FROM github_connections WHERE user_id = $1', [userId]);
          res.json({
            success: true,
            data: {
              connected: false,
              reconnect_required: true,
              configured: isGitHubConfigured(),
            },
          });
          return;
        }
      }
    }

    res.json({
      success: true,
      data: {
        connected: true,
        configured: isGitHubConfigured(),
        github_username: row.github_username,
        github_avatar_url: row.github_avatar_url,
        github_profile_url: row.github_profile_url,
        selected_repo_full_name: row.selected_repo_full_name,
        selected_repo_owner: row.selected_repo_owner,
        selected_repo_name: row.selected_repo_name,
        selected_branch: row.selected_branch || 'main',
        is_private_repo: row.is_private_repo,
        auto_push_on_accept: Boolean(row.auto_push_on_accept),
        token_scope: row.token_scope,
        connected_at: row.connected_at,
      },
    });
  } catch (error: any) {
    console.error('[GitHub] getGitHubStatus error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch GitHub status.', data: null });
  }
};

// ---------------------------------------------------------------------------
// GET /api/github/repositories
// Returns the user's GitHub repositories (requires connected account).
// ---------------------------------------------------------------------------
export const getRepositories = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const page = parseInt((req.query.page as string) || '1', 10);

  try {
    const result = await pool.query(
      'SELECT encrypted_access_token, encryption_iv FROM github_connections WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      res.status(400).json({ success: false, message: 'GitHub account not connected.', data: null });
      return;
    }

    const { encrypted_access_token, encryption_iv } = result.rows[0];
    const accessToken = decryptToken(encrypted_access_token, encryption_iv);
    const repos = await getUserRepositories(accessToken, page);

    res.json({
      success: true,
      data: repos.map((r) => ({
        id: r.id,
        full_name: r.full_name,
        name: r.name,
        owner: r.owner.login,
        private: r.private,
        html_url: r.html_url,
        description: r.description,
        default_branch: r.default_branch,
        can_push: r.permissions?.push ?? true,
        updated_at: r.updated_at,
      })),
    });
  } catch (error: any) {
    console.error('[GitHub] getRepositories error:', error.message);
    await handleGitHubError(error, userId, res, 'Failed to fetch repositories.');
  }
};

// ---------------------------------------------------------------------------
// GET /api/github/repositories/:owner/:repo/branches
// Returns branches of a repo the user has access to.
// ---------------------------------------------------------------------------
export const getBranches = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const { owner, repo } = req.params as { owner: string; repo: string };

  if (!owner || !repo) {
    res.status(400).json({ success: false, message: 'owner and repo are required.', data: null });
    return;
  }

  try {
    const result = await pool.query(
      'SELECT encrypted_access_token, encryption_iv FROM github_connections WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      res.status(400).json({ success: false, message: 'GitHub account not connected.', data: null });
      return;
    }

    const { encrypted_access_token, encryption_iv } = result.rows[0];
    const accessToken = decryptToken(encrypted_access_token, encryption_iv);

    const { getRepositoryBranches } = await import('../services/github/github.service');
    const branches = await getRepositoryBranches(accessToken, owner, repo);

    res.json({
      success: true,
      data: branches.map((b) => ({
        name: b.name,
        protected: b.protected,
        commit_sha: b.commit?.sha,
      })),
    });
  } catch (error: any) {
    console.error('[GitHub] getBranches error:', error.message);
    await handleGitHubError(error, userId, res, 'Failed to fetch branches.');
  }
};


// Save the user's chosen repo + branch after verifying push access.
// ---------------------------------------------------------------------------
export const selectRepository = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const { repo_full_name, branch } = req.body as {
    repo_full_name: string;
    branch?: string;
  };

  if (!repo_full_name || !repo_full_name.includes('/')) {
    res.status(400).json({ success: false, message: 'Invalid repo_full_name. Expected format: owner/repo', data: null });
    return;
  }

  const [owner, repoName] = repo_full_name.split('/');
  const selectedBranch = branch || 'main';

  try {
    const connResult = await pool.query(
      'SELECT encrypted_access_token, encryption_iv FROM github_connections WHERE user_id = $1',
      [userId]
    );

    if (connResult.rows.length === 0) {
      res.status(400).json({ success: false, message: 'GitHub account not connected.', data: null });
      return;
    }

    const { encrypted_access_token, encryption_iv } = connResult.rows[0];
    const accessToken = decryptToken(encrypted_access_token, encryption_iv);

    // Verify push access
    const hasPush = await verifyRepoPushAccess(accessToken, owner, repoName);
    if (!hasPush) {
      res.status(403).json({
        success: false,
        message: `You do not have push access to "${repo_full_name}". Please select a repository you own or have write access to.`,
        data: null,
      });
      return;
    }

    // Get repo privacy status
    const reposPage1 = await getUserRepositories(accessToken, 1, 100);
    const targetRepo = reposPage1.find((r) => r.full_name === repo_full_name);

    await pool.query(
      `UPDATE github_connections SET
         selected_repo_full_name = $1,
         selected_repo_owner = $2,
         selected_repo_name = $3,
         selected_branch = $4,
         is_private_repo = $5,
         updated_at = NOW()
       WHERE user_id = $6`,
      [
        repo_full_name,
        owner,
        repoName,
        selectedBranch,
        targetRepo?.private ?? false,
        userId,
      ]
    );

    res.json({
      success: true,
      message: `Repository "${repo_full_name}" selected successfully.`,
      data: {
        selected_repo_full_name: repo_full_name,
        selected_repo_owner: owner,
        selected_repo_name: repoName,
        selected_branch: selectedBranch,
        is_private_repo: targetRepo?.private ?? false,
      },
    });
  } catch (error: any) {
    console.error('[GitHub] selectRepository error:', error.message);
    await handleGitHubError(error, userId, res, 'Failed to select repository.');
  }
};

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// POST /api/github/auto-push
// Toggle auto-push on acceptance setting for current user.
// ---------------------------------------------------------------------------
export const toggleAutoPush = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const { auto_push } = req.body as { auto_push: boolean };

  try {
    const result = await pool.query(
      `UPDATE github_connections
       SET auto_push_on_accept = $1, updated_at = NOW()
       WHERE user_id = $2
       RETURNING auto_push_on_accept`,
      [Boolean(auto_push), userId]
    );

    if (result.rows.length === 0) {
      res.status(400).json({ success: false, message: 'GitHub account not connected.', data: null });
      return;
    }

    res.json({
      success: true,
      message: `Auto-push ${auto_push ? 'enabled' : 'disabled'} successfully.`,
      data: { auto_push_on_accept: result.rows[0].auto_push_on_accept },
    });
  } catch (error: any) {
    console.error('[GitHub] toggleAutoPush error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update auto-push setting.', data: null });
  }
};

// ---------------------------------------------------------------------------
// POST /api/github/push
// Push a Java solution and README to the user's selected GitHub repository.
// Path structure: placement-solutions/Java/<Topic-Name>/<Problem-Name>/Solution.java + README.md
// ---------------------------------------------------------------------------
export const pushSolution = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const {
    problem_id,
    problem_title,
    problem_description,
    difficulty,
    topic_name,
    explanation,
    code,
    language = 'java',
    status = 'Solved / Accepted',
  } = req.body as {
    problem_id?: number;
    problem_title: string;
    problem_description?: string;
    difficulty?: string;
    topic_name?: string;
    explanation?: string;
    code: string;
    language?: string;
    status?: string;
  };

  if (!problem_title || !code) {
    res.status(400).json({ success: false, message: 'problem_title and code are required.', data: null });
    return;
  }

  try {
    const result = await pool.query(
      `SELECT gc.encrypted_access_token, gc.encryption_iv,
              gc.selected_repo_owner, gc.selected_repo_name, gc.selected_branch,
              gc.selected_repo_full_name, gc.github_username,
              u.name AS portal_username
       FROM github_connections gc
       JOIN users u ON u.id = gc.user_id
       WHERE gc.user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      res.status(400).json({ success: false, message: 'GitHub account not connected.', data: null });
      return;
    }

    const row = result.rows[0];
    if (!row.selected_repo_owner || !row.selected_repo_name) {
      res.status(400).json({ success: false, message: 'No repository selected. Please select a repository first.', data: null });
      return;
    }

    const accessToken = decryptToken(row.encrypted_access_token, row.encryption_iv);
    const pushedAt = new Date().toISOString();

    // Query DB for complete metadata if problem_id is provided
    let finalTitle = problem_title;
    let finalDescription = problem_description || '';
    let finalTopic = topic_name || 'Practice';
    let finalDifficulty = difficulty || 'MEDIUM';
    let finalExplanation = explanation || '';

    if (problem_id) {
      try {
        const probRes = await pool.query(
          `SELECT p.title, p.description, p.difficulty, p.explanation, t.name as topic_name
           FROM problems p
           LEFT JOIN topics t ON t.id = p.topic_id
           WHERE p.id = $1`,
          [problem_id]
        );
        if (probRes.rows.length > 0) {
          const pr = probRes.rows[0];
          finalTitle = finalTitle || pr.title;
          finalDescription = finalDescription || pr.description || '';
          finalTopic = (finalTopic !== 'Practice' && finalTopic) ? finalTopic : (pr.topic_name || 'Practice');
          finalDifficulty = finalDifficulty || pr.difficulty || 'MEDIUM';
          finalExplanation = finalExplanation || pr.explanation || '';
        }
      } catch {
        // Fallback gracefully
      }
    }

    // Build directory & file paths:
    // placement-solutions/Java/<Topic-Name>/<Problem-Name>/Solution.java + README.md
    const safeTopic = sanitizePathSegment(finalTopic, 'General');
    const safeProblem = sanitizePathSegment(finalTitle, 'Solution');
    const basePath = `placement-solutions/Java/${safeTopic}/${safeProblem}`;
    const javaFileName = 'Solution.java';
    const javaFilePath = `${basePath}/${javaFileName}`;
    const readmePath = `${basePath}/README.md`;

    const javaContent = generateJavaSolutionContent({
      problemId: problem_id,
      problemTitle: finalTitle,
      problemDescription: finalDescription,
      difficulty: finalDifficulty,
      topicName: finalTopic,
      code,
      username: row.portal_username || row.github_username,
      pushedAt,
      status,
    });

    const files: GitHubFile[] = [
      {
        path: javaFilePath,
        content: javaContent,
        message: `feat: Add Java solution for "${finalTitle}" [${finalDifficulty}]`,
      },
    ];

    // Push Java file first
    const pushResult = await pushFilesToGitHub(
      accessToken,
      row.selected_repo_owner,
      row.selected_repo_name,
      row.selected_branch,
      files
    );

    // Now generate README with actual commit URL
    const readmeContent = generateReadmeContent({
      problemId: problem_id,
      problemTitle: finalTitle,
      difficulty: finalDifficulty,
      topicName: finalTopic,
      problemDescription: finalDescription,
      explanation: finalExplanation,
      javaFileName,
      commitUrl: pushResult.commitUrl,
      username: row.portal_username || row.github_username,
      pushedAt,
      status,
    });

    // Push README (separate commit, best effort)
    try {
      await pushFilesToGitHub(
        accessToken,
        row.selected_repo_owner,
        row.selected_repo_name,
        row.selected_branch,
        [
          {
            path: readmePath,
            content: readmeContent,
            message: `docs: Add README for "${finalTitle}"`,
          },
        ]
      );
      pushResult.filePaths.push(readmePath);
    } catch {
      // README push failure is non-fatal
    }

    // Log the push
    try {
      await pool.query(
        `INSERT INTO github_push_logs
           (user_id, problem_id, repo_full_name, branch, commit_sha, commit_url, file_paths, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'SUCCESS')`,
        [
          userId,
          problem_id || null,
          row.selected_repo_full_name,
          row.selected_branch,
          pushResult.commitSha,
          pushResult.commitUrl,
          pushResult.filePaths,
        ]
      );
    } catch {
      // Log failure is non-fatal
    }

    res.json({
      success: true,
      message: 'Solution pushed to GitHub successfully!',
      data: {
        commit_sha: pushResult.commitSha,
        commit_url: pushResult.commitUrl,
        file_paths: pushResult.filePaths,
        repo_full_name: row.selected_repo_full_name,
        branch: row.selected_branch,
      },
    });
  } catch (error: any) {
    console.error('[GitHub] pushSolution error:', error.message);

    // Log the failure
    try {
      const connRows = await pool.query(
        'SELECT selected_repo_full_name, selected_branch FROM github_connections WHERE user_id = $1',
        [userId]
      );
      if (connRows.rows.length > 0) {
        await pool.query(
          `INSERT INTO github_push_logs
             (user_id, problem_id, repo_full_name, branch, status, error_message)
           VALUES ($1, $2, $3, $4, 'FAILED', $5)`,
          [
            userId,
            req.body.problem_id || null,
            connRows.rows[0].selected_repo_full_name || 'unknown',
            connRows.rows[0].selected_branch || 'main',
            error.message,
          ]
        );
      }
    } catch { /* ignore */ }

    await handleGitHubError(error, userId, res, `Failed to push to GitHub: ${error.message}`);
  }
};

// ---------------------------------------------------------------------------
// DELETE /api/github/disconnect
// Revoke the GitHub OAuth token and remove the connection record.
// ---------------------------------------------------------------------------
export const disconnectGitHub = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;

  try {
    const result = await pool.query(
      'SELECT encrypted_access_token, encryption_iv FROM github_connections WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      res.status(400).json({ success: false, message: 'No GitHub account connected.', data: null });
      return;
    }

    const { encrypted_access_token, encryption_iv } = result.rows[0];

    // Best-effort: revoke token on GitHub's side
    try {
      const accessToken = decryptToken(encrypted_access_token, encryption_iv);
      await revokeToken(accessToken);
    } catch { /* ignore revocation errors */ }

    // Delete connection record
    await pool.query('DELETE FROM github_connections WHERE user_id = $1', [userId]);

    // Clean up any pending OAuth states
    await pool.query('DELETE FROM github_oauth_states WHERE user_id = $1', [userId]);

    res.json({ success: true, message: 'GitHub account disconnected successfully.', data: null });
  } catch (error: any) {
    console.error('[GitHub] disconnectGitHub error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to disconnect GitHub account.', data: null });
  }
};
