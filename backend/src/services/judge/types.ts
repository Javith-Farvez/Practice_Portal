export type Language = 'JAVA';

export type JudgeVerdict =
  | 'ACCEPTED'
  | 'WRONG_ANSWER'
  | 'COMPILATION_ERROR'
  | 'RUNTIME_ERROR'
  | 'TIME_LIMIT_EXCEEDED'
  | 'MEMORY_LIMIT_EXCEEDED';

export type ValidationType = 'EXACT' | 'TRIMMED' | 'NUMERIC';

export interface TestCaseItem {
  id: number;
  problem_id: number;
  input: string;
  expected_output: string;
  is_hidden: boolean;
  validation_type: ValidationType;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  runtimeMs: number;
  memoryKb: number;
  timedOut: boolean;
  compilationError?: string;
}

export interface PublicTestResultItem {
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

export interface JudgeRunResult {
  status: 'SUCCESS' | 'ERROR';
  totalPublicTests: number;
  passedPublicTests: number;
  compilationError?: string;
  customResult?: CustomTestResult;
  results: PublicTestResultItem[];
}

export interface JudgeSubmitResult {
  status: JudgeVerdict;
  passedCount: number;
  totalCount: number;
  runtimeMs: number;
  memoryKb: number;
  compilationError?: string;
  submissionId?: number;
  // Details for public tests only (hidden tests are NEVER included)
  publicResults: PublicTestResultItem[];
}
