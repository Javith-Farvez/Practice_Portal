import api from './axios';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface GitHubStatus {
  connected: boolean;
  configured: boolean;
  github_username?: string;
  github_avatar_url?: string;
  github_profile_url?: string;
  selected_repo_full_name?: string;
  selected_repo_owner?: string;
  selected_repo_name?: string;
  selected_branch?: string;
  is_private_repo?: boolean;
  token_scope?: string;
  connected_at?: string;
}

export interface GitHubRepo {
  id: number;
  full_name: string;
  name: string;
  owner: string;
  private: boolean;
  html_url: string;
  description: string | null;
  default_branch: string;
  can_push: boolean;
  updated_at: string;
}

export interface PushSolutionParams {
  problem_id?: number;
  problem_title: string;
  problem_description: string;
  difficulty: string;
  topic_name: string;
  code: string;
  language?: string;
}

export interface PushSolutionResult {
  commit_sha: string;
  commit_url: string;
  file_paths: string[];
  repo_full_name: string;
  branch: string;
}

// ---------------------------------------------------------------------------
// Redirect the browser to the backend OAuth initiation endpoint.
// The backend will redirect to GitHub. The JWT token is passed via query param
// because browser redirects don't carry custom headers.
// ---------------------------------------------------------------------------
export function initiateGitHubOAuth(): void {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return;
  }

  // The backend GET /api/github/auth uses authenticateToken middleware.
  // Since it's a browser redirect (not XHR), we cannot send the Bearer header.
  // Solution: pass token in query string and read it in the middleware, OR
  // use a pre-authorized redirect URL approach.
  //
  // We use a short-lived approach: store token in sessionStorage then redirect.
  // The backend will read Authorization from the query param via a wrapper.
  const baseUrl = api.defaults.baseURL || 'http://localhost:5001/api';
  // Clean /api suffix and append github/auth with token
  const backendBase = baseUrl.replace(/\/api$/, '');
  window.location.href = `${backendBase}/api/github/auth?token=${encodeURIComponent(token)}`;
}

// ---------------------------------------------------------------------------
// API Functions
// ---------------------------------------------------------------------------
export async function getGitHubStatus(): Promise<GitHubStatus> {
  const res = await api.get<{ success: boolean; data: GitHubStatus }>('/github/status');
  return res.data.data;
}

export async function getRepositories(page: number = 1): Promise<GitHubRepo[]> {
  const res = await api.get<{ success: boolean; data: GitHubRepo[] }>(`/github/repositories?page=${page}`);
  return res.data.data;
}

export async function selectRepository(params: {
  repo_full_name: string;
  branch?: string;
}): Promise<{ selected_repo_full_name: string; selected_branch: string }> {
  const res = await api.post<{ success: boolean; data: any }>('/github/select-repository', params);
  return res.data.data;
}

export async function pushSolution(params: PushSolutionParams): Promise<PushSolutionResult> {
  const res = await api.post<{ success: boolean; data: PushSolutionResult }>('/github/push', params);
  return res.data.data;
}

export async function disconnectGitHub(): Promise<void> {
  await api.delete('/github/disconnect');
}
