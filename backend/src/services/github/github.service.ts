import crypto from 'crypto';
import https from 'https';
import http from 'http';
import { ENV } from '../../config/env';

// ---------------------------------------------------------------------------
// Error Types
// ---------------------------------------------------------------------------
export class GitHubAuthError extends Error {
  constructor(message: string = 'GitHub access token has expired or was revoked.') {
    super(message);
    this.name = 'GitHubAuthError';
  }
}

// ---------------------------------------------------------------------------
// Encryption Helpers (AES-256-CBC)
// ---------------------------------------------------------------------------
function getEncryptionKey(): Buffer {
  const hexKey = ENV.GITHUB.ENCRYPTION_KEY;
  if (!hexKey || hexKey.length < 64) {
    throw new Error('GITHUB_ENCRYPTION_KEY must be a 64-character hex string (32 bytes).');
  }
  return Buffer.from(hexKey.slice(0, 64), 'hex');
}

export function encryptToken(plaintext: string): { encrypted: string; iv: string } {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { encrypted, iv: iv.toString('hex') };
}

export function decryptToken(encrypted: string, ivHex: string): string {
  const key = getEncryptionKey();
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// ---------------------------------------------------------------------------
// Simple HTTP helper (avoids adding axios dependency)
// ---------------------------------------------------------------------------
function httpRequest(options: https.RequestOptions, body?: string): Promise<{ status: number; data: any }> {
  return new Promise((resolve, reject) => {
    const protocol = options.protocol === 'http:' ? http : https;
    const req = protocol.request(options, (res) => {
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        let data: any = rawData;
        try {
          data = JSON.parse(rawData);
        } catch {
          // not JSON, return raw string
        }
        resolve({ status: res.statusCode || 0, data });
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

// ---------------------------------------------------------------------------
// GitHub OAuth — Exchange code for access token
// ---------------------------------------------------------------------------
export async function exchangeCodeForToken(code: string): Promise<{
  access_token: string;
  scope: string;
  token_type: string;
}> {
  const body = JSON.stringify({
    client_id: ENV.GITHUB.CLIENT_ID,
    client_secret: ENV.GITHUB.CLIENT_SECRET,
    code,
    redirect_uri: ENV.GITHUB.CALLBACK_URL,
  });

  const result = await httpRequest(
    {
      hostname: 'github.com',
      path: '/login/oauth/access_token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    },
    body
  );

  if (result.data.error) {
    throw new Error(`GitHub OAuth token exchange failed: ${result.data.error_description || result.data.error}`);
  }
  if (!result.data.access_token) {
    throw new Error('GitHub did not return an access token.');
  }

  return {
    access_token: result.data.access_token,
    scope: result.data.scope || '',
    token_type: result.data.token_type || 'bearer',
  };
}

// ---------------------------------------------------------------------------
// GitHub API — Get authenticated user
// ---------------------------------------------------------------------------
export async function getGitHubUser(accessToken: string): Promise<{
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
}> {
  const result = await httpRequest({
    hostname: 'api.github.com',
    path: '/user',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'PlacementPortal/1.0',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (result.status === 401) {
    throw new GitHubAuthError('GitHub access token has expired or was revoked.');
  }
  if (result.status !== 200) {
    throw new Error(`Failed to fetch GitHub user: HTTP ${result.status}`);
  }

  return result.data;
}

// ---------------------------------------------------------------------------
// GitHub API — List user's repositories
// ---------------------------------------------------------------------------
export interface GitHubRepo {
  id: number;
  full_name: string;
  name: string;
  owner: { login: string };
  private: boolean;
  html_url: string;
  description: string | null;
  default_branch: string;
  permissions?: { push: boolean; pull: boolean; admin: boolean };
  updated_at: string;
}

export async function getUserRepositories(
  accessToken: string,
  page: number = 1,
  perPage: number = 50
): Promise<GitHubRepo[]> {
  const result = await httpRequest({
    hostname: 'api.github.com',
    path: `/user/repos?sort=updated&per_page=${perPage}&page=${page}&affiliation=owner,collaborator`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'PlacementPortal/1.0',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (result.status === 401) {
    throw new GitHubAuthError('GitHub access token has expired or was revoked.');
  }
  if (result.status !== 200) {
    throw new Error(`Failed to fetch repositories: HTTP ${result.status}`);
  }

  return Array.isArray(result.data) ? result.data : [];
}

// ---------------------------------------------------------------------------
// GitHub API — Verify push access to a specific repo
// ---------------------------------------------------------------------------
export async function verifyRepoPushAccess(
  accessToken: string,
  owner: string,
  repo: string
): Promise<boolean> {
  const result = await httpRequest({
    hostname: 'api.github.com',
    path: `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'PlacementPortal/1.0',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (result.status === 401) {
    throw new GitHubAuthError('GitHub access token has expired or was revoked.');
  }
  if (result.status === 404) return false;
  if (result.status !== 200) return false;
  return result.data?.permissions?.push === true;
}

// ---------------------------------------------------------------------------
// GitHub API — Get file SHA (needed to update existing files)
// ---------------------------------------------------------------------------
async function getFileSha(
  accessToken: string,
  owner: string,
  repo: string,
  branch: string,
  filePath: string
): Promise<string | null> {
  const result = await httpRequest({
    hostname: 'api.github.com',
    path: `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${filePath}?ref=${encodeURIComponent(branch)}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'PlacementPortal/1.0',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (result.status === 200 && result.data?.sha) {
    return result.data.sha as string;
  }
  return null;
}

// ---------------------------------------------------------------------------
// GitHub API — Push a single file
// ---------------------------------------------------------------------------
export interface GitHubFile {
  path: string;       // e.g. "java/arrays/TwoSum.java"
  content: string;    // raw string content (will be base64-encoded)
  message: string;    // commit message for this file
}

export interface PushResult {
  commitSha: string;
  commitUrl: string;
  filePaths: string[];
}

export async function pushFilesToGitHub(
  accessToken: string,
  owner: string,
  repo: string,
  branch: string,
  files: GitHubFile[]
): Promise<PushResult> {
  let lastCommitSha = '';
  let lastCommitUrl = '';
  const pushedPaths: string[] = [];

  for (const file of files) {
    // Check if file already exists to get its SHA
    const existingSha = await getFileSha(accessToken, owner, repo, branch, file.path);

    const bodyObj: Record<string, any> = {
      message: file.message,
      content: Buffer.from(file.content, 'utf8').toString('base64'),
      branch,
    };
    if (existingSha) {
      bodyObj.sha = existingSha;
    }

    const bodyStr = JSON.stringify(bodyObj);
    const result = await httpRequest(
      {
        hostname: 'api.github.com',
        path: `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${file.path}`,
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'User-Agent': 'PlacementPortal/1.0',
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Length': Buffer.byteLength(bodyStr),
        },
      },
      bodyStr
    );

    if (result.status === 401) {
      throw new GitHubAuthError('GitHub access token has expired or was revoked.');
    }

    if (result.status !== 200 && result.status !== 201) {
      throw new Error(
        `Failed to push file "${file.path}": HTTP ${result.status} — ${
          typeof result.data === 'object' ? result.data?.message : result.data
        }`
      );
    }

    lastCommitSha = result.data?.commit?.sha || '';
    lastCommitUrl = result.data?.commit?.html_url || '';
    pushedPaths.push(file.path);
  }

  return {
    commitSha: lastCommitSha,
    commitUrl: lastCommitUrl,
    filePaths: pushedPaths,
  };
}

// ---------------------------------------------------------------------------
// GitHub API — Revoke OAuth token (on disconnect)
// ---------------------------------------------------------------------------
export async function revokeToken(accessToken: string): Promise<void> {
  const clientId = ENV.GITHUB.CLIENT_ID;
  const clientSecret = ENV.GITHUB.CLIENT_SECRET;
  if (!clientId || !clientSecret) return;

  const bodyStr = JSON.stringify({ access_token: accessToken });
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    await httpRequest(
      {
        hostname: 'api.github.com',
        path: `/applications/${clientId}/token`,
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'User-Agent': 'PlacementPortal/1.0',
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Length': Buffer.byteLength(bodyStr),
        },
      },
      bodyStr
    );
  } catch {
    // Best-effort revocation — don't block disconnect on failure
  }
}

// ---------------------------------------------------------------------------
// GitHub API — List repository branches
// ---------------------------------------------------------------------------
export interface GitHubBranch {
  name: string;
  commit: { sha: string; url: string };
  protected: boolean;
}

export async function getRepositoryBranches(
  accessToken: string,
  owner: string,
  repo: string
): Promise<GitHubBranch[]> {
  const result = await httpRequest({
    hostname: 'api.github.com',
    path: `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/branches?per_page=100`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'PlacementPortal/1.0',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (result.status === 401) {
    throw new GitHubAuthError('GitHub access token has expired or was revoked.');
  }
  if (result.status !== 200) {
    throw new Error(`Failed to fetch branches: HTTP ${result.status}`);
  }

  return Array.isArray(result.data) ? result.data : [];
}

// ---------------------------------------------------------------------------
// Path Sanitization & Validation Helpers
// ---------------------------------------------------------------------------
export function sanitizePathSegment(name: string, fallback: string = 'General'): string {
  const cleaned = (name || '')
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 80);
  return cleaned || fallback;
}

export function isValidGitHubFilePath(filePath: string): boolean {
  if (!filePath || typeof filePath !== 'string') return false;
  if (filePath.includes('\0') || filePath.includes('\\')) return false;
  if (filePath.startsWith('/') || filePath.startsWith('.')) return false;
  const segments = filePath.split('/');
  if (segments.some((s) => s === '..' || s === '.' || s.trim() === '')) return false;
  if (filePath.length > 250) return false;
  if (!/\.(java|txt|md|cpp|py)$/i.test(filePath)) return false;
  return true;
}

// ---------------------------------------------------------------------------
// Generate solution file content for push
// ---------------------------------------------------------------------------
export function generateJavaSolutionContent(params: {
  problemId?: number | string;
  problemTitle: string;
  problemDescription: string;
  difficulty: string;
  topicName: string;
  inputFormat?: string;
  outputFormat?: string;
  constraints?: string;
  sampleInput?: string;
  sampleOutput?: string;
  explanation?: string;
  code: string;
  username: string;
  pushedAt: string;
  status?: string;
}): string {
  const {
    problemId,
    problemTitle,
    problemDescription,
    difficulty,
    topicName,
    inputFormat,
    outputFormat,
    constraints,
    sampleInput,
    sampleOutput,
    explanation,
    code,
    username,
    pushedAt,
    status = 'Solved / Accepted',
  } = params;

  let doc = `/**
 * ============================================================================
 * Problem: ${problemTitle}
 * Problem ID: ${problemId || 'N/A'}
 * Topic: ${topicName}
 * Difficulty: ${difficulty}
 * Status: ${status}
 * Author: ${username}
 * Pushed at: ${pushedAt}
 * ============================================================================
 *
 * Description:
 * ${(problemDescription || '').replace(/\n/g, '\n * ')}
`;

  if (inputFormat && inputFormat.trim()) {
    doc += ` *
 * Input Format:
 * ${inputFormat.trim().replace(/\n/g, '\n * ')}
`;
  }

  if (outputFormat && outputFormat.trim()) {
    doc += ` *
 * Output Format:
 * ${outputFormat.trim().replace(/\n/g, '\n * ')}
`;
  }

  if (constraints && constraints.trim()) {
    doc += ` *
 * Constraints:
 * ${constraints.trim().replace(/\n/g, '\n * ')}
`;
  }

  if (sampleInput && sampleInput.trim()) {
    doc += ` *
 * Sample Input:
 * ${sampleInput.trim().replace(/\n/g, '\n * ')}
`;
  }

  if (sampleOutput && sampleOutput.trim()) {
    doc += ` *
 * Sample Output:
 * ${sampleOutput.trim().replace(/\n/g, '\n * ')}
`;
  }

  if (explanation && explanation.trim()) {
    doc += ` *
 * Explanation:
 * ${explanation.trim().replace(/\n/g, '\n * ')}
`;
  }

  doc += ` */

${code}
`;
  return doc;
}

export function generateReadmeContent(params: {
  problemId?: number | string;
  problemTitle: string;
  difficulty: string;
  topicName: string;
  problemDescription: string;
  inputFormat?: string;
  outputFormat?: string;
  constraints?: string;
  sampleInput?: string;
  sampleOutput?: string;
  explanation?: string;
  javaFileName?: string;
  commitUrl?: string;
  username: string;
  pushedAt: string;
  status?: string;
}): string {
  const {
    problemId,
    problemTitle,
    difficulty,
    topicName,
    problemDescription,
    inputFormat,
    outputFormat,
    constraints,
    sampleInput,
    sampleOutput,
    explanation,
    javaFileName = 'Solution.java',
    commitUrl,
    username,
    pushedAt,
    status = 'Solved / Accepted',
  } = params;

  const difficultyBadge = difficulty?.toUpperCase() === 'EASY'
    ? '🟢 Easy'
    : difficulty?.toUpperCase() === 'MEDIUM'
    ? '🟡 Medium'
    : '🔴 Hard';

  let md = `# ${problemTitle}

| Field | Details |
|---|---|
| **Problem ID** | \`${problemId || 'N/A'}\` |
| **Topic** | ${topicName} |
| **Difficulty** | ${difficultyBadge} |
| **Submission Status** | ✅ ${status} |
| **Author** | [@${username}](https://github.com/${username}) |
| **Date** | ${pushedAt} |

## Problem Description

${problemDescription || 'No description provided.'}

`;

  if (inputFormat && inputFormat.trim()) {
    md += `### Input Format

${inputFormat.trim()}

`;
  }

  if (outputFormat && outputFormat.trim()) {
    md += `### Output Format

${outputFormat.trim()}

`;
  }

  if (constraints && constraints.trim()) {
    md += `### Constraints

\`\`\`
${constraints.trim()}
\`\`\`

`;
  }

  if (sampleInput && sampleInput.trim()) {
    md += `### Sample Input

\`\`\`
${sampleInput.trim()}
\`\`\`

`;
  }

  if (sampleOutput && sampleOutput.trim()) {
    md += `### Sample Output

\`\`\`
${sampleOutput.trim()}
\`\`\`

`;
  }

  if (explanation && explanation.trim()) {
    md += `## Explanation

${explanation.trim()}

`;
  }

  md += `## Solution

- **Language:** Java
- **Source Code:** [\`${javaFileName}\`](./${javaFileName})

---

*Pushed from [Placement Practice Portal](https://practice-portal-mu.vercel.app)${commitUrl ? ` • [View Commit](${commitUrl})` : ''}*
`;

  return md;
}


