import { pool } from '../../config/db';
import { AuditService } from './audit.service';
import { JudgeService } from '../judge/judge.service';

export interface CreateProblemInput {
  title: string;
  slug?: string;
  description: string;
  subject_id: number;
  topic_id: number;
  subtopic_id?: number | null;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PLACEMENT';
  status?: 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED';
  input_format?: string;
  output_format?: string;
  constraints?: string;
  sample_input?: string;
  sample_output?: string;
  explanation?: string;
  starter_code?: string;
  reference_solution?: string;
  examples?: Array<{ input: string; output: string; explanation?: string }>;
  hints?: string[];
  supported_languages?: string[];
  is_published?: boolean;
  test_cases?: Array<{
    input: string;
    expected_output: string;
    is_hidden?: boolean;
    validation_type?: 'EXACT' | 'TRIMMED' | 'NUMERIC';
  }>;
}

export class AdminProblemService {
  /**
   * List problems for admin view with test case counts and publish states
   */
  public static async getAdminProblems(params: {
    page?: number;
    limit?: number;
    search?: string;
    subject?: string;
    topic_id?: number | string;
    difficulty?: string;
    level?: string;
    status?: string;
    is_published?: string;
    include_deleted?: boolean | string;
  }) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(Math.max(1, Number(params.limit) || 20), 100);
    const offset = (page - 1) * limit;

    const whereClauses: string[] = [];
    const queryParams: any[] = [];

    // Filter soft deleted by default unless explicitly asked
    if (params.include_deleted !== true && params.include_deleted !== 'true') {
      whereClauses.push('(p.is_deleted = FALSE OR p.is_deleted IS NULL)');
    }

    if (params.search && params.search.trim()) {
      queryParams.push(`%${params.search.trim()}%`);
      const sIdx = queryParams.length;
      whereClauses.push(`(p.title ILIKE $${sIdx} OR p.description ILIKE $${sIdx} OR p.slug ILIKE $${sIdx})`);
    }

    if (params.subject) {
      if (!isNaN(Number(params.subject))) {
        queryParams.push(Number(params.subject));
        whereClauses.push(`p.subject_id = $${queryParams.length}`);
      } else {
        queryParams.push(params.subject);
        whereClauses.push(`s.slug = $${queryParams.length}`);
      }
    }

    if (params.topic_id) {
      queryParams.push(Number(params.topic_id));
      whereClauses.push(`p.topic_id = $${queryParams.length}`);
    }

    if (params.status && ['DRAFT', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED'].includes(params.status.toUpperCase())) {
      queryParams.push(params.status.toUpperCase());
      whereClauses.push(`p.status = $${queryParams.length}`);
    }

    if (params.difficulty && ['EASY', 'MEDIUM', 'HARD'].includes(params.difficulty.toUpperCase())) {
      queryParams.push(params.difficulty.toUpperCase());
      whereClauses.push(`p.difficulty = $${queryParams.length}`);
    }

    if (params.level && ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PLACEMENT'].includes(params.level.toUpperCase())) {
      queryParams.push(params.level.toUpperCase());
      whereClauses.push(`p.level = $${queryParams.length}`);
    }

    if (params.is_published !== undefined && params.is_published !== '') {
      queryParams.push(params.is_published === 'true' || params.is_published === '1');
      whereClauses.push(`p.is_published = $${queryParams.length}`);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Total count
    const countResult = await pool.query(
      `SELECT COUNT(p.id) as total
       FROM problems p
       JOIN subjects s ON p.subject_id = s.id
       JOIN topics t ON p.topic_id = t.id
       ${whereSql}`,
      queryParams
    );
    const total = Number(countResult.rows[0]?.total) || 0;

    // Data query
    const dataParams = [...queryParams];
    dataParams.push(limit);
    const limitPlaceholder = `$${dataParams.length}`;
    dataParams.push(offset);
    const offsetPlaceholder = `$${dataParams.length}`;

    const dataResult = await pool.query(
      `SELECT 
        p.id,
        p.title,
        p.slug,
        p.difficulty,
        p.level,
        p.status,
        p.is_published,
        p.is_deleted,
        p.created_at,
        p.updated_at,
        s.id as subject_id,
        s.name as subject_name,
        s.slug as subject_slug,
        t.id as topic_id,
        t.name as topic_name,
        COUNT(DISTINCT tc.id) as total_test_cases,
        COUNT(DISTINCT CASE WHEN tc.is_hidden = false THEN tc.id END) as public_tests_count,
        COUNT(DISTINCT CASE WHEN tc.is_hidden = true THEN tc.id END) as hidden_tests_count,
        COUNT(DISTINCT sub.id) as submissions_count
       FROM problems p
       JOIN subjects s ON p.subject_id = s.id
       JOIN topics t ON p.topic_id = t.id
       LEFT JOIN test_cases tc ON p.id = tc.problem_id
       LEFT JOIN submissions sub ON p.id = sub.problem_id
       ${whereSql}
       GROUP BY p.id, s.id, s.name, s.slug, t.id, t.name
       ORDER BY p.id DESC
       LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder}`,
      dataParams
    );

    return {
      total,
      page,
      limit,
      problems: dataResult.rows.map((r: any) => ({
        ...r,
        is_published: Boolean(r.is_published),
        is_deleted: Boolean(r.is_deleted),
      })),
    };
  }

  /**
   * Retrieve problem with full admin details and all test cases
   */
  public static async getProblemById(id: number) {
    const result = await pool.query(
      `SELECT p.*, s.name as subject_name, s.slug as subject_slug, t.name as topic_name, st.name as subtopic_name
       FROM problems p
       JOIN subjects s ON p.subject_id = s.id
       JOIN topics t ON p.topic_id = t.id
       LEFT JOIN subtopics st ON p.subtopic_id = st.id
       WHERE p.id = $1 LIMIT 1`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error('Problem not found.');
    }

    const problem = result.rows[0];

    // Safely parse JSON fields
    let hints = [];
    try {
      hints = typeof problem.hints === 'string' ? JSON.parse(problem.hints) : problem.hints || [];
    } catch {
      hints = [];
    }

    let supportedLanguages = [];
    try {
      supportedLanguages =
        typeof problem.supported_languages === 'string'
          ? JSON.parse(problem.supported_languages)
          : problem.supported_languages || ['Java'];
    } catch {
      supportedLanguages = ['Java'];
    }

    let examples = [];
    try {
      examples = typeof problem.examples === 'string' ? JSON.parse(problem.examples) : problem.examples || [];
    } catch {
      examples = [];
    }

    // Fetch all test cases
    const tcResult = await pool.query(
      'SELECT id, problem_id, input, expected_output, is_hidden, validation_type FROM test_cases WHERE problem_id = $1 ORDER BY is_hidden ASC, id ASC',
      [id]
    );

    return {
      ...problem,
      is_published: Boolean(problem.is_published),
      hints,
      supported_languages: supportedLanguages,
      examples,
      test_cases: tcResult.rows.map((tc: any) => ({
        ...tc,
        is_hidden: Boolean(tc.is_hidden),
      })),
    };
  }

  /**
   * Create a new problem with optional test cases
   */
  public static async createProblem(data: CreateProblemInput, adminId: number) {
    if (!data.title?.trim() || !data.description?.trim() || !data.subject_id || !data.topic_id) {
      throw new Error('Title, description, subject_id, and topic_id are required.');
    }

    // Validate that topic_id strictly belongs to the chosen subject_id
    try {
      const topicCheck = await pool.query(
        'SELECT id, subject_id FROM topics WHERE id = $1',
        [data.topic_id]
      );
      if (topicCheck.rows.length > 0 && Number(topicCheck.rows[0].subject_id) !== Number(data.subject_id)) {
        throw new Error('Invalid topic: The selected topic does not belong to the chosen subject.');
      }
    } catch (checkErr: any) {
      if (checkErr.message.includes('Invalid topic:')) throw checkErr;
      // If DB error, proceed
    }

    const difficulty = ['EASY', 'MEDIUM', 'HARD'].includes(data.difficulty) ? data.difficulty : 'EASY';
    const level = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PLACEMENT'].includes(data.level || '')
      ? data.level
      : 'BEGINNER';

    const hintsJson = JSON.stringify(data.hints || []);
    const langsJson = JSON.stringify(data.supported_languages || ['Java']);
    const examplesJson = JSON.stringify(data.examples || []);
    
    // Status handling
    const status = data.status || (data.is_published !== false ? 'PUBLISHED' : 'DRAFT');
    const isPublished = status === 'PUBLISHED';
    const slug = data.slug?.trim() || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const insertRes = await pool.query<{ id: number }>(
      `INSERT INTO problems (
        title, slug, description, subject_id, topic_id, subtopic_id,
        difficulty, level, status, input_format, output_format, constraints,
        sample_input, sample_output,
        explanation, examples, hints, supported_languages, is_published,
        starter_code, reference_solution, is_deleted, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, FALSE, NOW(), NOW()
      ) RETURNING id`,
      [
        data.title.trim(),
        slug,
        data.description.trim(),
        data.subject_id,
        data.topic_id,
        data.subtopic_id || null,
        difficulty,
        level,
        status,
        data.input_format || '',
        data.output_format || '',
        data.constraints || '',
        data.sample_input || null,
        data.sample_output || null,
        data.explanation || '',
        examplesJson,
        hintsJson,
        langsJson,
        isPublished,
        data.starter_code || null,
        data.reference_solution || null,
      ]
    );

    const problemId = insertRes.rows[0].id;

    // Insert test cases if provided
    let insertedTestsCount = 0;
    if (Array.isArray(data.test_cases) && data.test_cases.length > 0) {
      for (const tc of data.test_cases) {
        if (tc.input !== undefined && tc.expected_output !== undefined) {
          await pool.query(
            `INSERT INTO test_cases (problem_id, input, expected_output, is_hidden, validation_type, created_at)
             VALUES ($1, $2, $3, $4, $5, NOW())`,
            [
              problemId,
              tc.input,
              tc.expected_output,
              Boolean(tc.is_hidden),
              tc.validation_type || 'TRIMMED',
            ]
          );
          insertedTestsCount++;
        }
      }
    }

    await AuditService.recordAction(adminId, 'PROBLEM_CREATED', 'problem', problemId, {
      title: data.title,
      difficulty,
      status,
      test_cases_count: insertedTestsCount,
      is_published: isPublished,
    });

    return {
      id: problemId,
      title: data.title,
      slug,
      status,
      is_published: isPublished,
      test_cases_count: insertedTestsCount,
    };
  }

  /**
   * Update an existing problem
   */
  public static async updateProblem(id: number, data: Partial<CreateProblemInput>, adminId: number) {
    const existingResult = await pool.query(
      'SELECT * FROM problems WHERE id = $1 LIMIT 1',
      [id]
    );

    if (existingResult.rows.length === 0) {
      throw new Error('Problem not found.');
    }

    const ex = existingResult.rows[0];
    const title = data.title !== undefined ? data.title.trim() : ex.title;
    const slug = data.slug !== undefined ? data.slug.trim() : ex.slug;
    const description = data.description !== undefined ? data.description.trim() : ex.description;
    const subjectId = data.subject_id !== undefined ? data.subject_id : ex.subject_id;
    const topicId = data.topic_id !== undefined ? data.topic_id : ex.topic_id;

    // Validate that topic_id strictly belongs to the subject_id
    if (data.topic_id !== undefined || data.subject_id !== undefined) {
      try {
        const topicCheck = await pool.query(
          'SELECT id, subject_id FROM topics WHERE id = $1',
          [topicId]
        );
        if (topicCheck.rows.length > 0 && Number(topicCheck.rows[0].subject_id) !== Number(subjectId)) {
          throw new Error('Invalid topic: The selected topic does not belong to the chosen subject.');
        }
      } catch (checkErr: any) {
        if (checkErr.message.includes('Invalid topic:')) throw checkErr;
      }
    }

    const subtopicId = data.subtopic_id !== undefined ? data.subtopic_id : ex.subtopic_id;
    const difficulty = data.difficulty !== undefined ? data.difficulty : ex.difficulty;
    const level = data.level !== undefined ? data.level : ex.level;
    const inputFormat = data.input_format !== undefined ? data.input_format : ex.input_format;
    const outputFormat = data.output_format !== undefined ? data.output_format : ex.output_format;
    const constraints = data.constraints !== undefined ? data.constraints : ex.constraints;
    const sampleInput = data.sample_input !== undefined ? data.sample_input : ex.sample_input;
    const sampleOutput = data.sample_output !== undefined ? data.sample_output : ex.sample_output;
    const explanation = data.explanation !== undefined ? data.explanation : ex.explanation;
    const starterCode = data.starter_code !== undefined ? data.starter_code : ex.starter_code;
    const referenceSolution = data.reference_solution !== undefined ? data.reference_solution : ex.reference_solution;

    // Status logic
    let status = ex.status;
    let isPublished = Boolean(ex.is_published);
    if (data.status) {
      status = data.status;
      isPublished = status === 'PUBLISHED';
    } else if (data.is_published !== undefined) {
      isPublished = Boolean(data.is_published);
      status = isPublished ? 'PUBLISHED' : 'UNPUBLISHED';
    }

    const hintsJson =
      data.hints !== undefined
        ? JSON.stringify(data.hints)
        : typeof ex.hints === 'string'
        ? ex.hints
        : JSON.stringify(ex.hints || []);
    const langsJson =
      data.supported_languages !== undefined
        ? JSON.stringify(data.supported_languages)
        : typeof ex.supported_languages === 'string'
        ? ex.supported_languages
        : JSON.stringify(ex.supported_languages || ['Java']);
    const examplesJson =
      data.examples !== undefined
        ? JSON.stringify(data.examples)
        : typeof ex.examples === 'string'
        ? ex.examples
        : JSON.stringify(ex.examples || []);

    await pool.query(
      `UPDATE problems SET
        title = $1, slug = $2, description = $3, subject_id = $4, topic_id = $5, subtopic_id = $6,
        difficulty = $7, level = $8, status = $9, input_format = $10, output_format = $11, constraints = $12,
        sample_input = $13, sample_output = $14,
        explanation = $15, examples = $16, hints = $17, supported_languages = $18, is_published = $19,
        starter_code = $20, reference_solution = $21, updated_at = NOW()
       WHERE id = $22`,
      [
        title,
        slug,
        description,
        subjectId,
        topicId,
        subtopicId || null,
        difficulty,
        level,
        status,
        inputFormat,
        outputFormat,
        constraints,
        sampleInput,
        sampleOutput,
        explanation,
        examplesJson,
        hintsJson,
        langsJson,
        isPublished,
        starterCode,
        referenceSolution,
        id,
      ]
    );

    await AuditService.recordAction(adminId, 'PROBLEM_EDITED', 'problem', id, {
      title,
      difficulty,
      status,
      topic_id: topicId,
      is_published: isPublished,
    });

    return {
      id,
      title,
      slug,
      topic_id: topicId,
      status,
      is_published: isPublished,
    };
  }

  /**
   * Soft Delete a problem
   */
  public static async deleteProblem(id: number, adminId: number) {
    const result = await pool.query(
      'SELECT id, title FROM problems WHERE id = $1 LIMIT 1',
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error('Problem not found.');
    }

    const title = result.rows[0].title;
    await pool.query(
      `UPDATE problems SET
        is_deleted = TRUE,
        status = 'ARCHIVED',
        is_published = FALSE,
        updated_at = NOW()
       WHERE id = $1`,
      [id]
    );

    await AuditService.recordAction(adminId, 'PROBLEM_SOFT_DELETED', 'problem', id, { title });
    return true;
  }

  /**
   * Set status directly
   */
  public static async setStatus(
    id: number,
    status: 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED',
    adminId: number
  ) {
    const result = await pool.query(
      'SELECT id, title, status FROM problems WHERE id = $1 LIMIT 1',
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error('Problem not found.');
    }

    const title = result.rows[0].title;
    const isPublished = status === 'PUBLISHED';
    const isDeleted = status === 'ARCHIVED';

    await pool.query(
      `UPDATE problems SET
        status = $1,
        is_published = $2,
        is_deleted = $3,
        updated_at = NOW()
       WHERE id = $4`,
      [status, isPublished, isDeleted, id]
    );

    await AuditService.recordAction(adminId, 'PROBLEM_STATUS_CHANGED', 'problem', id, {
      title,
      old_status: result.rows[0].status,
      new_status: status,
      is_published: isPublished,
    });

    return { id, title, status, is_published: isPublished, is_deleted: isDeleted };
  }

  /**
   * Get all problems belonging to a topic
   */
  public static async getTopicProblemsAdmin(topicId: number) {
    const result = await pool.query(
      `SELECT 
        p.id,
        p.title,
        p.slug,
        p.difficulty,
        p.level,
        p.status,
        p.is_published,
        p.is_deleted,
        p.created_at,
        p.updated_at,
        COUNT(DISTINCT tc.id) as total_test_cases,
        COUNT(DISTINCT CASE WHEN tc.is_hidden = false THEN tc.id END) as public_tests_count,
        COUNT(DISTINCT CASE WHEN tc.is_hidden = true THEN tc.id END) as hidden_tests_count,
        COUNT(DISTINCT sub.id) as submissions_count
       FROM problems p
       LEFT JOIN test_cases tc ON p.id = tc.problem_id
       LEFT JOIN submissions sub ON p.id = sub.problem_id
       WHERE p.topic_id = $1
       GROUP BY p.id
       ORDER BY p.id ASC`,
      [topicId]
    );

    return result.rows.map((r: any) => ({
      ...r,
      is_published: Boolean(r.is_published),
      is_deleted: Boolean(r.is_deleted),
    }));
  }

  /**
   * Toggle publish status of a problem
   */
  public static async togglePublish(id: number, isPublished: boolean, adminId: number) {
    return await this.setStatus(id, isPublished ? 'PUBLISHED' : 'UNPUBLISHED', adminId);
  }

  /**
   * Test a problem with user-provided source code before publishing
   */
  public static async testProblem(
    problemId: number,
    language: 'JAVA',
    sourceCode: string
  ) {
    return await JudgeService.runPublicTests(problemId, language, sourceCode);
  }

  /**
   * Bulk import problems from JSON/CSV with atomic transaction
   */
  public static async bulkImport(items: any[], adminId: number) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Import data must be a non-empty array of problem objects.');
    }

    // Cache subjects and topics for fast validation
    const subjectsRes = await pool.query('SELECT id, slug, name FROM subjects');
    const topicsRes = await pool.query('SELECT id, subject_id, name, slug FROM topics');
    const subjects = subjectsRes.rows;
    const topics = topicsRes.rows;

    // 1. Validation phase
    const validatedItems: Array<{
      title: string;
      description: string;
      subject_id: number;
      topic_id: number;
      difficulty: 'EASY' | 'MEDIUM' | 'HARD';
      level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PLACEMENT';
      input_format: string;
      output_format: string;
      constraints: string;
      explanation: string;
      hints: string[];
      supported_languages: string[];
      is_published: boolean;
      test_cases: Array<{
        input: string;
        expected_output: string;
        is_hidden: boolean;
        validation_type: 'EXACT' | 'TRIMMED' | 'NUMERIC';
      }>;
    }> = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const rowNum = i + 1;

      if (!item.title || String(item.title).trim() === '') {
        throw new Error(`Row ${rowNum}: 'title' is required.`);
      }
      if (!item.description || String(item.description).trim() === '') {
        throw new Error(`Row ${rowNum}: 'description' is required.`);
      }

      // Resolve subject
      let subjectId: number | null = null;
      if (item.subject_id) {
        const found = subjects.find((s) => s.id === Number(item.subject_id));
        if (found) subjectId = found.id;
      } else if (item.subject) {
        const norm = String(item.subject).trim().toLowerCase();
        const found = subjects.find((s) => s.slug.toLowerCase() === norm || s.name.toLowerCase() === norm);
        if (found) subjectId = found.id;
      }

      if (!subjectId) {
        throw new Error(
          `Row ${rowNum}: Invalid subject '${item.subject || item.subject_id}'. Valid subjects: ${subjects.map((s) => s.name).join(', ')}`
        );
      }

      // Resolve topic
      let topicId: number | null = null;
      if (item.topic_id) {
        const found = topics.find((t) => t.id === Number(item.topic_id) && t.subject_id === subjectId);
        if (found) topicId = found.id;
      } else if (item.topic) {
        const norm = String(item.topic).trim().toLowerCase();
        const found = topics.find(
          (t) => t.subject_id === subjectId && (t.name.toLowerCase() === norm || t.slug.toLowerCase() === norm)
        );
        if (found) topicId = found.id;
      }

      if (!topicId) {
        const firstTopic = topics.find((t) => t.subject_id === subjectId);
        if (firstTopic) {
          topicId = firstTopic.id;
        } else {
          throw new Error(`Row ${rowNum}: No topics found for subject.`);
        }
      }

      const diff = String(item.difficulty || 'EASY').toUpperCase();
      const difficulty = ['EASY', 'MEDIUM', 'HARD'].includes(diff)
        ? (diff as 'EASY' | 'MEDIUM' | 'HARD')
        : 'EASY';

      const lvl = String(item.level || 'BEGINNER').toUpperCase();
      const level = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PLACEMENT'].includes(lvl)
        ? (lvl as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PLACEMENT')
        : 'BEGINNER';

      // Validate test cases
      const testCases: any[] = [];
      if (Array.isArray(item.test_cases)) {
        for (let t = 0; t < item.test_cases.length; t++) {
          const tc = item.test_cases[t];
          if (tc.input === undefined || tc.expected_output === undefined) {
            throw new Error(`Row ${rowNum}, Test Case ${t + 1}: Both 'input' and 'expected_output' are required.`);
          }
          testCases.push({
            input: String(tc.input),
            expected_output: String(tc.expected_output),
            is_hidden: Boolean(tc.is_hidden),
            validation_type: ['EXACT', 'TRIMMED', 'NUMERIC'].includes(tc.validation_type)
              ? tc.validation_type
              : 'TRIMMED',
          });
        }
      }

      validatedItems.push({
        title: String(item.title).trim(),
        description: String(item.description).trim(),
        subject_id: subjectId,
        topic_id: topicId!,
        difficulty,
        level,
        input_format: item.input_format || '',
        output_format: item.output_format || '',
        constraints: item.constraints || '',
        explanation: item.explanation || '',
        hints: Array.isArray(item.hints) ? item.hints : [],
        supported_languages: Array.isArray(item.supported_languages)
          ? item.supported_languages
          : ['Java'],
        is_published: item.is_published !== undefined ? Boolean(item.is_published) : true,
        test_cases: testCases,
      });
    }

    // 2. Atomic PostgreSQL Transaction
    const client = await pool.connect();
    let importedProblemsCount = 0;
    let importedTestCasesCount = 0;

    try {
      await client.query('BEGIN');

      for (const item of validatedItems) {
        const insertRes = await client.query<{ id: number }>(
          `INSERT INTO problems (
            title, description, subject_id, topic_id, difficulty, level,
            input_format, output_format, constraints, explanation,
            hints, supported_languages, is_published
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          RETURNING id`,
          [
            item.title,
            item.description,
            item.subject_id,
            item.topic_id,
            item.difficulty,
            item.level,
            item.input_format,
            item.output_format,
            item.constraints,
            item.explanation,
            JSON.stringify(item.hints),
            JSON.stringify(item.supported_languages),
            item.is_published,
          ]
        );

        const problemId = insertRes.rows[0].id;
        importedProblemsCount++;

        for (const tc of item.test_cases) {
          await client.query(
            `INSERT INTO test_cases (problem_id, input, expected_output, is_hidden, validation_type)
             VALUES ($1, $2, $3, $4, $5)`,
            [problemId, tc.input, tc.expected_output, tc.is_hidden, tc.validation_type]
          );
          importedTestCasesCount++;
        }
      }

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

    await AuditService.recordAction(adminId, 'BULK_IMPORT_EXECUTED', 'problems', null, {
      problems_count: importedProblemsCount,
      test_cases_count: importedTestCasesCount,
    });

    return {
      imported_problems: importedProblemsCount,
      imported_test_cases: importedTestCasesCount,
    };
  }
}
