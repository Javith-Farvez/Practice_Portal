export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';
export type PlacementImportance = 'NORMAL' | 'IMPORTANT' | 'VERY_IMPORTANT' | 'LESS_IMPORTANT';
export type ValidationType = 'TRIMMED' | 'EXACT' | 'NUMERIC';

export interface TestCaseSeed {
  input: string;
  expected_output: string;
  is_hidden: boolean;
  tolerance?: number;
}

export interface ProblemSeed {
  topicOrder: number; // 1 to 26
  title: string;
  slug: string;
  difficulty: DifficultyLevel;
  placement_importance: PlacementImportance;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PLACEMENT';
  description: string;
  input_format: string;
  output_format: string;
  constraints: string;
  sample_input: string;
  sample_output: string;
  explanation: string;
  hints: string[];
  starter_code: string;
  reference_solution: string;
  validation_type?: ValidationType;
  tolerance?: number;
  public_tests: { input: string; expected_output: string }[];
  hidden_tests: { input: string; expected_output: string }[];
}
