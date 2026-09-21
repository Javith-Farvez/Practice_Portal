import { pool } from '../config/db';

export interface PlacementOptions {
  java_count?: number;
  dsa_count?: number;
  aptitude_count?: number;
  difficulty?: string;
  userId?: number | null;
}

export interface PlacementProblem {
  id: number;
  title: string;
  description: string;
  subject_id: number;
  subject_name: string;
  subject_slug: string;
  topic_id: number;
  topic_name: string;
  difficulty: string;
  level: string;
  input_format: string | null;
  output_format: string | null;
  constraints: string | null;
  examples: any;
  hints: string[];
  supported_languages: string[];
  public_test_cases: Array<{
    id: number;
    input: string;
    expected_output: string;
    validation_type: string;
  }>;
  status?: string;
  is_bookmarked?: boolean;
}

export class PlacementService {
  /**
   * Generates a curated or randomized mixed practice set across tracks.
   */
  public static async generatePlacementSet(options: PlacementOptions = {}): Promise<{
    session_id: string;
    total_problems: number;
    counts: { java: number; dsa: number; aptitude: number };
    problems: PlacementProblem[];
  }> {
    const javaCount = Math.max(0, options.java_count !== undefined ? options.java_count : 5);
    const dsaCount = Math.max(0, options.dsa_count !== undefined ? options.dsa_count : 5);
    const aptCount = Math.max(0, options.aptitude_count !== undefined ? options.aptitude_count : 5);

    const diffFilter = options.difficulty && ['EASY', 'MEDIUM', 'HARD'].includes(options.difficulty.toUpperCase())
      ? options.difficulty.toUpperCase()
      : null;

    const fetchForSubject = async (slug: string, limit: number): Promise<PlacementProblem[]> => {
      if (limit <= 0) return [];

      const queryParams: any[] = [slug];
      let pIdx = 2;
      let diffClause = '';
      if (diffFilter) {
        diffClause = `AND p.difficulty = $${pIdx++}`;
        queryParams.push(diffFilter);
      }
      const limitParam = `$${pIdx++}`;
      queryParams.push(limit);

      const res = await pool.query<any>(
        `SELECT 
          p.id, p.title, p.description, p.subject_id, p.topic_id,
          p.difficulty, p.level, p.input_format, p.output_format,
          p.constraints, p.examples, p.hints, p.supported_languages,
          s.name as subject_name, s.slug as subject_slug,
          t.name as topic_name
         FROM problems p
         JOIN subjects s ON p.subject_id = s.id
         JOIN topics t ON p.topic_id = t.id
         WHERE s.slug = $1 
           AND (p.is_published IS NULL OR p.is_published = TRUE)
           ${diffClause}
         ORDER BY RANDOM()
         LIMIT ${limitParam}`,
        queryParams
      );
      const rows = res.rows;

      const problems: PlacementProblem[] = [];

      for (const row of rows) {
        // Fetch public test cases only (HIDDEN test cases are NEVER returned)
        const tcRes = await pool.query<any>(
          `SELECT id, input, expected_output, validation_type 
           FROM test_cases 
           WHERE problem_id = $1 AND is_hidden = FALSE 
           ORDER BY id ASC`,
          [row.id]
        );
        const tcRows = tcRes.rows;

        let examples = [];
        try {
          if (typeof row.examples === 'string') {
            examples = JSON.parse(row.examples);
          } else if (Array.isArray(row.examples)) {
            examples = row.examples;
          }
        } catch {
          examples = [];
        }

        let hints = [];
        try {
          if (typeof row.hints === 'string') {
            hints = JSON.parse(row.hints);
          } else if (Array.isArray(row.hints)) {
            hints = row.hints;
          }
        } catch {
          hints = [];
        }

        let langs = ['Java'];
        try {
          if (typeof row.supported_languages === 'string') {
            langs = JSON.parse(row.supported_languages);
          } else if (Array.isArray(row.supported_languages)) {
            langs = row.supported_languages;
          }
        } catch {
          langs = ['Java'];
        }

        problems.push({
          id: row.id,
          title: row.title,
          description: row.description,
          subject_id: row.subject_id,
          subject_name: row.subject_name,
          subject_slug: row.subject_slug,
          topic_id: row.topic_id,
          topic_name: row.topic_name,
          difficulty: row.difficulty,
          level: row.level,
          input_format: row.input_format,
          output_format: row.output_format,
          constraints: row.constraints,
          examples,
          hints,
          supported_languages: langs,
          public_test_cases: tcRows.map((tc) => ({
            id: tc.id,
            input: tc.input,
            expected_output: tc.expected_output,
            validation_type: tc.validation_type,
          })),
        });
      }

      return problems;
    };

    const [javaProbs, dsaProbs, aptProbs] = await Promise.all([
      fetchForSubject('java', javaCount),
      fetchForSubject('dsa', dsaCount),
      fetchForSubject('aptitude', aptCount),
    ]);

    // Combine in an alternating / structured placement fashion
    const allProblems = [...javaProbs, ...dsaProbs, ...aptProbs];

    const sessionId = `placement_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    return {
      session_id: sessionId,
      total_problems: allProblems.length,
      counts: {
        java: javaProbs.length,
        dsa: dsaProbs.length,
        aptitude: aptProbs.length,
      },
      problems: allProblems,
    };
  }
}
