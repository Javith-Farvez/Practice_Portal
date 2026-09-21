import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import {
  Send,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Code2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  Loader2,
  Copy,
  Check,
  RotateCcw,
  Zap,
  HardDrive,
  Coffee,
  Eye,
  X,
} from 'lucide-react';

interface SubmissionItem {
  id: number;
  user_id: number;
  problem_id: number;
  problem_title: string;
  problem_slug: string;
  topic_id: number;
  topic_name: string;
  language: 'JAVA';
  status: 'ACCEPTED' | 'WRONG_ANSWER' | 'COMPILATION_ERROR' | 'RUNTIME_ERROR' | 'TIME_LIMIT_EXCEEDED';
  passed_tests: number;
  total_tests: number;
  runtime_ms: number;
  memory_kb: number;
  created_at: string;
}

interface SubmissionDetail extends SubmissionItem {
  source_code: string;
  error_message?: string | null;
  compile_output?: string | null;
}

interface TopicOption {
  id: number;
  name: string;
}

export const SubmissionHistoryPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [topics, setTopics] = useState<TopicOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(15);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Filters
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterTopic, setFilterTopic] = useState<string>('');

  // Detail Modal
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<number | null>(null);
  const [submissionDetail, setSubmissionDetail] = useState<SubmissionDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Fetch Topics for filter dropdown
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await api.get('/subjects/java');
        if (res.data.success && res.data.data.topics) {
          setTopics(res.data.data.topics.map((t: any) => ({ id: t.id, name: t.name })));
        }
      } catch (err) {
        console.error('Failed to fetch topics:', err);
      }
    };
    fetchTopics();
  }, []);

  // Fetch Submissions
  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit,
      };
      if (filterStatus) params.status = filterStatus;
      if (filterTopic) params.topic_id = filterTopic;

      const res = await api.get('/submissions', { params });
      if (res.data.success) {
        const data = res.data.data;
        setSubmissions(data.submissions || []);
        setTotalCount(data.total || 0);
        setTotalPages(Math.ceil((data.total || 0) / limit) || 1);
      }
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [page, filterStatus, filterTopic]);

  // Open detail modal and load complete submission
  const handleOpenDetail = async (id: number) => {
    setSelectedSubmissionId(id);
    setDetailLoading(true);
    setCopied(false);
    try {
      const res = await api.get(`/submissions/${id}`);
      if (res.data.success) {
        setSubmissionDetail(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load submission detail:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedSubmissionId(null);
    setSubmissionDetail(null);
  };

  const handleCopyCode = () => {
    if (submissionDetail?.source_code) {
      navigator.clipboard.writeText(submissionDetail.source_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#244D38]/10 text-[#244D38] dark:text-emerald-400 border border-[#244D38]/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Accepted</span>
          </span>
        );
      case 'WRONG_ANSWER':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" />
            <span>Wrong Answer</span>
          </span>
        );
      case 'COMPILATION_ERROR':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Compile Error</span>
          </span>
        );
      case 'RUNTIME_ERROR':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Runtime Error</span>
          </span>
        );
      case 'TIME_LIMIT_EXCEEDED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <Clock className="w-3.5 h-3.5" />
            <span>Time Limit Exceeded</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-stone-500/10 text-stone-600 dark:text-stone-400">
            <span>{status}</span>
          </span>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#244D38]/10 text-[#244D38] dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Send className="w-3.5 h-3.5" />
            <span>Code Telemetry & Submissions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#17211B] dark:text-white">
            Submission History
          </h1>
          <p className="text-xs sm:text-sm text-[#5F665F] dark:text-stone-400 mt-1">
            Complete audit trail of your Java code submissions, runtime performance, and test case verdicts.
          </p>
        </div>

        <div className="text-xs font-mono font-bold px-3.5 py-2 rounded-2xl bg-[#FFFDF9] dark:bg-[#1E1813] border border-[#E5DED4] dark:border-stone-800 text-[#17211B] dark:text-stone-200 self-start sm:self-auto shadow-2xs">
          Total Submissions: <strong className="text-[#244D38] dark:text-emerald-400">{totalCount}</strong>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#FFFDF9] dark:bg-[#1E1813] rounded-3xl p-4 sm:p-5 border border-[#E5DED4] dark:border-stone-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#17211B] dark:text-white">
            <Filter className="w-4 h-4 text-[#244D38] dark:text-emerald-400" />
            <span>Filters:</span>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-xl bg-[#F8F5EE] dark:bg-stone-900 border border-[#E5DED4] dark:border-stone-800 text-xs font-semibold text-[#17211B] dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-[#244D38] cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="WRONG_ANSWER">Wrong Answer</option>
            <option value="COMPILATION_ERROR">Compilation Error</option>
            <option value="RUNTIME_ERROR">Runtime Error</option>
            <option value="TIME_LIMIT_EXCEEDED">Time Limit Exceeded</option>
          </select>

          {/* Topic Filter */}
          <select
            value={filterTopic}
            onChange={(e) => {
              setFilterTopic(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-xl bg-[#F8F5EE] dark:bg-stone-900 border border-[#E5DED4] dark:border-stone-800 text-xs font-semibold text-[#17211B] dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-[#244D38] cursor-pointer max-w-[200px]"
          >
            <option value="">All Topics</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {/* Language Pill (Locked to Java) */}
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#244D38]/10 text-[#244D38] dark:text-emerald-400 border border-[#244D38]/20 text-xs font-bold">
            <Coffee className="w-3 h-3" />
            <span>Language: Java</span>
          </span>
        </div>

        {(filterStatus || filterTopic) && (
          <button
            type="button"
            onClick={() => {
              setFilterStatus('');
              setFilterTopic('');
              setPage(1);
            }}
            className="text-xs font-bold text-[#B95F3C] hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Submissions Table / Cards */}
      <div className="bg-[#FFFDF9] dark:bg-[#1E1813] rounded-3xl border border-[#E5DED4] dark:border-stone-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-7 h-7 animate-spin text-[#244D38] dark:text-emerald-400 mx-auto" />
            <p className="text-xs font-medium text-[#5F665F] dark:text-stone-400">Loading your submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="py-20 text-center space-y-4 max-w-sm mx-auto px-4">
            <div className="w-14 h-14 rounded-2xl bg-[#244D38]/10 text-[#244D38] dark:text-emerald-400 flex items-center justify-center mx-auto">
              <Code2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-base text-[#17211B] dark:text-white">No Submissions Found</h3>
              <p className="text-xs text-[#5F665F] dark:text-stone-400 leading-relaxed">
                {filterStatus || filterTopic
                  ? 'No submissions matched your active filters. Try resetting the filters.'
                  : 'You have not submitted code yet. Pick a Java problem and run your code!'}
              </p>
            </div>
            <div>
              <Link
                to="/java"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#244D38] hover:bg-[#1A3829] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                <span>Start Practicing Java</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5DED4] dark:border-stone-800 bg-[#F8F5EE]/60 dark:bg-stone-900/40 text-[11px] font-bold uppercase tracking-wider text-[#5F665F] dark:text-stone-400">
                  <th className="py-3.5 px-5">Problem</th>
                  <th className="py-3.5 px-4">Topic</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Tests Passed</th>
                  <th className="py-3.5 px-4">Runtime</th>
                  <th className="py-3.5 px-4">Memory</th>
                  <th className="py-3.5 px-4">Submitted At</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DED4]/70 dark:divide-stone-800/70 text-xs text-[#17211B] dark:text-stone-300">
                {submissions.map((sub) => {
                  const testsPassedPct =
                    sub.total_tests > 0 ? Math.round((sub.passed_tests / sub.total_tests) * 100) : 0;

                  return (
                    <tr
                      key={sub.id}
                      className="hover:bg-[#F8F5EE]/50 dark:hover:bg-stone-900/30 transition-colors"
                    >
                      {/* Problem Title */}
                      <td className="py-4 px-5">
                        <Link
                          to={`/problems/${sub.problem_id}`}
                          className="font-bold text-[#17211B] dark:text-white hover:text-[#244D38] dark:hover:text-emerald-400 transition-colors"
                        >
                          {sub.problem_title}
                        </Link>
                        <div className="text-[10px] text-[#5F665F] dark:text-stone-400 font-mono mt-0.5">
                          ID: #{sub.id} • Java
                        </div>
                      </td>

                      {/* Topic */}
                      <td className="py-4 px-4 font-medium text-[#5F665F] dark:text-stone-300 whitespace-nowrap">
                        {sub.topic_name || 'Java Topic'}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">{renderStatusBadge(sub.status)}</td>

                      {/* Tests Passed */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex flex-col items-center gap-1">
                          <span className="font-mono font-bold">
                            {sub.passed_tests} / {sub.total_tests}
                          </span>
                          <div className="w-16 h-1.5 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                testsPassedPct === 100
                                  ? 'bg-[#244D38] dark:bg-emerald-400'
                                  : testsPassedPct > 0
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${testsPassedPct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Runtime */}
                      <td className="py-4 px-4 whitespace-nowrap font-mono text-[11px] text-[#5F665F] dark:text-stone-400">
                        {sub.runtime_ms != null ? `${sub.runtime_ms} ms` : '—'}
                      </td>

                      {/* Memory */}
                      <td className="py-4 px-4 whitespace-nowrap font-mono text-[11px] text-[#5F665F] dark:text-stone-400">
                        {sub.memory_kb != null
                          ? `${Math.round(sub.memory_kb / 1024 * 10) / 10} MB`
                          : '—'}
                      </td>

                      {/* Submitted At */}
                      <td className="py-4 px-4 whitespace-nowrap text-[11px] text-[#5F665F] dark:text-stone-400">
                        {formatDate(sub.created_at)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(sub.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F5EE] dark:bg-stone-800 hover:bg-[#E5DED4] dark:hover:bg-stone-700 text-[#17211B] dark:text-stone-200 font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#244D38] dark:text-emerald-400" />
                          <span>View Code</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="py-4 px-6 border-t border-[#E5DED4] dark:border-stone-800 flex items-center justify-between gap-4">
            <div className="text-xs text-[#5F665F] dark:text-stone-400">
              Page <strong className="text-[#17211B] dark:text-white">{page}</strong> of{' '}
              <strong className="text-[#17211B] dark:text-white">{totalPages}</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page <= 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F8F5EE] dark:bg-stone-800 text-xs font-semibold text-[#17211B] dark:text-stone-200 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-[#E5DED4] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <button
                type="button"
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page >= totalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F8F5EE] dark:bg-stone-800 text-xs font-semibold text-[#17211B] dark:text-stone-200 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-[#E5DED4] transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================== */}
      {/* SUBMISSION CODE & TELEMETRY DETAIL MODAL                   */}
      {/* ========================================================== */}
      {selectedSubmissionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#FFFDF9] dark:bg-[#1E1813] border border-[#E5DED4] dark:border-stone-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#E5DED4] dark:border-stone-800 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-[#17211B] dark:text-white">
                    {submissionDetail?.problem_title || 'Submission Details'}
                  </h2>
                  {submissionDetail && renderStatusBadge(submissionDetail.status)}
                </div>
                <p className="text-xs text-[#5F665F] dark:text-stone-400">
                  {submissionDetail?.topic_name} • Submitted on{' '}
                  {submissionDetail?.created_at ? formatDate(submissionDetail.created_at) : '—'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="p-2 rounded-xl text-stone-400 hover:text-[#17211B] dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {detailLoading ? (
                <div className="py-16 text-center space-y-3">
                  <Loader2 className="w-7 h-7 animate-spin text-[#244D38] dark:text-emerald-400 mx-auto" />
                  <p className="text-xs text-[#5F665F] dark:text-stone-400">Loading submission code and telemetry...</p>
                </div>
              ) : submissionDetail ? (
                <>
                  {/* Telemetry Metrics Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-[#F8F5EE] dark:bg-stone-900/70 border border-[#E5DED4] dark:border-stone-800 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F665F] dark:text-stone-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#244D38] dark:text-emerald-400" />
                        Test Cases
                      </span>
                      <p className="text-sm font-mono font-bold text-[#17211B] dark:text-white">
                        {submissionDetail.passed_tests} / {submissionDetail.total_tests} passed
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#F8F5EE] dark:bg-stone-900/70 border border-[#E5DED4] dark:border-stone-800 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F665F] dark:text-stone-400 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-500" />
                        Runtime
                      </span>
                      <p className="text-sm font-mono font-bold text-[#17211B] dark:text-white">
                        {submissionDetail.runtime_ms != null ? `${submissionDetail.runtime_ms} ms` : '—'}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#F8F5EE] dark:bg-stone-900/70 border border-[#E5DED4] dark:border-stone-800 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F665F] dark:text-stone-400 flex items-center gap-1">
                        <HardDrive className="w-3 h-3 text-[#B95F3C]" />
                        Memory
                      </span>
                      <p className="text-sm font-mono font-bold text-[#17211B] dark:text-white">
                        {submissionDetail.memory_kb != null
                          ? `${Math.round(submissionDetail.memory_kb / 1024 * 10) / 10} MB`
                          : '—'}
                      </p>
                    </div>
                  </div>

                  {/* Diagnostic / Error Output if Failed */}
                  {(submissionDetail.compile_output || submissionDetail.error_message) && (
                    <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-300">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Compiler / Execution Output:</span>
                      </div>
                      <pre className="text-xs font-mono text-rose-800 dark:text-rose-200 whitespace-pre-wrap overflow-x-auto">
                        {submissionDetail.compile_output || submissionDetail.error_message}
                      </pre>
                    </div>
                  )}

                  {/* Source Code Container */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#17211B] dark:text-white flex items-center gap-1.5">
                        <Code2 className="w-4 h-4 text-[#244D38] dark:text-emerald-400" />
                        <span>Submitted Java Source Code:</span>
                      </span>

                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-[#F8F5EE] dark:bg-stone-800 text-[#17211B] dark:text-stone-200 hover:bg-[#E5DED4] transition-colors cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#16110D] border border-stone-800 font-mono text-xs text-stone-200 overflow-x-auto max-h-80">
                      <pre className="leading-relaxed">{submissionDetail.source_code}</pre>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center text-xs text-rose-500 font-semibold">
                  Failed to load submission details.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {submissionDetail && (
              <div className="p-4 sm:p-5 border-t border-[#E5DED4] dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 bg-[#F8F5EE]/40 dark:bg-stone-900/20">
                <Link
                  to={`/problems/${submissionDetail.problem_id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F8F5EE] dark:bg-stone-800 hover:bg-[#E5DED4] dark:hover:bg-stone-700 text-[#17211B] dark:text-stone-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#B95F3C]" />
                  <span>Solve Problem Again</span>
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 rounded-xl border border-[#E5DED4] dark:border-stone-800 text-xs font-semibold text-[#5F665F] dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
