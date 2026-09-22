import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Github,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  FolderGit2,
  GitBranch,
  Trash2,
  Lock,
  Globe,
  Loader2,
  Link as LinkIcon,
} from 'lucide-react';
import {
  getGitHubStatus,
  getRepositories,
  selectRepository,
  disconnectGitHub,
  initiateGitHubOAuth,
  GitHubStatus,
  GitHubRepo,
} from '../api/github';

export const GitHubConnect: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useState<GitHubStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [reposLoading, setReposLoading] = useState(false);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [selectedRepoFullName, setSelectedRepoFullName] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('main');
  const [savingRepo, setSavingRepo] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Check URL query parameters on return from OAuth
  useEffect(() => {
    const githubParam = searchParams.get('github');
    const username = searchParams.get('username');
    const reason = searchParams.get('reason');

    if (githubParam === 'connected') {
      setMessage({
        type: 'success',
        text: `Successfully connected GitHub account${username ? ` (${username})` : ''}! Now select a repository below.`,
      });
      cleanUrlParams();
    } else if (githubParam === 'denied') {
      setMessage({
        type: 'info',
        text: 'GitHub connection was cancelled or denied.',
      });
      cleanUrlParams();
    } else if (githubParam === 'error') {
      setMessage({
        type: 'error',
        text: `Failed to connect GitHub account (${reason || 'unknown error'}). Please try again.`,
      });
      cleanUrlParams();
    }
  }, [searchParams]);

  const cleanUrlParams = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('github');
    nextParams.delete('username');
    nextParams.delete('reason');
    setSearchParams(nextParams, { replace: true });
  };

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const data = await getGitHubStatus();
      setStatus(data);
      if (data.connected && data.selected_repo_full_name) {
        setSelectedRepoFullName(data.selected_repo_full_name);
        setSelectedBranch(data.selected_branch || 'main');
      }
    } catch (err: any) {
      console.error('Failed to load GitHub status', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // Fetch repositories if connected
  const handleLoadRepos = async () => {
    if (!status?.connected) return;
    try {
      setReposLoading(true);
      const data = await getRepositories(1);
      setRepos(data);
      if (!selectedRepoFullName && data.length > 0) {
        setSelectedRepoFullName(data[0].full_name);
        setSelectedBranch(data[0].default_branch || 'main');
      }
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to load GitHub repositories.',
      });
    } finally {
      setReposLoading(false);
    }
  };

  const handleConnect = () => {
    if (!status?.configured) {
      setMessage({
        type: 'error',
        text: 'GitHub OAuth is not yet configured in backend environment variables (GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET).',
      });
      return;
    }
    initiateGitHubOAuth();
  };

  const handleSaveRepo = async () => {
    if (!selectedRepoFullName) {
      setMessage({ type: 'error', text: 'Please select a repository.' });
      return;
    }

    try {
      setSavingRepo(true);
      setMessage(null);
      await selectRepository({
        repo_full_name: selectedRepoFullName,
        branch: selectedBranch || 'main',
      });
      setMessage({
        type: 'success',
        text: `Repository "${selectedRepoFullName}" (branch: ${selectedBranch || 'main'}) successfully linked!`,
      });
      await fetchStatus();
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to save selected repository.',
      });
    } finally {
      setSavingRepo(false);
    }
  };

  const handleDisconnect = async () => {
    const confirm = window.confirm(
      'Are you sure you want to disconnect your GitHub account? Pushed code on GitHub will remain intact.'
    );
    if (!confirm) return;

    try {
      setDisconnecting(true);
      setMessage(null);
      await disconnectGitHub();
      setMessage({ type: 'info', text: 'GitHub account disconnected successfully.' });
      setRepos([]);
      setSelectedRepoFullName('');
      await fetchStatus();
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to disconnect GitHub account.',
      });
    } finally {
      setDisconnecting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#FFFDF9] dark:bg-[#0D121F] rounded-3xl border border-[#E5DED4] dark:border-slate-800 p-6 shadow-xs flex items-center justify-center py-10">
        <Loader2 className="w-6 h-6 animate-spin text-[#244D38] dark:text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF9] dark:bg-[#0D121F] rounded-3xl border border-[#E5DED4] dark:border-slate-800 p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5DED4] dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#181717] dark:bg-slate-800 text-white flex items-center justify-center shadow-xs">
            <Github className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#17211B] dark:text-white flex items-center gap-2">
              <span>GitHub Integration</span>
              {status?.connected ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#E8F3EB] text-[#24543F] dark:bg-emerald-950/40 dark:text-emerald-400">
                  <CheckCircle className="w-3 h-3" />
                  Connected
                </span>
              ) : (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  Not Connected
                </span>
              )}
            </h2>
            <p className="text-xs text-[#5F665F] dark:text-slate-400">
              Push your accepted Java solutions and notes directly to your personal GitHub repository
            </p>
          </div>
        </div>

        {status?.connected && (
          <button
            onClick={handleDisconnect}
            disabled={disconnecting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900/40 transition-colors cursor-pointer disabled:opacity-50 self-start sm:self-auto"
          >
            {disconnecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            <span>Disconnect</span>
          </button>
        )}
      </div>

      {/* Alert Notification */}
      {message && (
        <div
          className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 border ${
            message.type === 'success'
              ? 'bg-[#E8F3EB] text-[#24543F] border-[#B7D8BF] dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800'
              : message.type === 'error'
              ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800'
              : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800'
          }`}
        >
          {message.type === 'success' && <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />}
          {message.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
          {message.type === 'info' && <LinkIcon className="w-4 h-4 shrink-0 mt-0.5" />}
          <div className="flex-1 font-medium">{message.text}</div>
          <button
            onClick={() => setMessage(null)}
            className="text-slate-400 hover:text-slate-600 text-xs font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Connected Account Details */}
      {status?.connected ? (
        <div className="space-y-5">
          {/* User profile banner */}
          <div className="p-4 rounded-2xl bg-[#FAF8F2] dark:bg-slate-900/60 border border-[#E5DED4] dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {status.github_avatar_url ? (
                <img
                  src={status.github_avatar_url}
                  alt={status.github_username}
                  className="w-10 h-10 rounded-full border border-white/60 dark:border-slate-700 shadow-xs"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300">
                  {status.github_username?.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#6E756D] dark:text-slate-400">
                  Connected Account
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#17211B] dark:text-white">
                    @{status.github_username}
                  </span>
                  {status.github_profile_url && (
                    <a
                      href={status.github_profile_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#244D38] dark:text-emerald-400 hover:underline inline-flex items-center gap-0.5 text-xs font-medium"
                    >
                      <span>Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right text-xs text-[#6E756D] dark:text-slate-400">
              <p>Connected on</p>
              <p className="font-medium text-[#17211B] dark:text-slate-200">
                {status.connected_at ? new Date(status.connected_at).toLocaleDateString() : 'Active'}
              </p>
            </div>
          </div>

          {/* Repository Selection */}
          <div className="p-5 rounded-2xl bg-[#FAF8F2] dark:bg-slate-900/60 border border-[#E5DED4] dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-[#244D38] dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-[#17211B] dark:text-white">
                  Target Repository & Branch
                </h3>
              </div>
              <button
                type="button"
                onClick={handleLoadRepos}
                disabled={reposLoading}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#244D38] dark:text-emerald-400 hover:underline cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${reposLoading ? 'animate-spin' : ''}`} />
                <span>{repos.length > 0 ? 'Refresh Repositories' : 'Load My Repositories'}</span>
              </button>
            </div>

            <p className="text-xs text-[#5F665F] dark:text-slate-400">
              Choose the repository where your Java problem solutions will be committed.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Repository Selector */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#6E756D] dark:text-slate-400 mb-1">
                  Repository
                </label>
                {repos.length > 0 ? (
                  <select
                    value={selectedRepoFullName}
                    onChange={(e) => {
                      setSelectedRepoFullName(e.target.value);
                      const match = repos.find((r) => r.full_name === e.target.value);
                      if (match?.default_branch) {
                        setSelectedBranch(match.default_branch);
                      }
                    }}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#E5DED4] dark:border-slate-700 text-xs font-medium text-[#17211B] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#244D38]"
                  >
                    <option value="">Select a repository...</option>
                    {repos.map((repo) => (
                      <option key={repo.id} value={repo.full_name} disabled={!repo.can_push}>
                        {repo.full_name} {repo.private ? '(Private)' : '(Public)'} {!repo.can_push ? '— No Push Access' : ''}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. username/placement-solutions"
                      value={selectedRepoFullName}
                      onChange={(e) => setSelectedRepoFullName(e.target.value)}
                      className="flex-1 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#E5DED4] dark:border-slate-700 text-xs font-mono text-[#17211B] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#244D38]"
                    />
                    <button
                      type="button"
                      onClick={handleLoadRepos}
                      disabled={reposLoading}
                      className="px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-800 border border-[#E5DED4] dark:border-slate-700 rounded-xl text-[#244D38] dark:text-emerald-400 hover:bg-[#FAF8F2] cursor-pointer"
                    >
                      {reposLoading ? 'Loading...' : 'Browse'}
                    </button>
                  </div>
                )}
              </div>

              {/* Branch Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#6E756D] dark:text-slate-400 mb-1 flex items-center gap-1">
                  <GitBranch className="w-3 h-3" />
                  Branch
                </label>
                <input
                  type="text"
                  placeholder="main"
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#E5DED4] dark:border-slate-700 text-xs font-mono text-[#17211B] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#244D38]"
                />
              </div>
            </div>

            {/* Currently Active Repo Display */}
            {status.selected_repo_full_name && (
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs border-t border-[#E5DED4] dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-[#5F665F] dark:text-slate-400">
                  <span>Currently linked:</span>
                  <a
                    href={`https://github.com/${status.selected_repo_full_name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono font-semibold text-[#244D38] dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>{status.selected_repo_full_name}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  <span className="font-mono text-slate-500">({status.selected_branch || 'main'})</span>
                  {status.is_private_repo ? (
                    <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
                      <Lock className="w-2.5 h-2.5" /> Private
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      <Globe className="w-2.5 h-2.5" /> Public
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSaveRepo}
                  disabled={savingRepo || !selectedRepoFullName}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#244D38] hover:bg-[#1B3B2B] rounded-xl transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {savingRepo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                  <span>Save Target Repository</span>
                </button>
              </div>
            )}

            {!status.selected_repo_full_name && (
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveRepo}
                  disabled={savingRepo || !selectedRepoFullName}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#244D38] hover:bg-[#1B3B2B] rounded-xl transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {savingRepo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                  <span>Confirm Repository Selection</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Not Connected State */
        <div className="p-6 rounded-2xl bg-[#FAF8F2] dark:bg-slate-900/60 border border-[#E5DED4] dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="space-y-1 max-w-lg">
            <h3 className="text-sm font-bold text-[#17211B] dark:text-white">
              Connect your personal GitHub account
            </h3>
            <p className="text-xs text-[#5F665F] dark:text-slate-400">
              Authorizes the Placement Portal to commit solutions to your selected repository. No personal access token pasting required. Each user can connect their own separate account.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 text-[#5F665F] dark:text-slate-400 border border-[#E5DED4] dark:border-slate-700">
                🔒 AES-256 Encrypted
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 text-[#5F665F] dark:text-slate-400 border border-[#E5DED4] dark:border-slate-700">
                ⚡ Multi-User Isolated
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 text-[#5F665F] dark:text-slate-400 border border-[#E5DED4] dark:border-slate-700">
                🛡️ CSRF Protected
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleConnect}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#181717] hover:bg-[#2e2d2d] dark:bg-white dark:hover:bg-slate-100 text-white dark:text-[#181717] font-bold text-xs shadow-xs transition-all cursor-pointer shrink-0"
          >
            <Github className="w-4 h-4" />
            <span>Connect GitHub</span>
          </button>
        </div>
      )}
    </div>
  );
};
