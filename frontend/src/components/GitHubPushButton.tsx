import React, { useState, useEffect } from 'react';
import {
  Github,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Loader2,
  FolderGit2,
  FileCode2,
  FileText,
  X,
  GitBranch,
} from 'lucide-react';
import { getGitHubStatus, pushSolution, GitHubStatus } from '../api/github';
import { Link } from 'react-router-dom';

interface GitHubPushButtonProps {
  problemId?: number;
  problemTitle: string;
  problemDescription: string;
  difficulty: string;
  topicName: string;
  explanation?: string;
  statusText?: string;
  code: string;
  language?: string;
  compact?: boolean;
}

export const GitHubPushButton: React.FC<GitHubPushButtonProps> = ({
  problemId,
  problemTitle,
  problemDescription,
  difficulty,
  topicName,
  explanation,
  statusText = 'Solved / Accepted',
  code,
  language = 'java',
  compact = false,
}) => {
  const [status, setStatus] = useState<GitHubStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [result, setResult] = useState<{ commit_url: string; repo_full_name: string; file_paths: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setLoadingStatus(true);
      const data = await getGitHubStatus();
      setStatus(data);
    } catch {
      // If unauthenticated or offline, silently ignore
      setStatus(null);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleOpenModal = () => {
    fetchStatus();
    setResult(null);
    setError(null);
    setIsOpen(true);
  };

  const handlePush = async () => {
    if (!status?.connected || !status?.selected_repo_full_name) {
      setError('Please connect your GitHub account and select a repository in Settings first.');
      return;
    }

    try {
      setPushing(true);
      setError(null);

      const res = await pushSolution({
        problem_id: problemId,
        problem_title: problemTitle,
        problem_description: problemDescription,
        difficulty,
        topic_name: topicName,
        explanation,
        code,
        language,
        status: statusText,
      });

      setResult({
        commit_url: res.commit_url,
        repo_full_name: res.repo_full_name,
        file_paths: res.file_paths,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to push solution to GitHub.');
    } finally {
      setPushing(false);
    }
  };

  // Safe file paths preview (placement-solutions/Java/<Topic-Name>/<Problem-Name>/Solution.java)
  const safeTopicFolder = (topicName || 'Practice')
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 80) || 'General';
  const safeTitle = (problemTitle || 'Solution')
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 80) || 'Problem';
  const basePath = `placement-solutions/Java/${safeTopicFolder}/${safeTitle}`;
  const javaFilePath = `${basePath}/Solution.java`;
  const readmeFilePath = `${basePath}/README.md`;

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleOpenModal}
        disabled={loadingStatus}
        title="Push Solution to GitHub"
        className={
          compact
            ? 'p-1.5 rounded-xl border text-xs bg-[#FFFDF9] dark:bg-stone-800 border-[#E5DED4] dark:border-stone-700 text-[#17211B] dark:text-stone-200 hover:bg-[#F0EBE2] transition-colors cursor-pointer inline-flex items-center gap-1'
            : 'px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-[#181717] hover:bg-[#2d2c2c] dark:bg-slate-800 dark:hover:bg-slate-700 text-white shadow-xs transition-all active:scale-[0.98] cursor-pointer'
        }
      >
        <Github className="w-3.5 h-3.5" />
        {!compact && <span>Push to GitHub</span>}
      </button>

      {/* Push Confirmation & Status Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#FFFDF9] dark:bg-[#0D121F] rounded-3xl border border-[#E5DED4] dark:border-slate-800 p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DED4] dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#181717] text-white flex items-center justify-center">
                  <Github className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#17211B] dark:text-white">
                    Push Solution to GitHub
                  </h3>
                  <p className="text-[11px] text-[#5F665F] dark:text-slate-400">
                    Commit your code directly to your personal repository
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Based on State */}
            {!status?.connected ? (
              /* Case 1: GitHub Not Connected */
              <div className="p-5 rounded-2xl bg-[#FAF8F2] dark:bg-slate-900/60 border border-[#E5DED4] dark:border-slate-800 space-y-3 text-center">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <h4 className="text-sm font-bold text-[#17211B] dark:text-white">
                  GitHub Account Not Connected
                </h4>
                <p className="text-xs text-[#5F665F] dark:text-slate-400 max-w-sm mx-auto">
                  Connect your personal GitHub account in your Settings page to push code and keep track of your solutions.
                </p>
                <div className="pt-2">
                  <Link
                    to="/settings"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#181717] hover:bg-[#2d2c2c] text-white text-xs font-bold transition-all shadow-xs"
                    onClick={() => setIsOpen(false)}
                  >
                    <span>Go to Settings & Connect GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ) : !status.selected_repo_full_name ? (
              /* Case 2: Connected but no repo selected */
              <div className="p-5 rounded-2xl bg-[#FAF8F2] dark:bg-slate-900/60 border border-[#E5DED4] dark:border-slate-800 space-y-3 text-center">
                <FolderGit2 className="w-8 h-8 text-[#244D38] dark:text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-[#17211B] dark:text-white">
                  No Target Repository Selected
                </h4>
                <p className="text-xs text-[#5F665F] dark:text-slate-400 max-w-sm mx-auto">
                  Your GitHub account is connected as <strong>@{status.github_username}</strong>, but no target repository has been selected.
                </p>
                <div className="pt-2">
                  <Link
                    to="/settings"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#244D38] hover:bg-[#1B3B2B] text-white text-xs font-bold transition-all shadow-xs"
                    onClick={() => setIsOpen(false)}
                  >
                    <span>Select Repository in Settings</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ) : result ? (
              /* Case 3: Push Succeeded! */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#E8F3EB] dark:bg-emerald-950/30 border border-[#B7D8BF] dark:border-emerald-800 space-y-2">
                  <div className="flex items-center gap-2 text-[#24543F] dark:text-emerald-300 font-bold text-sm">
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span>Pushed to GitHub Successfully!</span>
                  </div>
                  <p className="text-xs text-[#24543F] dark:text-emerald-300">
                    Your code has been committed to <strong>{result.repo_full_name}</strong>.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF8F2] dark:bg-slate-900/60 border border-[#E5DED4] dark:border-slate-800 space-y-2 text-xs">
                  <p className="font-semibold text-[#6E756D] dark:text-slate-400 uppercase tracking-wider text-[10px]">
                    Created / Updated Files
                  </p>
                  {result.file_paths.map((p, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 font-mono text-slate-700 dark:text-slate-300">
                      <FileCode2 className="w-3.5 h-3.5 text-[#244D38] dark:text-emerald-400" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>

                {result.commit_url && (
                  <div className="pt-1 flex justify-center">
                    <a
                      href={result.commit_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#181717] hover:bg-[#2d2c2c] text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <Github className="w-4 h-4" />
                      <span>View Commit on GitHub</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            ) : (
              /* Case 4: Ready to Push Preview */
              <div className="space-y-4">
                {/* Target Repo info */}
                <div className="p-3.5 rounded-2xl bg-[#FAF8F2] dark:bg-slate-900/60 border border-[#E5DED4] dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-[#244D38] dark:text-emerald-400" />
                    <span className="font-bold text-[#17211B] dark:text-white">
                      {status.selected_repo_full_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[#6E756D] dark:text-slate-400 font-mono text-[11px]">
                    <GitBranch className="w-3 h-3" />
                    <span>{status.selected_branch || 'main'}</span>
                  </div>
                </div>

                {/* File preview */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[#6E756D] dark:text-slate-400">
                    Files to commit:
                  </p>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-[#E5DED4] dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center gap-2 font-mono text-slate-800 dark:text-slate-200">
                      <FileCode2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>{javaFilePath}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-slate-800 dark:text-slate-200">
                      <FileText className="w-3.5 h-3.5 text-amber-600" />
                      <span>{readmeFilePath}</span>
                    </div>
                  </div>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    disabled={pushing}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handlePush}
                    disabled={pushing}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#181717] hover:bg-[#2d2c2c] disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    {pushing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Pushing to GitHub...</span>
                      </>
                    ) : (
                      <>
                        <Github className="w-3.5 h-3.5" />
                        <span>Confirm & Push</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
