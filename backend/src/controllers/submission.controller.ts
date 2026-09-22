import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/db';
import { JudgeService } from '../services/judge/judge.service';
import { Language } from '../services/judge/types';

// POST /api/problems/:id/run
export const runProblemCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const problemId = parseInt(req.params.id as string, 10);
    const { language, source_code, custom_input, stdin } = req.body;

    if (isNaN(problemId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid problem ID.',
        data: null,
      });
      return;
    }

    if (!language || !['JAVA', 'PYTHON'].includes(String(language).toUpperCase())) {
      res.status(400).json({
        success: false,
        message: 'Invalid or unsupported language. Supported languages: JAVA, PYTHON.',
        data: null,
      });
      return;
    }

    if (!source_code || typeof source_code !== 'string' || source_code.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Source code cannot be empty.',
        data: null,
      });
      return;
    }

    const rawCustomInput = typeof custom_input === 'string' ? custom_input : (typeof stdin === 'string' ? stdin : undefined);
    const normalizedLang = String(language).toUpperCase() as Language;
    const result = await JudgeService.runPublicTests(problemId, normalizedLang, source_code, rawCustomInput);

    res.status(200).json({
      success: true,
      message: 'Public test cases executed.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/problems/:id/submit
export const submitProblemCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: You must be logged in to submit code.',
        data: null,
      });
      return;
    }

    const problemId = parseInt(req.params.id as string, 10);
    const { language, source_code } = req.body;
    const userId = req.user.id;

    if (isNaN(problemId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid problem ID.',
        data: null,
      });
      return;
    }

    if (!language || String(language).toUpperCase() !== 'JAVA') {
      res.status(400).json({
        success: false,
        message: 'Invalid or unsupported language. The coding platform currently supports Java.',
        data: null,
      });
      return;
    }

    if (!source_code || typeof source_code !== 'string' || source_code.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Source code cannot be empty.',
        data: null,
      });
      return;
    }

    const normalizedLang = 'JAVA' as Language;
    const result = await JudgeService.submitSolution(userId, problemId, normalizedLang, source_code);

    res.status(200).json({
      success: true,
      message:
        result.status === 'ACCEPTED'
          ? 'Solution Accepted!'
          : `Solution evaluated: ${result.status}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/submissions
export const getUserSubmissions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: Authentication required.',
        data: null,
      });
      return;
    }

    const userId = req.user.id;
    const { problem_id, status, topic_id, language, page = '1', limit = '20' } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10) || 20));
    const offset = (pageNum - 1) * limitNum;

    const whereClauses = ['s.user_id = $1'];
    const queryParams: any[] = [userId];

    if (problem_id && !isNaN(Number(problem_id))) {
      queryParams.push(Number(problem_id));
      whereClauses.push(`s.problem_id = $${queryParams.length}`);
    }

    if (status && status !== 'ALL') {
      queryParams.push(String(status).toUpperCase());
      whereClauses.push(`s.status = $${queryParams.length}`);
    }

    if (topic_id && !isNaN(Number(topic_id))) {
      queryParams.push(Number(topic_id));
      whereClauses.push(`p.topic_id = $${queryParams.length}`);
    }

    if (language && language !== 'ALL') {
      queryParams.push(String(language).toUpperCase());
      whereClauses.push(`s.language = $${queryParams.length}`);
    }

    const whereSql = `WHERE ${whereClauses.join(' AND ')}`;

    // Total count query
    const countResult = await pool.query(
      `SELECT COUNT(s.id) as total 
       FROM submissions s 
       JOIN problems p ON s.problem_id = p.id
       ${whereSql}`,
      queryParams
    );
    const total = Number(countResult.rows[0]?.total) || 0;

    // Submissions data query
    const dataParams = [...queryParams];
    dataParams.push(limitNum);
    const limitPlaceholder = `$${dataParams.length}`;
    dataParams.push(offset);
    const offsetPlaceholder = `$${dataParams.length}`;

    const query = `
      SELECT 
        s.id,
        s.user_id,
        s.problem_id,
        p.title as problem_title,
        p.slug as problem_slug,
        t.id as topic_id,
        t.name as topic_name,
        s.language,
        s.status,
        s.passed_tests,
        s.total_tests,
        s.runtime_ms,
        s.memory_kb,
        s.created_at
      FROM submissions s
      JOIN problems p ON s.problem_id = p.id
      JOIN topics t ON p.topic_id = t.id
      ${whereSql}
      ORDER BY s.created_at DESC
      LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder}
    `;

    const result = await pool.query(query, dataParams);

    res.status(200).json({
      success: true,
      message: 'Submissions retrieved successfully.',
      data: {
        total,
        page: pageNum,
        limit: limitNum,
        submissions: result.rows,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/submissions/:id
export const getSubmissionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: Authentication required.',
        data: null,
      });
      return;
    }

    const submissionId = parseInt(req.params.id as string, 10);
    const userId = req.user.id;

    if (isNaN(submissionId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid submission ID.',
        data: null,
      });
      return;
    }

    const result = await pool.query(
      `SELECT 
        s.id,
        s.user_id,
        s.problem_id,
        p.title as problem_title,
        p.slug as problem_slug,
        t.id as topic_id,
        t.name as topic_name,
        s.language,
        s.source_code,
        s.status,
        s.passed_tests,
        s.total_tests,
        s.runtime_ms,
        s.memory_kb,
        s.created_at
       FROM submissions s
       JOIN problems p ON s.problem_id = p.id
       JOIN topics t ON p.topic_id = t.id
       WHERE s.id = $1 AND (s.user_id = $2 OR $3 = 'ADMIN')
       LIMIT 1`,
      [submissionId, userId, req.user.role]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Submission not found or unauthorized.',
        data: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Submission details retrieved.',
      data: {
        submission: result.rows[0],
      },
    });
  } catch (error) {
    next(error);
  }
};
