import React, { useEffect, useState, useCallback } from 'react';
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
  Zap,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  getGitHubStatus,
  getRepositories,
  getRepoBranches,
  selectRepository,
  disconnectGitHub,
  initiateGitHubOAuth,
  toggleAutoPush,
  GitHubStatus,
  GitHubRepo,
  GitHubBranch,
} from '../api/github';

// ---------------------------------------------------------------------------
// Helper: human-readable error messages for known GitHub OAuth errors
// ---------------------------------------------------------------------------
function humanizeOAuthError(reason: string | null): string {
  switch (reason) {
    case 'missing_params':
      return 'Authorization was incomplete. Please try again.';
    case 'invalid_state':
      return 'Authorization session expired or was tampered with. Please try again.';
    case 'callback_failed':
      return 'GitHub returned an error during authorization. Check that the callback URL is correctly configured in your GitHub OAuth App.';
    case 'state_failed':
      return 'Failed to initiate authorization. Please try again.';
    default:
      return reason
        ? `Authorization failed (${reason}). Please try again.`
        : 'Authorization failed. Please try again.';
  }
}

export const GitHubConnect: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Core state
  const [status, setStatus] = useState<GitHubStatus | null>(null);
  const [loading, setLoading] = useState(true);

  // Repository selection state
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [reposLoading, setReposLoading] = useState(false);
  const [selectedRepoFullName, setSelectedRepoFullName] = useState<string>('');

  // Branch selection state
  const [branches, setBranches] = useState<GitHubBranch[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<string>('main');

  // Action loading state
  const [savingRepo, setSavingRepo] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [autoPush, setAutoPush] = useState(false);
  const [togglingAutoPush, setTogglingAutoPush] = useState(false);

  // Feedback message
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    text: string;
  } | null>(null);

  // -------------------------------------------------------------------
  // OAuth redirect return: read URL query params set by backend callback
  // -------------------------------------------------------------------
  useEffect(() => {
    const githubParam = searchParams.get('github');
    const username = searchParams.get('username');
    const reason = searchParams.get('reason');

    if (githubParam === 'connected') {
      setMessage({
        type: 'success',
        text: `✅ Successfully connected GitHub account${username ? ` (@${username})` : ''}! Now load and select a repository below.`,
      });
      cleanUrlParams();
    } else if (githubParam === 'denied') {
      setMessage({
        type: 'info',
        text: 'GitHub authorization was cancelled. You can try again anytime.',
      });
      cleanUrlParams();
    } else if (githubParam === 'error') {
      setMessage({
        type: 'error',
        text: humanizeOAuthError(reason),
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

  // -------------------------------------------------------------------
  // Fetch current GitHub connection status
  // -------------------------------------------------------------------
  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getGitHubStatus();
      setStatus(data);
      setAutoPush(Boolean(data.auto_push_on_accept));
      if (data.connected && data.selected_repo_full_name) {
        setSelectedRepoFullName(data.selected_repo_full_name);
        setSelectedBranch(data.selected_branch || 'main');
      }
    } catch (err: any) {
      console.error('Failed to load GitHub status', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // -------------------------------------------------------------------
  // Fetch branches when a repo is selected
  // -------------------------------------------------------------------
  const fetchBranches = useCallback(async (repoFullName: string) => {
    if (!repoFullName || !repoFullName.includes('/')) return;
    const [owner, repo] = repoFullName.split('/');
    try {
      setBranchesLoading(true);
      setBranches([]);
      const data = await getRepoBranches(owner, repo);
      setBranches(data);
      // Keep the current selectedBranch if it exists in the list, else default to first or 'main'
      const exists = data.find((b) => b.name === selectedBranch);
      if (!exists && data.length > 0) {
        setSelectedBranch(data[0].name);
      }
    } catch (err: any) {
      // Non-fatal: user can still type a branch manually
      console.warn('Could not fetch branches:', err.message);
      setBranches([]);
    } finally {
      setBranchesLoading(false);
    }
  }, [selectedBranch]);

  // -------------------------------------------------------------------
  // Handle repository selection change
  // -------------------------------------------------------------------
  const handleRepoChange = (repoFullName: string) => {
    setSelectedRepoFullName(repoFullName);
    const match = repos.find((r) => r.full_name === repoFullName);
    const defaultBranch = match?.default_branch || 'main';
    setSelectedBranch(defaultBranch);
    setBranches([]);
    if (repoFullName) {
      fetchBranches(repoFullName);
    }
  };

  // -------------------------------------------------------------------
  // Load repositories from GitHub
  // -------------------------------------------------------------------
  const handleLoadRepos = async () => {
    if (!status?.connected) return;
    try {
      setReposLoading(true);
      setMessage(null);
      const data = await getRepositories(1);
      setRepos(data);
      if (data.length === 0) {
        setMessage({ type: 'info', text: 'No repositories found in your GitHub account. Create one on GitHub first.' });
      }
      // Auto-select first pushable repo if none selected
      if (!selectedRepoFullName) {
        const first = data.find((r) => r.can_push);
        if (first) {
          setSelectedRepoFullName(first.full_name);
          setSelectedBranch(first.default_branch || 'main');
          fetchBranches(first.full_name);
        }
      } else {
        // Refresh branches for currently selected repo
        fetchBranches(selectedRepoFullName);
      }
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.data?.reconnect_required) {
        setStatus((prev) => (prev ? { ...prev, connected: false } : null));
        setMessage({
          type: 'error',
          text: '⚠️ Your GitHub authorization has expired or was revoked. Please click "Connect GitHub" below to reconnect your account.',
        });
      } else {
        setMessage({
          type: 'error',
          text: err.response?.data?.message || 'Failed to load GitHub repositories. Your authorization may have expired — try disconnecting and reconnecting.',
        });
      }
    } finally {
      setReposLoading(false);
    }
  };

  // -------------------------------------------------------------------
  // Initiate OAuth Connect flow
  // -------------------------------------------------------------------
  const handleConnect = () => {
    if (!status?.configured) {
      setMessage({
        type: 'warning',
        text: 'GitHub OAuth is not configured on this server yet. Add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to your Render backend environment variables, then redeploy.',
      });
      return;
    }
    // Redirect to backend which redirects to GitHub's authorization page
    initiateGitHubOAuth();
  };

  // -------------------------------------------------------------------
  // Save selected repository to backend
  // -------------------------------------------------------------------
  const handleSaveRepo = async () => {
    if (!selectedRepoFullName) {
      setMessage({ type: 'error', text: 'Please select a repository first.' });
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
        text: `✅ Repository "${selectedRepoFullName}" (branch: ${selectedBranch || 'main'}) linked successfully! You can now push solutions.`,
      });
      await fetchStatus();
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.data?.reconnect_required) {
        setStatus((prev) => (prev ? { ...prev, connected: false } : null));
        setMessage({
          type: 'error',
          text: '⚠️ Your GitHub authorization has expired or was revoked. Please click "Connect GitHub" below to reconnect your account.',
        });
      } else {
        const msg = err.response?.data?.message || 'Failed to save repository selection.';
        if (msg.toLowerCase().includes('push access')) {
          setMessage({
            type: 'error',
            text: `No push access to "${selectedRepoFullName}". Select a repository you own or have write permissions to.`,
          });
        } else {
          setMessage({ type: 'error', text: msg });
        }
      }
    } finally {
      setSavingRepo(false);
    }
  };

  // -------------------------------------------------------------------
  // Disconnect GitHub
  // -------------------------------------------------------------------
  const handleDisconnect = async () => {
    const confirm = window.confirm(
      'Disconnect your GitHub account?\n\nThis removes the connection from this portal. Any code already pushed to GitHub will remain there.'
    );
    if (!confirm) return;

    try {
      setDisconnecting(true);
      setMessage(null);
      await disconnectGitHub();
      setMessage({ type: 'info', text: 'GitHub account disconnected. You can reconnect at any time.' });
      setRepos([]);
      setBranches([]);
      setSelectedRepoFullName('');
      setSelectedBranch('main');
      await fetchStatus();
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to disconnect. Please try again.',
      });
    } finally {
      setDisconnecting(false);
    }
  };

  // -------------------------------------------------------------------
  // Toggle auto-push setting
  // -------------------------------------------------------------------
  const handleToggleAutoPush = async () => {
    try {
      setTogglingAutoPush(true);
      const nextVal = !autoPush;
      const res = await toggleAutoPush(nextVal);
      setAutoPush(res);
      setMessage({
        type: 'success',
        text: res
          ? '⚡ Auto-push enabled — solutions are committed to GitHub automatically on Accepted submissions.'
          : 'Auto-push disabled — use the Push button manually on each problem.',
      });
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update auto-push setting.',
      });
    } finally {
      setTogglingAutoPush(false);
    }
  };

  // -------------------------------------------------------------------
  // Loading skeleton
  // -------------------------------------------------------------------
  if (loading) {
    return (
      <div className="bg-[#FFFDF9] dark:bg-[#0D121F] rounded-3xl border border-[#E5DED4] dark:border-slate-800 p-6 shadow-xs flex items-center justify-center py-10">
        <Loader2 className="w-6 h-6 animate-spin text-[#244D38] dark:text-emerald-400" />
      </div>
    );
  }

  // -------------------------------------------------------------------
  // Helpers for message styling
  // -------------------------------------------------------------------
  const msgStyle = {
    success: 'bg-[#E8F3EB] text-[#24543F] border-[#B7D8BF] dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800',
    error: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800',
    info: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800',
    warning: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800',
  };
  const msgIcon = {
    success: <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />,
    info: <Info className="w-4 h-4 shrink-0 mt-0.5" />,
    warning: <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />,
  };

  return (
    <div className="bg-[#FFFDF9] dark:bg-[#0D121F] rounded-3xl border border-[#E5DED4] dark:border-slate-800 p-6 shadow-xs space-y-6">
      {/* ----------------------------------------------------------------- */}
      {/* Header */}
      {/* ----------------------------------------------------------------- */}
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
              Push accepted Java solutions directly to your personal GitHub repository
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

      {/* ----------------------------------------------------------------- */}
      {/* Alert Message */}
      {/* ----------------------------------------------------------------- */}
      {message && (
        <div
          className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 border ${msgStyle[message.type]}`}
        >
          {msgIcon[message.type]}
          <div className="flex-1 font-medium">{message.text}</div>
          <button
            onClick={() => setMessage(null)}
            className="text-slate-400 hover:text-slate-600 text-xs font-bold ml-2 shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Not configured warning (backend env vars missing) */}
      {/* ----------------------------------------------------------------- */}
      {status && !status.configured && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-800 space-y-3">
          <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>GitHub OAuth App Not Configured — Action Required</span>
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-400">
            The backend is missing values for{' '}
            <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 rounded">GITHUB_CLIENT_ID</code> and{' '}
            <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 rounded">GITHUB_CLIENT_SECRET</code>.
            Once you add these to your{' '}
            <a
              href="https://dashboard.render.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold"
            >
              Render backend environment variables
            </a>
            , this notice will disappear and you can connect your account immediately.
          </p>
          <ol className="list-decimal list-inside space-y-1.5 text-xs text-amber-700 dark:text-amber-400 pl-1">
            <li>
              Go to{' '}
              <a
                href="https://github.com/settings/developers"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold"
              >
                github.com/settings/developers
              </a>{' '}
              → <strong>OAuth Apps</strong> → <strong>New OAuth App</strong>
            </li>
            <li>
              Set <strong>Authorization callback URL</strong> to exactly:
              <div className="mt-1 font-mono text-[11px] bg-amber-100 dark:bg-amber-900/40 px-2 py-1 rounded select-all break-all font-semibold">
                https://practice-portal-kmri.onrender.com/api/github/callback
              </div>
            </li>
            <li>
              Set <strong>Homepage URL</strong> to:
              <div className="mt-1 font-mono text-[11px] bg-amber-100 dark:bg-amber-900/40 px-2 py-1 rounded select-all break-all">
                https://practice-portal-mu.vercel.app
              </div>
            </li>
            <li>Copy the <strong>Client ID</strong> and generate a <strong>Client Secret</strong></li>
            <li>
              In Render → your backend service → <strong>Environment</strong> tab, add:
              <div className="mt-1.5 space-y-0.5 font-mono text-[11px] bg-amber-100 dark:bg-amber-900/40 px-2 py-1.5 rounded">
                <div>GITHUB_CLIENT_ID=your_github_client_id</div>
                <div>GITHUB_CLIENT_SECRET=your_github_client_secret</div>
                <div>GITHUB_CALLBACK_URL=https://practice-portal-kmri.onrender.com/api/github/callback</div>
                <div>FRONTEND_URL=https://practice-portal-mu.vercel.app</div>
              </div>
            </li>
          </ol>
          <p className="text-[11px] text-amber-600 dark:text-amber-500">
            📖 Both users (Javith-Farvez and kamalikasenthilnaathan09) will authorize independently through this single OAuth App.
          </p>
        </div>
      )}


      {/* ----------------------------------------------------------------- */}
      {/* Connected State */}
      {/* ----------------------------------------------------------------- */}
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
                      <span>View Profile</span>
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

          {/* Repository + Branch Selection */}
          <div className="p-5 rounded-2xl bg-[#FAF8F2] dark:bg-slate-900/60 border border-[#E5DED4] dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-[#244D38] dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-[#17211B] dark:text-white">
                  Target Repository &amp; Branch
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
              Choose the GitHub repository and branch where your solutions will be committed.
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
                    onChange={(e) => handleRepoChange(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#E5DED4] dark:border-slate-700 text-xs font-medium text-[#17211B] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#244D38]"
                  >
                    <option value="">Select a repository...</option>
                    {repos.map((repo) => (
                      <option key={repo.id} value={repo.full_name} disabled={!repo.can_push}>
                        {repo.full_name} {repo.private ? '(Private)' : '(Public)'}
                        {!repo.can_push ? ' — No Push Access' : ''}
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
                      className="px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-800 border border-[#E5DED4] dark:border-slate-700 rounded-xl text-[#244D38] dark:text-emerald-400 hover:bg-[#FAF8F2] cursor-pointer disabled:opacity-50"
                    >
                      {reposLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Browse'}
                    </button>
                  </div>
                )}
              </div>

              {/* Branch Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#6E756D] dark:text-slate-400 mb-1 flex items-center gap-1">
                  <GitBranch className="w-3 h-3" />
                  Branch
                  {branchesLoading && <Loader2 className="w-3 h-3 animate-spin ml-1" />}
                </label>
                {branches.length > 0 ? (
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#E5DED4] dark:border-slate-700 text-xs font-mono text-[#17211B] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#244D38]"
                  >
                    {branches.map((b) => (
                      <option key={b.name} value={b.name}>
                        {b.name}{b.protected ? ' (protected)' : ''}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="main"
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#E5DED4] dark:border-slate-700 text-xs font-mono text-[#17211B] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#244D38]"
                  />
                )}
              </div>
            </div>

            {/* Currently Active Repo */}
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
                    <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                      <Lock className="w-2.5 h-2.5" /> Private
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
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
                  <span>Update Repository</span>
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
                  {savingRepo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  <span>Confirm Repository</span>
                </button>
              </div>
            )}

            {/* Auto-Push Toggle */}
            <div className="pt-4 border-t border-[#E5DED4] dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-[#17211B] dark:text-white">
                    Auto-push on Accepted Submission
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                    Optional
                  </span>
                </div>
                <p className="text-[11px] text-[#5F665F] dark:text-slate-400">
                  When enabled, your solution is automatically committed to GitHub whenever all test cases pass.
                  {!status.selected_repo_full_name && ' (Requires a repository to be selected first.)'}
                </p>
              </div>
              <button
                type="button"
                onClick={handleToggleAutoPush}
                disabled={togglingAutoPush || !status.selected_repo_full_name}
                title={!status.selected_repo_full_name ? 'Select a repository first' : 'Toggle auto-push'}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-40 self-start sm:self-auto ${
                  autoPush ? 'bg-[#244D38]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                role="switch"
                aria-checked={autoPush}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    autoPush ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ----------------------------------------------------------------- */
        /* Not Connected State */
        /* ----------------------------------------------------------------- */
        <div className="p-6 rounded-2xl bg-[#FAF8F2] dark:bg-slate-900/60 border border-[#E5DED4] dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="space-y-1 max-w-lg">
            <h3 className="text-sm font-bold text-[#17211B] dark:text-white">
              Connect your personal GitHub account
            </h3>
            <p className="text-xs text-[#5F665F] dark:text-slate-400">
              Authorize the Placement Portal to commit solutions to your own repository.
              No personal access tokens. Each user connects their own account independently.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 text-[#5F665F] dark:text-slate-400 border border-[#E5DED4] dark:border-slate-700">
                🔒 AES-256 Encrypted Token Storage
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
            disabled={!status?.configured}
            title={!status?.configured ? 'GitHub OAuth not yet configured on the server' : 'Connect your GitHub account'}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#181717] hover:bg-[#2e2d2d] dark:bg-white dark:hover:bg-slate-100 text-white dark:text-[#181717] font-bold text-xs shadow-xs transition-all cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Github className="w-4 h-4" />
            <span>Connect GitHub</span>
            {status?.configured && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* How it works — footer info */}
      {/* ----------------------------------------------------------------- */}
      <div className="text-[11px] text-[#8A9189] dark:text-slate-500 flex flex-wrap gap-x-4 gap-y-1 pt-1 border-t border-[#E5DED4] dark:border-slate-800">
        <span className="flex items-center gap-1">
          <LinkIcon className="w-3 h-3" />
          Official GitHub OAuth — no password required
        </span>
        <span className="flex items-center gap-1">
          <Lock className="w-3 h-3" />
          Token never sent to frontend
        </span>
        <span className="flex items-center gap-1">
          <FolderGit2 className="w-3 h-3" />
          Files pushed to: <code className="font-mono">placement-solutions/Java/&lt;Topic&gt;/&lt;Problem&gt;/</code>
        </span>
      </div>
    </div>
  );
};
