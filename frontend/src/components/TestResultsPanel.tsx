import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  AlertTriangle,
  History,
  Check,
  X,
  Loader2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import api from '../api/axios';

export interface PublicTestItem {
  testCaseNumber: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  runtimeMs: number;
  passed: boolean;
  error?: string;
}

export interface CustomTestResult {
  input: string;
  actualOutput: string;
  runtimeMs: number;
  error?: string;
}

export interface RunData {
  status: 'SUCCESS' | 'ERROR';
  totalPublicTests: number;
  passedPublicTests: number;
  compilationError?: string;
  customResult?: CustomTestResult;
  results: PublicTestItem[];
}

export interface SubmitData {
  status:
    | 'ACCEPTED'
    | 'WRONG_ANSWER'
    | 'COMPILATION_ERROR'
    | 'RUNTIME_ERROR'
    | 'TIME_LIMIT_EXCEEDED'
    | 'MEMORY_LIMIT_EXCEEDED';
  passedCount: number;
  totalCount: number;
  submissionId?: number;
  runtimeMs?: number;
  memoryKb?: number;
  compilationError?: string;
  failedTestCase?: {
    testCaseNumber: number;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    isSecret: boolean;
    error?: string;
  };
  details?: {
    testCaseNumber: number;
    input?: string;
    expectedOutput?: string;
    actualOutput?: string;
    isSecret: boolean;
    passed: boolean;
    runtimeMs: number;
    error?: string;
  }[];
}

export interface SubmissionHistoryItem {
  id: number;
  problem_id: number;
  user_id: number;
  language: string;
  status: string;
  passed_tests: number;
  total_tests: number;
  runtime_ms: number;
  memory_kb?: number;
  created_at: string;
}

export interface TestResultsPanelProps {
  runData: RunData | null;
  submitData: SubmitData | null;
  activeView?: 'RUN' | 'SUBMIT' | 'HISTORY';
  onViewChange: (view: 'RUN' | 'SUBMIT' | 'HISTORY') => void;
  submissions?: SubmissionHistoryItem[];
  isLoadingSubmissions?: boolean;
  onRefreshSubmissions?: () => void;
  topicName?: string;
  problemSlug?: string;
  problemId?: number;
  code?: string;
  language?: string;
  isRunning?: boolean;
  isSubmitting?: boolean;
  activeTab?: 'testcase' | 'result';
  onSelectTab?: (tab: 'testcase' | 'result') => void;
}

export const TestResultsPanel: React.FC<TestResultsPanelProps> = ({
  runData,
  submitData,
  activeView = 'RUN',
  onViewChange,
  submissions = [],
  isLoadingSubmissions = false,
  onRefreshSubmissions = () => {},
}) => {
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState<number>(0);

  // Status colors & labels for submission verdicts
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return {
          bg: 'bg-[#E8F3EB] border border-[#BEDAC6] text-[#24543F]',
          icon: <CheckCircle2 className="w-5 h-5 text-[#24543F]" />,
          title: 'Accepted ✓',
        };
      case 'WRONG_ANSWER':
        return {
          bg: 'bg-[#FDF2ED] border border-[#F5C7B5] text-[#B95F3C]',
          icon: <XCircle className="w-5 h-5 text-[#B95F3C]" />,
          title: 'Wrong Answer',
        };
      case 'COMPILATION_ERROR':
        return {
          bg: 'bg-[#FEF9EE] border border-[#F2DEB0] text-[#A8752D]',
          icon: <AlertTriangle className="w-5 h-5 text-[#A8752D]" />,
          title: 'Compilation Error',
        };
      case 'TIME_LIMIT_EXCEEDED':
        return {
          bg: 'bg-[#FFF6ED] border border-[#FBD6B5] text-[#D97706]',
          icon: <Clock className="w-5 h-5 text-[#D97706]" />,
          title: 'Time Limit Exceeded',
        };
      case 'RUNTIME_ERROR':
        return {
          bg: 'bg-[#FDF0ED] border border-[#F6C3B7] text-[#C53030]',
          icon: <Terminal className="w-5 h-5 text-[#C53030]" />,
          title: 'Runtime Error',
        };
      case 'MEMORY_LIMIT_EXCEEDED':
        return {
          bg: 'bg-[#F7F2FA] border border-[#DCCBE6] text-[#8D789E]',
          icon: <AlertTriangle className="w-5 h-5 text-[#8D789E]" />,
          title: 'Memory Limit Exceeded',
        };
      default:
        return {
          bg: 'bg-[#FAF8F2] border border-[#DDD4C6] text-[#26352D]',
          icon: <Terminal className="w-5 h-5 text-[#6E756D]" />,
          title: status,
        };
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FFFDF9] border border-[#E5DDD0] rounded-3xl overflow-hidden shadow-xs">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#F3EEE5] border-b border-[#DDD4C6] shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onViewChange('RUN')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === 'RUN'
                ? 'bg-[#FFFDF9] text-[#18251F] border border-[#DDD4C6] shadow-xs'
                : 'text-[#6E756D] hover:text-[#18251F] hover:bg-[#EAE3D6]/70'
            }`}
          >
            Public Tests {runData && `(${runData.passedPublicTests}/${runData.totalPublicTests})`}
          </button>

          <button
            type="button"
            onClick={() => onViewChange('SUBMIT')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === 'SUBMIT'
                ? 'bg-[#FFFDF9] text-[#18251F] border border-[#DDD4C6] shadow-xs'
                : 'text-[#6E756D] hover:text-[#18251F] hover:bg-[#EAE3D6]/70'
            }`}
          >
            Submit Verdict
          </button>

          <button
            type="button"
            onClick={() => {
              onViewChange('HISTORY');
              onRefreshSubmissions();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeView === 'HISTORY'
                ? 'bg-[#FFFDF9] text-[#18251F] border border-[#DDD4C6] shadow-xs'
                : 'text-[#6E756D] hover:text-[#18251F] hover:bg-[#EAE3D6]/70'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Submissions</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ==================================================== */}
        {/* VIEW 1: RUN (PUBLIC TESTS) */}
        {/* ==================================================== */}
        {activeView === 'RUN' && (
          <div>
            {!runData ? (
              <div className="h-full min-h-[240px] flex flex-col items-center justify-center text-center p-6 text-[#6E756D]">
                <Terminal className="w-8 h-8 text-[#A39A8C] mb-2" />
                <p className="text-xs font-bold text-[#18251F]">No test results yet</p>
                <p className="text-[11px] text-[#6E756D] mt-1 max-w-xs">
                  Click &ldquo;Run&rdquo; to execute your solution against public test cases.
                </p>
              </div>
            ) : runData.compilationError ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#A8752D] text-xs font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Compilation Error</span>
                </div>
                <pre className="p-4 rounded-2xl bg-[#FEF9EE] border border-[#F2DEB0] text-xs font-mono text-[#825418] overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {runData.compilationError}
                </pre>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Test Cases Pill Switcher */}
                <div className="flex flex-wrap gap-2 pb-3 border-b border-[#E5DDD0]">
                  {runData.customResult && (
                    <button
                      type="button"
                      onClick={() => setSelectedTestCaseIndex(-1)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                        selectedTestCaseIndex === -1
                          ? 'bg-[#24543F] text-white shadow-xs'
                          : 'bg-[#F8F5EE] border border-[#E5DDD0] text-[#6E756D] hover:bg-[#EDE8DE] hover:text-[#18251F]'
                      }`}
                    >
                      <span>Custom Input</span>
                      {runData.customResult.error ? (
                        <X className={`w-3.5 h-3.5 stroke-[3] ${selectedTestCaseIndex === -1 ? 'text-red-300' : 'text-[#B95F3C]'}`} />
                      ) : (
                        <Check className={`w-3.5 h-3.5 stroke-[3] ${selectedTestCaseIndex === -1 ? 'text-emerald-300' : 'text-[#24543F]'}`} />
                      )}
                    </button>
                  )}

                  {runData.results.map((tc, idx) => {
                    const isSelected = selectedTestCaseIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedTestCaseIndex(idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#24543F] text-white shadow-xs'
                            : 'bg-[#F8F5EE] border border-[#E5DDD0] text-[#6E756D] hover:bg-[#EDE8DE] hover:text-[#18251F]'
                        }`}
                      >
                        <span>Case {tc.testCaseNumber}</span>
                        {tc.passed ? (
                          <Check className={`w-3.5 h-3.5 stroke-[3] ${isSelected ? 'text-emerald-300' : 'text-[#24543F]'}`} />
                        ) : (
                          <X className={`w-3.5 h-3.5 stroke-[3] ${isSelected ? 'text-red-300' : 'text-[#B95F3C]'}`} />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Test Case Inspection */}
                {selectedTestCaseIndex === -1 && runData.customResult && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#18251F]">Custom Input Execution:</span>
                      <div className="flex items-center gap-1 text-[11px] text-[#6E756D] font-mono">
                        <Clock className="w-3 h-3 text-[#A39A8C]" />
                        <span>{runData.customResult.runtimeMs} ms</span>
                      </div>
                    </div>

                    {runData.customResult.error && (
                      <div className="p-3 rounded-2xl bg-[#FDF0ED] border border-[#F6C3B7] text-xs font-mono text-[#C53030]">
                        {runData.customResult.error}
                      </div>
                    )}

                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E756D] block mb-1">
                        Input (stdin)
                      </span>
                      <pre className="p-3 rounded-xl bg-[#FAF8F2] border border-[#DDD4C6] text-xs font-mono text-[#18251F] overflow-x-auto whitespace-pre-wrap">
                        {runData.customResult.input || '(Empty)'}
                      </pre>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#24543F] block mb-1">
                        Your Program Output
                      </span>
                      <pre className="p-3 rounded-xl bg-[#E8F3EB] border border-[#BEDAC6] text-xs font-mono text-[#24543F] font-semibold overflow-x-auto whitespace-pre-wrap">
                        {runData.customResult.actualOutput || '(No output)'}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Selected Test Case Inspection */}
                {selectedTestCaseIndex >= 0 && runData.results[selectedTestCaseIndex] && (
                  <div className="space-y-3">
                    {/* Status & Runtime info */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#18251F]">
                          Test Case #{runData.results[selectedTestCaseIndex].testCaseNumber}:
                        </span>
                        {runData.results[selectedTestCaseIndex].passed ? (
                          <span className="text-[#24543F] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                          </span>
                        ) : (
                          <span className="text-[#B95F3C] font-bold flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Failed
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-[#6E756D] font-mono">
                        <Clock className="w-3 h-3 text-[#A39A8C]" />
                        <span>{runData.results[selectedTestCaseIndex].runtimeMs} ms</span>
                      </div>
                    </div>

                    {/* Error info if any */}
                    {runData.results[selectedTestCaseIndex].error && (
                      <div className="p-3 rounded-2xl bg-[#FDF0ED] border border-[#F6C3B7] text-xs font-mono text-[#C53030]">
                        {runData.results[selectedTestCaseIndex].error}
                      </div>
                    )}

                    {/* Input */}
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E756D] block mb-1">
                        Input
                      </span>
                      <pre className="p-3 rounded-xl bg-[#FAF8F2] border border-[#DDD4C6] text-xs font-mono text-[#18251F] overflow-x-auto whitespace-pre-wrap">
                        {runData.results[selectedTestCaseIndex].input || '(No input)'}
                      </pre>
                    </div>

                    {/* Expected Output */}
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#24543F] block mb-1">
                        Expected Output
                      </span>
                      <pre className="p-3 rounded-xl bg-[#E8F3EB] border border-[#BEDAC6] text-xs font-mono text-[#24543F] font-semibold overflow-x-auto whitespace-pre-wrap">
                        {runData.results[selectedTestCaseIndex].expectedOutput}
                      </pre>
                    </div>

                    {/* Actual Output */}
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E756D] block mb-1">
                        Actual Output
                      </span>
                      <pre
                        className={`p-3 rounded-xl border text-xs font-mono overflow-x-auto whitespace-pre-wrap font-semibold ${
                          runData.results[selectedTestCaseIndex].passed
                            ? 'bg-[#E8F3EB] border-[#BEDAC6] text-[#24543F]'
                            : 'bg-[#FDF2ED] border-[#F5C7B5] text-[#B95F3C]'
                        }`}
                      >
                        {runData.results[selectedTestCaseIndex].actualOutput || '(Empty output)'}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* VIEW 2: SUBMIT VERDICT */}
        {/* ==================================================== */}
        {activeView === 'SUBMIT' && (
          <div>
            {!submitData ? (
              <div className="h-full min-h-[240px] flex flex-col items-center justify-center text-center p-6 text-[#6E756D]">
                <ShieldCheck className="w-8 h-8 text-[#A39A8C] mb-2" />
                <p className="text-xs font-bold text-[#18251F]">Ready for evaluation</p>
                <p className="text-[11px] text-[#6E756D] mt-1 max-w-xs">
                  Click &ldquo;Submit&rdquo; to run your solution against both public and hidden test cases.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Result Hero Banner */}
                {(() => {
                  const badge = getStatusBadge(submitData.status);
                  return (
                    <div className={`p-4 sm:p-5 rounded-2xl ${badge.bg}`}>
                      <div className="flex items-center gap-3 mb-2">
                        {badge.icon}
                        <h3 className="text-base sm:text-lg font-extrabold tracking-tight">
                          {badge.title}
                        </h3>
                      </div>

                      <div className="text-xs font-medium space-y-1">
                        <p className="text-[#18251F]">
                          <span className="font-bold text-[#18251F] text-sm">
                            {submitData.passedCount} / {submitData.totalCount}
                          </span>{' '}
                          test cases passed
                        </p>

                        {submitData.status !== 'COMPILATION_ERROR' && (
                          <div className="flex items-center gap-4 text-[11px] text-[#6E756D] font-mono pt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#A39A8C]" />
                              Runtime: {submitData.runtimeMs} ms
                            </span>
                            <span>Memory: {submitData.memoryKb} KB</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Compilation Error Message if applicable */}
                {submitData.compilationError && (
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#A8752D] block mb-1.5">
                      Compiler Output
                    </span>
                    <pre className="p-3.5 rounded-2xl bg-[#FEF9EE] border border-[#F2DEB0] text-xs font-mono text-[#825418] whitespace-pre-wrap overflow-x-auto">
                      {submitData.compilationError}
                    </pre>
                  </div>
                )}

                {/* Notice: Hidden test cases confidentiality */}
                <div className="p-3 rounded-2xl bg-[#FAF8F2] border border-[#DDD4C6] text-[11px] text-[#6E756D] leading-relaxed">
                  <span className="font-semibold text-[#18251F]">Security Guarantee: </span>
                  Hidden test case inputs and expected outputs are strictly protected to uphold assessment integrity.
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* VIEW 3: SUBMISSIONS HISTORY */}
        {/* ==================================================== */}
        {activeView === 'HISTORY' && (
          <div>
            {isLoadingSubmissions ? (
              <div className="h-40 flex items-center justify-center gap-2 text-xs text-[#6E756D]">
                <Loader2 className="w-4 h-4 animate-spin text-[#24543F]" />
                <span>Loading past submissions...</span>
              </div>
            ) : submissions.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-center p-6 text-[#6E756D]">
                <History className="w-7 h-7 text-[#A39A8C] mb-2" />
                <p className="text-xs font-medium text-[#18251F]">No submissions recorded yet for this problem.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {submissions.map((sub) => {
                  const badge = getStatusBadge(sub.status);
                  return (
                    <div
                      key={sub.id}
                      className="p-3 rounded-2xl bg-[#FAF8F2] border border-[#DDD4C6] hover:border-[#C8BCAB] transition-colors flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-[#6E756D] text-[11px]">#{sub.id}</span>
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${badge.bg}`}
                        >
                          {sub.status}
                        </span>
                        <span className="font-mono text-[11px] text-[#6E756D] uppercase">
                          {sub.language}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-[#6E756D] font-mono">
                        <span>
                          {sub.passed_tests}/{sub.total_tests} tests
                        </span>
                        <span>{sub.runtime_ms} ms</span>
                        <span className="text-[#A39A8C] hidden sm:inline">
                          {new Date(sub.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
