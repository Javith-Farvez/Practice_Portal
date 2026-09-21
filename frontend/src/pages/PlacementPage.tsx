import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import {
  GraduationCap,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Pause,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Coffee,
  Binary,
  BrainCircuit,
  Award,
  AlertCircle,
  Loader2,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface TestCase {
  id: number;
  input: string;
  expected_output: string;
  validation_type: string;
}

interface PlacementProblem {
  id: number;
  title: string;
  description: string;
  subject_name: string;
  subject_slug: string;
  topic_name: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  level: string;
  input_format: string | null;
  output_format: string | null;
  constraints: string | null;
  examples: Array<{ input: string; output: string; explanation?: string }>;
  hints: string[];
  supported_languages: string[];
  public_test_cases: TestCase[];
}

export const PlacementPage: React.FC = () => {
  // Session Generation State
  const [loading, setLoading] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [problems, setProblems] = useState<PlacementProblem[]>([]);
  const [counts, setCounts] = useState({ java: 5, dsa: 5, aptitude: 5 });

  // Current problem
  const [currentIndex, setCurrentIndex] = useState(0);

  // Problem solve states: index -> 'NOT_VISITED' | 'ATTEMPTED' | 'SOLVED'
  const [problemStatus, setProblemStatus] = useState<Record<number, 'NOT_VISITED' | 'ATTEMPTED' | 'SOLVED'>>({});

  // Code editor per problem: index -> code
  const [userCodes, setUserCodes] = useState<Record<number, string>>({});
  const [userLanguages, setUserLanguages] = useState<Record<number, 'Java'>>({});

  // Code execution state
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any | null>(null);

  // NO TIMER by default - practice is 100% stress-free and self-paced
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [showTimer, setShowTimer] = useState(false);
  const timerRef = useRef<any>(null);

  // End Session Summary Modal
  const [showSummary, setShowSummary] = useState(false);

  // Timer interval
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const startPlacementSession = async (customCounts = counts) => {
    setLoading(true);
    try {
      const res = await api.get('/placement/generate', {
        params: {
          java_count: customCounts.java,
          dsa_count: customCounts.dsa,
          aptitude_count: customCounts.aptitude,
        },
      });

      if (res.data.success && res.data.data.problems.length > 0) {
        const probs: PlacementProblem[] = res.data.data.problems;
        setProblems(probs);
        setCurrentIndex(0);
        setSessionStarted(true);

        // Initialize status and starter codes
        const initialStatus: Record<number, 'NOT_VISITED' | 'ATTEMPTED' | 'SOLVED'> = {};
        const initialCodes: Record<number, string> = {};
        const initialLangs: Record<number, 'Java'> = {};

        probs.forEach((p, idx) => {
          initialStatus[idx] = idx === 0 ? 'ATTEMPTED' : 'NOT_VISITED';
          initialLangs[idx] = 'Java';
          initialCodes[idx] = `import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your solution here\n    }\n}`;
        });

        setProblemStatus(initialStatus);
        setUserCodes(initialCodes);
        setUserLanguages(initialLangs);
        setTimerSeconds(0);
        setTimerRunning(false);
      }
    } catch (err) {
      console.error('Failed to start placement session:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentProblem = problems[currentIndex];
  const currentLang = 'Java';
  const currentCode = userCodes[currentIndex] || '';

  const handleSelectProblem = (idx: number) => {
    setCurrentIndex(idx);
    setExecutionResult(null);
    if (problemStatus[idx] === 'NOT_VISITED') {
      setProblemStatus((prev) => ({ ...prev, [idx]: 'ATTEMPTED' }));
    }
  };

  const handleRunCode = async (isSubmit: boolean) => {
    if (!currentProblem || executing) return;
    setExecuting(true);
    setExecutionResult(null);

    try {
      const endpoint = isSubmit
        ? `/problems/${currentProblem.id}/submit`
        : `/problems/${currentProblem.id}/run`;

      const res = await api.post(endpoint, {
        language: currentLang,
        source_code: currentCode,
      });

      if (res.data.success) {
        const result = res.data.data;
        setExecutionResult({
          isSubmit,
          ...result,
        });

        if (isSubmit && result.status === 'ACCEPTED') {
          setProblemStatus((prev) => ({ ...prev, [currentIndex]: 'SOLVED' }));
        } else if (problemStatus[currentIndex] !== 'SOLVED') {
          setProblemStatus((prev) => ({ ...prev, [currentIndex]: 'ATTEMPTED' }));
        }
      }
    } catch (err: any) {
      setExecutionResult({
        error: err.response?.data?.message || 'Execution failed.',
      });
    } finally {
      setExecuting(false);
    }
  };

  const getSubjectIcon = (slug: string) => {
    switch (slug) {
      case 'java':
        return <Coffee className="w-3.5 h-3.5 text-amber-500" />;
      case 'dsa':
        return <Binary className="w-3.5 h-3.5 text-indigo-500" />;
      case 'aptitude':
        return <BrainCircuit className="w-3.5 h-3.5 text-purple-500" />;
      default:
        return <GraduationCap className="w-3.5 h-3.5 text-brand-500" />;
    }
  };

  const solvedCount = Object.values(problemStatus).filter((s) => s === 'SOLVED').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* ================= PRE-SESSION SETUP SCREEN ================= */}
      {!sessionStarted ? (
        <div className="space-y-8 animate-in fade-in">
          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 dark:from-black dark:via-[#0b1220] dark:to-black p-8 sm:p-12 rounded-3xl border border-slate-800 text-white shadow-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5 text-brand-400" />
              <span>Full Placement Simulation Mode</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight max-w-2xl">
              Comprehensive Multi-Track Placement Assessment
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
              Test your engineering readiness across Java, Data Structures & Algorithms, and Placement Aptitude.
              Practice in an authentic simulation without any forced timers or stressful auto-submissions.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => startPlacementSession({ java: 5, dsa: 5, aptitude: 5 })}
                disabled={loading}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-sm font-black shadow-xl shadow-brand-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{loading ? 'Assembling Assessment Set...' : 'Start Standard Assessment (15 Problems)'}</span>
              </button>

              <button
                onClick={() => startPlacementSession({ java: 2, dsa: 2, aptitude: 2 })}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700/60 transition-all cursor-pointer"
              >
                <span>Quick Sprint (6 Problems)</span>
              </button>
            </div>
          </div>

          {/* Assessment Specifications Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#0D121F] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Coffee className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">Java Core</h3>
              <p className="text-xs text-slate-500">OOPs, Collections, String Manipulation, and Core logic</p>
            </div>

            <div className="bg-white dark:bg-[#0D121F] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <Binary className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">DSA Core</h3>
              <p className="text-xs text-slate-500">Arrays, Strings, LinkedLists, Stacks, Searching & Sorting</p>
            </div>

            <div className="bg-white dark:bg-[#0D121F] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">Placement Aptitude</h3>
              <p className="text-xs text-slate-500">Quantitative problem-solving, Percentages, Numbers, Logic</p>
            </div>
          </div>
        </div>
      ) : (
        /* ================= ACTIVE ASSESSMENT SCREEN ================= */
        <div className="space-y-4 animate-in fade-in">
          {/* Top Session Control Bar */}
          <div className="bg-white dark:bg-[#0D121F] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-black text-sm">
                Q{currentIndex + 1}
              </div>
              <div>
                <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{currentProblem?.title}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      currentProblem?.difficulty === 'EASY'
                        ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                        : currentProblem?.difficulty === 'MEDIUM'
                        ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                        : 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400'
                    }`}
                  >
                    {currentProblem?.difficulty}
                  </span>
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    {getSubjectIcon(currentProblem?.subject_slug)}
                    {currentProblem?.subject_name}
                  </span>
                  <span>•</span>
                  <span>{currentProblem?.topic_name}</span>
                </div>
              </div>
            </div>

            {/* Stress-Free No Timer Badge & Optional Stopwatch */}
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100/80 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Relaxed Practice • No Timer</span>
              </div>

              {showTimer && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-100/80 dark:bg-stone-900 border border-amber-300/60 dark:border-stone-800 text-xs font-mono font-bold text-stone-700 dark:text-amber-300">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>{formatTime(timerSeconds)}</span>
                  <button
                    onClick={() => setTimerRunning(!timerRunning)}
                    className="p-1 hover:text-amber-600 transition-colors"
                    title={timerRunning ? 'Pause Timer' : 'Start Timer'}
                  >
                    {timerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => setTimerSeconds(0)}
                    className="p-1 hover:text-amber-600 transition-colors"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
              )}

              <button
                onClick={() => setShowTimer(!showTimer)}
                className="p-2 rounded-xl text-stone-500 hover:text-stone-800 dark:hover:text-amber-200 bg-white dark:bg-stone-900 border border-amber-200/60 dark:border-stone-800 text-xs shadow-sm"
                title={showTimer ? 'Hide Optional Stopwatch' : 'Show Optional Stopwatch'}
              >
                {showTimer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setShowSummary(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold shadow-md shadow-amber-600/20 cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Finish & Review ({solvedCount}/{problems.length})</span>
              </button>
            </div>
          </div>

          {/* Problem Navigator Pills */}
          <div className="bg-white dark:bg-[#0D121F] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {problems.map((p, idx) => {
              const status = problemStatus[idx] || 'NOT_VISITED';
              const isCurrent = idx === currentIndex;

              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectProblem(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isCurrent
                      ? 'ring-2 ring-brand-500 bg-brand-500 text-white shadow-md shadow-brand-500/30'
                      : status === 'SOLVED'
                      ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                      : status === 'ATTEMPTED'
                      ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  <span>{idx + 1}</span>
                  {status === 'SOLVED' && <CheckCircle2 className="w-3 h-3" />}
                </button>
              );
            })}
          </div>

          {/* Main Assessment Layout (Problem Details + Code Editor) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            {/* Left: Problem Statement Panel */}
            <div className="bg-white dark:bg-[#0D121F] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-5 max-h-[750px] overflow-y-auto">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Problem Description</h3>
                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {currentProblem?.description}
                </div>
              </div>

              {currentProblem?.input_format && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Input Format</h4>
                  <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl font-mono">
                    {currentProblem.input_format}
                  </div>
                </div>
              )}

              {currentProblem?.output_format && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Output Format</h4>
                  <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl font-mono">
                    {currentProblem.output_format}
                  </div>
                </div>
              )}

              {currentProblem?.constraints && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Constraints</h4>
                  <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl font-mono">
                    {currentProblem.constraints}
                  </div>
                </div>
              )}

              {currentProblem?.examples && currentProblem.examples.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Examples</h4>
                  <div className="space-y-2">
                    {currentProblem.examples.map((ex, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 font-mono text-xs space-y-1">
                        <div>
                          <span className="text-slate-400">Input: </span>
                          <span className="text-slate-900 dark:text-white">{ex.input}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Output: </span>
                          <span className="text-emerald-600 dark:text-emerald-400">{ex.output}</span>
                        </div>
                        {ex.explanation && (
                          <div className="text-[11px] text-slate-500 font-sans pt-1">{ex.explanation}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Code Editor & Execution Panel */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-[#0D121F] rounded-3xl p-4 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#244D38]/10 text-[#244D38] dark:text-emerald-400 border border-[#244D38]/20">
                      <Coffee className="w-3.5 h-3.5 text-amber-500" />
                      <span>Java 8</span>
                    </div>
                  </div>

                  <span className="text-xs text-slate-400 font-mono">Real Online Sandbox</span>
                </div>

                <textarea
                  rows={16}
                  value={currentCode}
                  onChange={(e) =>
                    setUserCodes((prev) => ({ ...prev, [currentIndex]: e.target.value }))
                  }
                  className="w-full font-mono text-xs p-4 rounded-2xl bg-slate-900 text-emerald-400 border border-slate-800 focus:outline-none focus:border-brand-500 leading-relaxed font-semibold"
                  placeholder="Write code here..."
                />

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSelectProblem(Math.max(0, currentIndex - 1))}
                      disabled={currentIndex === 0}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 disabled:opacity-40"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleSelectProblem(Math.min(problems.length - 1, currentIndex + 1))}
                      disabled={currentIndex === problems.length - 1}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 disabled:opacity-40"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleRunCode(false)}
                      disabled={executing}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {executing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                      <span>Run Public Tests</span>
                    </button>

                    <button
                      onClick={() => handleRunCode(true)}
                      disabled={executing}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-brand-500/20 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {executing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>Submit Solution</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Execution Results Drawer */}
              {executionResult && (
                <div
                  className={`p-4 rounded-3xl text-xs space-y-3 ${
                    executionResult.status === 'ACCEPTED'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                      : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>Verdict: {executionResult.status || 'ERROR'}</span>
                    <span>
                      Passed: {executionResult.passedCount ?? 0} / {executionResult.totalCount ?? 0} (
                      {executionResult.runtimeMs || 0}ms)
                    </span>
                  </div>

                  {executionResult.publicResults && executionResult.publicResults.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {executionResult.publicResults.map((r: any, idx: number) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-white/80 dark:bg-black/40 font-mono text-[11px] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold">Public Test #{idx + 1}</span>
                            <span className={r.passed ? 'text-emerald-600' : 'text-rose-600 font-bold'}>
                              {r.passed ? 'PASSED ✓' : 'FAILED ✗'}
                            </span>
                          </div>
                          <div>Input: {r.input}</div>
                          <div>Expected: {r.expected_output}</div>
                          <div>Actual: {r.actual_output}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: SESSION SUMMARY ================= */}
      {showSummary && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0D121F] rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Assessment Complete</h3>
              <p className="text-xs text-slate-400">
                Great effort! Here is your performance overview across the placement practice session.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[11px] font-semibold uppercase text-slate-400">Problems Solved</span>
                <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                  {solvedCount} / {problems.length}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[11px] font-semibold uppercase text-slate-400">Elapsed Time</span>
                <p className="text-3xl font-black text-slate-900 dark:text-white mt-1 font-mono">
                  {formatTime(timerSeconds)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setShowSummary(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Continue Reviewing
              </button>
              <Link
                to="/dashboard"
                className="flex-1 text-center py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/20"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
