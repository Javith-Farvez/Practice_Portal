import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/db';

// POST /api/bookmarks
export const addBookmark = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: Authentication required.',
        data: null,
      });
      return;
    }

    const { problem_id } = req.body;
    const problemId = parseInt(problem_id, 10);

    if (isNaN(problemId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid problem_id provided.',
        data: null,
      });
      return;
    }

    const userId = req.user.id;

    // Check if problem exists
    const probRes = await pool.query('SELECT id FROM problems WHERE id = $1', [problemId]);
    if (probRes.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Problem not found.',
        data: null,
      });
      return;
    }

    // Insert into bookmarks table (PostgreSQL ON CONFLICT)
    await pool.query(
      `INSERT INTO bookmarks (user_id, problem_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, problem_id) DO UPDATE SET created_at = CURRENT_TIMESTAMP`,
      [userId, problemId]
    );

    // Sync user_problem_progress
    await pool.query(
      `INSERT INTO user_problem_progress (user_id, problem_id, is_bookmarked)
       VALUES ($1, $2, TRUE)
       ON CONFLICT (user_id, problem_id) DO UPDATE SET is_bookmarked = TRUE`,
      [userId, problemId]
    );

    res.status(200).json({
      success: true,
      message: 'Problem bookmarked successfully.',
      data: {
        problem_id: problemId,
        is_bookmarked: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/bookmarks/:problemId
export const removeBookmark = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: Authentication required.',
        data: null,
      });
      return;
    }

    const rawProblemId = req.params.problemId || req.body?.problem_id || req.query?.problem_id;
    const problemId = parseInt(rawProblemId as string, 10);

    if (isNaN(problemId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid problem_id provided.',
        data: null,
      });
      return;
    }

    const userId = req.user.id;

    await pool.query('DELETE FROM bookmarks WHERE user_id = $1 AND problem_id = $2', [
      userId,
      problemId,
    ]);

    // Sync user_problem_progress
    await pool.query(
      `UPDATE user_problem_progress SET is_bookmarked = FALSE WHERE user_id = $1 AND problem_id = $2`,
      [userId, problemId]
    );

    res.status(200).json({
      success: true,
      message: 'Bookmark removed successfully.',
      data: {
        problem_id: problemId,
        is_bookmarked: false,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/bookmarks
export const getBookmarks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    const query = `
      SELECT 
        p.id,
        p.title,
        p.difficulty,
        p.level,
        s.name as subject_name,
        s.slug as subject_slug,
        t.name as topic_name,
        COALESCE(upp.status, 'UNSOLVED') as status,
        b.created_at as bookmarked_at
      FROM bookmarks b
      JOIN problems p ON b.problem_id = p.id
      JOIN subjects s ON p.subject_id = s.id
      JOIN topics t ON p.topic_id = t.id
      LEFT JOIN user_problem_progress upp ON p.id = upp.problem_id AND upp.user_id = $1
      WHERE b.user_id = $2
      ORDER BY b.created_at DESC
    `;

    const result = await pool.query(query, [userId, userId]);

    res.status(200).json({
      success: true,
      message: 'Bookmarks retrieved successfully.',
      data: {
        total: result.rows.length,
        bookmarks: result.rows,
      },
    });
  } catch (error) {
    next(error);
  }
};
