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
  auto_push_on_accept?: boolean;
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

export interface GitHubBranch {
  name: string;
  protected: boolean;
  commit_sha?: string;
}

export interface PushSolutionParams {
  problem_id?: number;
  problem_title: string;
  problem_description: string;
  difficulty: string;
  topic_name: string;
  explanation?: string;
  code: string;
  language?: string;
  status?: string;
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

  const baseUrl = api.defaults.baseURL || 'http://localhost:5001/api';
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

export async function getRepoBranches(owner: string, repo: string): Promise<GitHubBranch[]> {
  const res = await api.get<{ success: boolean; data: GitHubBranch[] }>(
    `/github/repositories/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/branches`
  );
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

export async function toggleAutoPush(auto_push: boolean): Promise<boolean> {
  const res = await api.post<{ success: boolean; data: { auto_push_on_accept: boolean } }>('/github/auto-push', {
    auto_push,
  });
  return res.data.data.auto_push_on_accept;
}
