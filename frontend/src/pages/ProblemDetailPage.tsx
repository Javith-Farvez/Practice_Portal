import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { ProblemCodeEditor } from '../components/ProblemCodeEditor';
import {
  TestResultsPanel,
  RunData,
  SubmitData,
  SubmissionHistoryItem,
} from '../components/TestResultsPanel';
import { DEFAULT_TEMPLATES } from '../data/codeTemplates';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  FileText,
  Clock,
  Code2,
  Loader2,
  AlertCircle,
  Sparkles,
  Terminal,
  Copy,
  Check,
} from 'lucide-react';

interface ProblemDetail {
  id: number;
  title: string;
  description: string;
  subject_id: number;
  topic_id: number;
  subtopic_id?: number;
  subject_name: string;
  subject_slug: string;
  topic_name: string;
  subtopic_name?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  level: string;
  input_format?: string;
  output_format?: string;
  constraints?: string;
  sample_input?: string;
  sample_output?: string;
  explanation?: string;
  hints: string[];
  supported_languages: string[];
  status: 'SOLVED' | 'UNSOLVED' | 'ATTEMPTED' | 'PUBLISHED';
  user_status?: 'SOLVED' | 'UNSOLVED' | 'ATTEMPTED';
  starter_code?: string;
  is_bookmarked: boolean;
  solved_at?: string;
}

export const ProblemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [openHintIndex, setOpenHintIndex] = useState<number | null>(null);

  // Copy state for Sample Input and Output
  const [copiedInput, setCopiedInput] = useState<boolean>(false);
  const [copiedOutput, setCopiedOutput] = useState<boolean>(false);

  // Editor State
  const [language, setLanguage] = useState<'JAVA'>('JAVA');
  const [code, setCode] = useState<string>(DEFAULT_TEMPLATES.JAVA);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Results State
  const [runData, setRunData] = useState<RunData | null>(null);
  const [submitData, setSubmitData] = useState<SubmitData | null>(null);
  const [resultsTab, setResultsTab] = useState<'RUN' | 'SUBMIT' | 'HISTORY'>('RUN');
  const [submissions, setSubmissions] = useState<SubmissionHistoryItem[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState<boolean>(false);

  // Mobile Tabs
  const [mobileTab, setMobileTab] = useState<'PROBLEM' | 'EDITOR' | 'RESULTS'>('PROBLEM');

  // Load code from LocalStorage or template
  const getDraftKey = (probId: number, lang: string) => `placement_code_${probId}_${lang}`;

  const loadCodeForLanguage = (targetLang: 'JAVA' = 'JAVA', starterCode?: string) => {
    if (!id) return;
    const key = getDraftKey(Number(id), targetLang);
    const saved = localStorage.getItem(key);
    if (saved && saved.trim() !== '') {
      setCode(saved);
    } else if (starterCode && starterCode.trim() !== '') {
      setCode(starterCode);
    } else {
      setCode(DEFAULT_TEMPLATES[targetLang]);
    }
  };

  const handleLanguageChange = (newLang: 'JAVA') => {
    setLanguage(newLang);
    loadCodeForLanguage(newLang, problem?.starter_code);
  };

  const handleCodeChange = (newVal: string | undefined) => {
    const val = newVal || '';
    setCode(val);
    if (id) {
      localStorage.setItem(getDraftKey(Number(id), language), val);
    }
  };

  const handleResetCode = () => {
    if (window.confirm(`Reset Java editor back to default starter code?`)) {
      const template = problem?.starter_code || DEFAULT_TEMPLATES[language];
      setCode(template);
      if (id) {
        localStorage.removeItem(getDraftKey(Number(id), language));
      }
    }
  };

  const fetchProblem = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/problems/${id}`);
      if (res.data.success && res.data.data?.problem) {
        const prob = res.data.data.problem;
        setProblem(prob);
        setLanguage('JAVA');
        loadCodeForLanguage('JAVA', prob.starter_code);
      } else {
        setError(res.data.message || 'Problem not found.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error loading problem.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    if (!id) return;
    setLoadingSubmissions(true);
    try {
      const res = await api.get('/submissions', {
        params: { problem_id: id },
      });
      if (res.data.success) {
        setSubmissions(res.data.data.submissions);
      }
    } catch (err) {
      console.error('Failed to load past submissions', err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProblem();
      if (user) {
        fetchSubmissions();
      }
    }
  }, [id, user]);

  // Execute Public Tests
  const handleRun = async () => {
    if (isRunning || isSubmitting || !problem) return;
    setIsRunning(true);
    setResultsTab('RUN');
    setMobileTab('RESULTS');

    try {
      const res = await api.post(`/problems/${problem.id}/run`, {
        language,
        source_code: code,
      });

      if (res.data.success) {
        setRunData(res.data.data);
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Execution failed';
      setRunData({
        status: 'ERROR',
        totalPublicTests: 0,
        passedPublicTests: 0,
        compilationError: errMsg,
        results: [],
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Submit Solution (Runs Public + Hidden Tests)
  const handleSubmit = async () => {
    if (isRunning || isSubmitting || !problem) return;

    if (!user) {
      alert('Please log in or register to submit code solutions and track progress.');
      return;
    }

    setIsSubmitting(true);
    setResultsTab('SUBMIT');
    setMobileTab('RESULTS');

    try {
      const res = await api.post(`/problems/${problem.id}/submit`, {
        language,
        source_code: code,
      });

      if (res.data.success) {
        setSubmitData(res.data.data);
        if (res.data.data.status === 'ACCEPTED') {
          setProblem((prev) => (prev ? { ...prev, status: 'SOLVED' } : null));
        } else {
          setProblem((prev) => (prev && prev.status !== 'SOLVED' ? { ...prev, status: 'ATTEMPTED' } : prev));
        }
        fetchSubmissions();
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Submission failed';
      setSubmitData({
        status: 'RUNTIME_ERROR',
        passedCount: 0,
        totalCount: 0,
        runtimeMs: 0,
        memoryKb: 0,
        compilationError: errMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleBookmark = async () => {
    if (!problem || actionLoading) return;
    if (!user) {
      alert('Please log in to bookmark problems.');
      return;
    }
    setActionLoading(true);
    try {
      const res = await api.post(`/problems/${problem.id}/toggle-bookmark`);
      if (res.data.success) {
        setProblem({
          ...problem,
          is_bookmarked: res.data.data.is_bookmarked,
        });
      }
    } catch (err) {
      console.error('Failed to update bookmark status', err);
    } finally {
      setActionLoading(false);
    }
  };

  const toggleHint = (idx: number) => {
    setOpenHintIndex(openHintIndex === idx ? null : idx);
  };

  const handleCopyText = (text: string, type: 'input' | 'output') => {
    navigator.clipboard.writeText(text);
    if (type === 'input') {
      setCopiedInput(true);
      setTimeout(() => setCopiedInput(false), 2000);
    } else {
      setCopiedOutput(true);
      setTimeout(() => setCopiedOutput(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#244D38] dark:text-emerald-400" />
        <p className="text-sm font-medium text-[#5F665F] dark:text-stone-400">Loading problem workspace...</p>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[#17211B] dark:text-white">Unable to Load Problem</h2>
        <p className="text-sm text-[#5F665F] dark:text-stone-400">{error || 'Could not load problem workspace.'}</p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={fetchProblem}
            className="inline-flex px-5 py-2.5 text-xs font-bold text-white bg-[#244D38] hover:bg-[#1B3B2B] rounded-xl shadow-sm cursor-pointer"
          >
            Retry Loading
          </button>
          <Link
            to="/problems"
            className="inline-flex px-5 py-2.5 text-xs font-bold text-[#244D38] dark:text-emerald-400 bg-[#244D38]/10 hover:bg-[#244D38]/20 rounded-xl"
          >
            All Problems
          </Link>
        </div>
      </div>
    );
  }

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'EASY':
        return 'bg-[#4E8A61]/15 text-[#244D38] dark:text-emerald-400 border-[#4E8A61]/30';
      case 'MEDIUM':
        return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30';
      case 'HARD':
        return 'bg-[#B95F3C]/15 text-[#B95F3C] dark:text-rose-400 border-[#B95F3C]/30';
      default:
        return 'bg-[#244D38]/10 text-[#244D38] dark:text-stone-300 border-[#244D38]/20';
    }
  };

  const currentSolvedStatus = problem.user_status || problem.status;

  return (
    <div className="w-full h-full flex flex-col space-y-3 pb-6">
      {/* Top Header Bar & Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2 text-xs font-medium text-[#5F665F] dark:text-stone-400">
          <Link
            to={`/${problem.subject_slug}`}
            className="hover:text-[#244D38] dark:hover:text-emerald-400 flex items-center gap-1 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{problem.subject_name}</span>
          </Link>
          <span>/</span>
          <Link
            to={`/topics/${problem.topic_id}`}
            className="hover:text-[#244D38] dark:hover:text-emerald-400 font-semibold"
          >
            {problem.topic_name}
          </Link>
          <span>/</span>
          <span className="text-[#17211B] dark:text-white font-bold truncate">
            #{problem.id} {problem.title}
          </span>
        </div>

        {/* Solved Status & Bookmark Toggle */}
        <div className="flex items-center gap-2">
          {currentSolvedStatus === 'SOLVED' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#4E8A61]/15 text-[#244D38] dark:text-emerald-400 border border-[#4E8A61]/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Solved</span>
            </span>
          ) : currentSolvedStatus === 'ATTEMPTED' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
              <Clock className="w-3.5 h-3.5" />
              <span>Attempted</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#F0EBE2] dark:bg-stone-800 text-[#5F665F] dark:text-stone-400 border border-[#E5DED4] dark:border-stone-700">
              <Circle className="w-3.5 h-3.5" />
              <span>Not Started</span>
            </span>
          )}


          <button
            type="button"
            onClick={handleToggleBookmark}
            disabled={actionLoading}
            title={problem.is_bookmarked ? 'Remove Bookmark' : 'Bookmark Problem'}
            className={`p-1.5 rounded-xl border text-xs transition-colors cursor-pointer ${
              problem.is_bookmarked
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400'
                : 'bg-[#FFFDF9] dark:bg-stone-800 border-[#E5DED4] dark:border-stone-700 text-[#5F665F] hover:text-[#17211B] hover:bg-[#F0EBE2]'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${problem.is_bookmarked ? 'fill-amber-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Tab Selector (Visible only below lg) */}
      <div className="lg:hidden flex rounded-2xl bg-[#F8F5EE] dark:bg-stone-900 border border-[#E5DED4] dark:border-stone-800 p-1">
        <button
          type="button"
          onClick={() => setMobileTab('PROBLEM')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
            mobileTab === 'PROBLEM'
              ? 'bg-[#FFFDF9] dark:bg-stone-800 text-[#244D38] dark:text-emerald-400 shadow-xs'
              : 'text-[#5F665F] dark:text-stone-400'
          }`}
        >
          Statement
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('EDITOR')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
            mobileTab === 'EDITOR'
              ? 'bg-[#FFFDF9] dark:bg-stone-800 text-[#244D38] dark:text-emerald-400 shadow-xs'
              : 'text-[#5F665F] dark:text-stone-400'
          }`}
        >
          Editor
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('RESULTS')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
            mobileTab === 'RESULTS'
              ? 'bg-[#FFFDF9] dark:bg-stone-800 text-[#244D38] dark:text-emerald-400 shadow-xs'
              : 'text-[#5F665F] dark:text-stone-400'
          }`}
        >
          Results {runData && `(${runData.passedPublicTests}/${runData.totalPublicTests})`}
        </button>
      </div>

      {/* Problem Workspace: 3-Pane Layout (Desktop) / Tabbed (Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:h-[calc(100vh-130px)] min-h-[620px]">
        {/* ==================================================== */}
        {/* LEFT PANE: PROBLEM STATEMENT (col-span-4 on desktop) */}
        {/* ==================================================== */}
        <div
          className={`lg:col-span-4 h-full bg-[#FFFDF9] dark:bg-[#1E1813] border border-[#E5DED4] dark:border-stone-800 rounded-3xl p-5 sm:p-6 overflow-y-auto space-y-5 shadow-xs ${
            mobileTab === 'PROBLEM' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Title & Metadata */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold text-[#244D38] dark:text-emerald-400">
                #{problem.id}
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getDifficultyBadge(
                  problem.difficulty
                )}`}
              >
                {problem.difficulty}
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#F0EBE2] dark:bg-stone-800 text-[#5F665F] dark:text-stone-300">
                {problem.level}
              </span>
            </div>
            <h1 className="text-xl font-black text-[#17211B] dark:text-white tracking-tight leading-snug">
              {problem.title}
            </h1>
          </div>

          {/* 1. DESCRIPTION */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#244D38] dark:text-emerald-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Description</span>
            </h2>
            <div className="text-[#26352D] dark:text-stone-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
              {problem.description}
            </div>
          </div>

          {/* 2. INPUT FORMAT */}
          {problem.input_format && (
            <div className="p-4 rounded-2xl bg-[#F8F5EE] dark:bg-stone-900/60 border border-[#E5DED4] dark:border-stone-800 space-y-1.5">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#5F665F] dark:text-stone-400">
                Input Format
              </h3>
              <p className="text-xs font-mono text-[#17211B] dark:text-stone-200 whitespace-pre-line leading-relaxed">
                {problem.input_format}
              </p>
            </div>
          )}

          {/* 3. OUTPUT FORMAT */}
          {problem.output_format && (
            <div className="p-4 rounded-2xl bg-[#F8F5EE] dark:bg-stone-900/60 border border-[#E5DED4] dark:border-stone-800 space-y-1.5">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#5F665F] dark:text-stone-400">
                Output Format
              </h3>
              <p className="text-xs font-mono text-[#17211B] dark:text-stone-200 whitespace-pre-line leading-relaxed">
                {problem.output_format}
              </p>
            </div>
          )}

          {/* 4. CONSTRAINTS */}
          {problem.constraints && (
            <div className="p-4 rounded-2xl bg-[#F8F5EE] dark:bg-stone-900/60 border border-[#E5DED4] dark:border-stone-800 space-y-1.5">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#5F665F] dark:text-stone-400">
                Constraints
              </h3>
              <pre className="text-xs font-mono text-[#17211B] dark:text-stone-200 whitespace-pre-line leading-relaxed">
                {problem.constraints}
              </pre>
            </div>
          )}

          {/* 5. SAMPLE INPUT (Directly below Constraints) */}
          <div className="p-4 rounded-2xl bg-[#F8F5EE] dark:bg-stone-900/60 border border-[#E5DED4] dark:border-stone-800 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#244D38] dark:text-emerald-400 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                <span>Sample Input</span>
              </h3>
              {problem.sample_input && problem.sample_input !== 'No input' && (
                <button
                  type="button"
                  onClick={() => handleCopyText(problem.sample_input || '', 'input')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#FFFDF9] dark:bg-stone-800 border border-[#E5DED4] dark:border-stone-700 text-[#17211B] dark:text-stone-200 hover:bg-[#E5DED4] transition-colors cursor-pointer"
                >
                  {copiedInput ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-stone-400" />}
                  <span>{copiedInput ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
            <pre className="p-3 rounded-xl bg-[#FFFDF9] border border-[#E5DED4] text-xs font-mono text-[#17211B] overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {problem.sample_input || 'No input required'}
            </pre>
          </div>

          {/* 6. SAMPLE OUTPUT (Directly below Sample Input) */}
          <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#E5DED4] space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#A8752D] flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>Sample Output</span>
              </h3>
              {problem.sample_output && (
                <button
                  type="button"
                  onClick={() => handleCopyText(problem.sample_output || '', 'output')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#FFFDF9] border border-[#E5DED4] text-[#17211B] hover:bg-[#E5DED4] transition-colors cursor-pointer"
                >
                  {copiedOutput ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-stone-400" />}
                  <span>{copiedOutput ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
            <pre className="p-3 rounded-xl bg-[#FFFDF9] border border-[#E5DED4] text-xs font-mono text-[#244D38] font-semibold overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {problem.sample_output || ''}
            </pre>
          </div>

          {/* 7. EXPLANATION (Directly below Sample Output) */}
          {problem.explanation && (
            <div className="p-4 rounded-2xl bg-[#FFFDF9] dark:bg-stone-900/60 border border-[#E5DED4] dark:border-stone-800 space-y-1.5">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#B95F3C] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explanation</span>
              </h3>
              <p className="text-xs text-[#5F665F] dark:text-stone-300 whitespace-pre-line leading-relaxed">
                {problem.explanation}
              </p>
            </div>
          )}

          {/* Hints Accordion */}
          {problem.hints && problem.hints.length > 0 && (
            <div className="pt-3 border-t border-[#E5DED4] dark:border-stone-800 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5F665F] dark:text-stone-400 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Hints ({problem.hints.length})</span>
              </h3>

              <div className="space-y-1.5">
                {problem.hints.map((hint, idx) => {
                  const isOpen = openHintIndex === idx;
                  return (
                    <div key={idx} className="border border-[#E5DED4] dark:border-stone-800 rounded-2xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleHint(idx)}
                        className="w-full px-3.5 py-2.5 bg-[#F8F5EE] dark:bg-stone-900/80 flex items-center justify-between text-xs font-bold text-[#17211B] dark:text-stone-200 hover:bg-[#E5DED4] transition-colors cursor-pointer"
                      >
                        <span className="text-amber-600 dark:text-amber-400 font-mono">Hint {idx + 1}</span>
                        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                      {isOpen && (
                        <div className="p-3.5 text-xs text-[#5F665F] dark:text-stone-300 bg-[#FFFDF9] dark:bg-[#1E1813] border-t border-[#E5DED4] dark:border-stone-800 leading-relaxed">
                          {hint}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ==================================================== */}
        {/* CENTER PANE: CODE EDITOR (col-span-5 on desktop)     */}
        {/* ==================================================== */}
        <div
          className={`lg:col-span-5 h-[520px] lg:h-full ${
            mobileTab === 'EDITOR' ? 'block' : 'hidden lg:block'
          }`}
        >
          <ProblemCodeEditor
            language={language}
            onLanguageChange={handleLanguageChange}
            code={code}
            onCodeChange={handleCodeChange}
            onResetCode={handleResetCode}
            onRun={handleRun}
            onSubmit={handleSubmit}
            isRunning={isRunning}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* ==================================================== */}
        {/* RIGHT PANE: TEST RESULTS (col-span-3 on desktop)     */}
        {/* ==================================================== */}
        <div
          className={`lg:col-span-3 h-[480px] lg:h-full ${
            mobileTab === 'RESULTS' ? 'block' : 'hidden lg:block'
          }`}
        >
          <TestResultsPanel
            runData={runData}
            submitData={submitData}
            activeView={resultsTab}
            onViewChange={setResultsTab}
            submissions={submissions}
            isLoadingSubmissions={loadingSubmissions}
            onRefreshSubmissions={fetchSubmissions}
            topicName={problem?.topic_name}
            problemSlug={problem?.slug}
            problemId={problem?.id}
            code={code}
            language={language}
          />
        </div>
      </div>
    </div>
  );
};
