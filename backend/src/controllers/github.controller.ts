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
  GitHubFile,
} from '../services/github/github.service';

// ---------------------------------------------------------------------------
// Helper: Check if GitHub OAuth is configured
// ---------------------------------------------------------------------------
function isGitHubConfigured(): boolean {
  return !!(ENV.GITHUB.CLIENT_ID && ENV.GITHUB.CLIENT_SECRET &&
    ENV.GITHUB.CLIENT_ID !== 'your_github_client_id_here');
}

// ---------------------------------------------------------------------------
// GET /api/github/auth
// Redirects the authenticated user to GitHub OAuth authorization page.
// ---------------------------------------------------------------------------
export const initiateOAuth = async (req: Request, res: Response): Promise<void> => {
  if (!isGitHubConfigured()) {
    res.status(503).json({
      success: false,
      message: 'GitHub OAuth is not configured on this server. Please add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to the backend environment variables.',
      data: null,
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
    const frontendUrl = ENV.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/settings?github=error&reason=state_failed`);
  }
};

// ---------------------------------------------------------------------------
// GET /api/github/callback
// GitHub redirects here after user approves/denies access.
// ---------------------------------------------------------------------------
export const handleCallback = async (req: Request, res: Response): Promise<void> => {
  const frontendUrl = ENV.CLIENT_URL || 'http://localhost:5173';
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
    const frontendUrl2 = ENV.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl2}/settings?github=error&reason=callback_failed`);
  }
};

// ---------------------------------------------------------------------------
// GET /api/github/status
// Returns GitHub connection status for the authenticated portal user.
// ---------------------------------------------------------------------------
export const getGitHubStatus = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;

  try {
    const result = await pool.query(
      `SELECT github_username, github_avatar_url, github_profile_url,
              selected_repo_full_name, selected_repo_owner, selected_repo_name,
              selected_branch, is_private_repo, token_scope, connected_at
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
    res.status(500).json({ success: false, message: 'Failed to fetch repositories.', data: null });
  }
};

// ---------------------------------------------------------------------------
// POST /api/github/select-repository
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
    res.status(500).json({ success: false, message: 'Failed to select repository.', data: null });
  }
};

// ---------------------------------------------------------------------------
// POST /api/github/push
// Push a Java solution and README to the user's selected GitHub repository.
// ---------------------------------------------------------------------------
export const pushSolution = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const {
    problem_id,
    problem_title,
    problem_description,
    difficulty,
    topic_name,
    code,
    language = 'java',
  } = req.body as {
    problem_id?: number;
    problem_title: string;
    problem_description: string;
    difficulty: string;
    topic_name: string;
    code: string;
    language?: string;
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

    // Build file paths
    const safeTitle = problem_title
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 60);
    const safeTopicFolder = topic_name
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .toLowerCase();

    const ext = language === 'java' ? 'java' : 'txt';
    const javaFilePath = `solutions/${safeTopicFolder}/${safeTitle}.${ext}`;
    const readmePath = `solutions/${safeTopicFolder}/${safeTitle}_README.md`;

    const javaContent = generateJavaSolutionContent({
      problemTitle: problem_title,
      problemDescription: problem_description,
      difficulty,
      topicName: topic_name,
      code,
      username: row.portal_username || row.github_username,
      pushedAt,
    });

    const files: GitHubFile[] = [
      {
        path: javaFilePath,
        content: javaContent,
        message: `feat: Add solution for "${problem_title}" [${difficulty}]`,
      },
    ];

    // Push files
    const pushResult = await pushFilesToGitHub(
      accessToken,
      row.selected_repo_owner,
      row.selected_repo_name,
      row.selected_branch,
      files
    );

    // Now generate README with actual commit URL
    const readmeContent = generateReadmeContent({
      problemTitle: problem_title,
      difficulty,
      topicName: topic_name,
      problemDescription: problem_description,
      javaFilePath,
      commitUrl: pushResult.commitUrl,
      username: row.portal_username || row.github_username,
      pushedAt,
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
            message: `docs: Add README for "${problem_title}"`,
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

    res.status(500).json({ success: false, message: `Failed to push to GitHub: ${error.message}`, data: null });
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
