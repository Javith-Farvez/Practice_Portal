import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/db';
import { fallbackStore } from '../data/fallbackStore';

// GET /api/subjects
export const getSubjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id || null;

    try {
      const query = `
        SELECT 
          s.id,
          s.slug,
          s.name,
          s.description,
          s.icon,
          s.color_gradient,
          s.order_index,
          COUNT(DISTINCT t.id) AS total_topics,
          COUNT(DISTINCT p.id) AS total_problems,
          COUNT(DISTINCT CASE WHEN upp.status = 'SOLVED' THEN p.id END) AS solved_problems
        FROM subjects s
        LEFT JOIN topics t ON s.id = t.subject_id
        LEFT JOIN problems p ON s.id = p.subject_id AND p.status = 'PUBLISHED' AND (p.is_deleted = FALSE OR p.is_deleted IS NULL)
        LEFT JOIN user_problem_progress upp ON p.id = upp.problem_id AND upp.user_id = $1
        GROUP BY s.id, s.slug, s.name, s.description, s.icon, s.color_gradient, s.order_index
        ORDER BY s.order_index ASC
      `;

      const result = await pool.query(query, [userId]);

      if (result.rows && result.rows.length > 0) {
        const subjects = result.rows.map((row: any) => {
          const total = Number(row.total_problems) || 0;
          const solved = Number(row.solved_problems) || 0;
          const progress = total > 0 ? Math.round((solved / total) * 100) : 0;
          return {
            id: row.id,
            slug: row.slug,
            name: row.name,
            description: row.description,
            icon: row.icon,
            color_gradient: row.color_gradient,
            order_index: row.order_index,
            total_topics: Number(row.total_topics) || 0,
            total_problems: total,
            solved_problems: solved,
            progress_percentage: progress,
          };
        });

        res.status(200).json({
          success: true,
          message: 'Subjects retrieved successfully.',
          data: { subjects },
        });
        return;
      }
    } catch (dbErr) {
      console.warn('[Learning Controller] Database query for subjects failed, using fallback store:', (dbErr as any).message);
    }

    // Fallback Store
    const subjects = fallbackStore.getSubjects(userId);
    res.status(200).json({
      success: true,
      message: 'Subjects retrieved successfully.',
      data: { subjects },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/subjects/:slug
export const getSubjectBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;
    const userId = req.user?.id || null;

    try {
      // 1. Fetch Subject
      const subResult = await pool.query(
        'SELECT id, slug, name, description, icon, color_gradient FROM subjects WHERE slug = $1 LIMIT 1',
        [slug]
      );

      if (subResult.rows.length > 0) {
        const subject = subResult.rows[0];

        // 2. Fetch Topics with counts & user progress
        const topicsQuery = `
          SELECT 
            t.id,
            t.name,
            t.slug,
            t.order_index,
            t.description,
            COUNT(p.id) AS total_problems,
            COUNT(CASE WHEN upp.status = 'SOLVED' THEN 1 END) AS solved_problems,
            COUNT(CASE WHEN p.difficulty = 'EASY' THEN 1 END) AS easy_count,
            COUNT(CASE WHEN p.difficulty = 'MEDIUM' THEN 1 END) AS medium_count,
            COUNT(CASE WHEN p.difficulty = 'HARD' THEN 1 END) AS hard_count
          FROM topics t
          LEFT JOIN problems p ON t.id = p.topic_id AND p.status = 'PUBLISHED' AND (p.is_deleted = FALSE OR p.is_deleted IS NULL)
          LEFT JOIN user_problem_progress upp ON p.id = upp.problem_id AND upp.user_id = $1
          WHERE t.subject_id = $2
          GROUP BY t.id, t.name, t.slug, t.order_index, t.description
          ORDER BY t.order_index ASC
        `;

        const topicResult = await pool.query(topicsQuery, [userId, subject.id]);

        let overallTotal = 0;
        let overallSolved = 0;

        const topics = topicResult.rows.map((row: any) => {
          const total = Number(row.total_problems) || 0;
          const solved = Number(row.solved_problems) || 0;
          overallTotal += total;
          overallSolved += solved;
          const progress = total > 0 ? Math.round((solved / total) * 100) : 0;

          return {
            id: row.id,
            name: row.name,
            slug: row.slug,
            order_index: row.order_index,
            description: row.description,
            total_problems: total,
            solved_problems: solved,
            progress_percentage: progress,
            difficulty_distribution: {
              easy: Number(row.easy_count) || 0,
              medium: Number(row.medium_count) || 0,
              hard: Number(row.hard_count) || 0,
            },
          };
        });

        const overallProgress = overallTotal > 0 ? Math.round((overallSolved / overallTotal) * 100) : 0;

        res.status(200).json({
          success: true,
          message: 'Subject roadmap retrieved successfully.',
          data: {
            subject: {
              ...subject,
              total_problems: overallTotal,
              solved_problems: overallSolved,
              progress_percentage: overallProgress,
            },
            topics,
          },
        });
        return;
      }
    } catch (dbErr) {
      console.warn(`[Learning Controller] Database query for subject '${slug}' failed, using fallback store:`, (dbErr as any).message);
    }

    // Fallback store
    const fallbackData = fallbackStore.getSubjectBySlug(String(slug), userId);
    if (!fallbackData) {
      res.status(404).json({
        success: false,
        message: `Subject with slug '${slug}' not found.`,
        data: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Subject roadmap retrieved successfully.',
      data: fallbackData,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/topics/:id
export const getTopicById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const topicId = parseInt(req.params.id as string, 10);
    const userId = req.user?.id || null;

    if (isNaN(topicId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid topic ID parameter.',
        data: null,
      });
      return;
    }

    try {
      // 1. Fetch Topic Details & Subject info
      const topicResult = await pool.query(
        `SELECT t.*, s.name as subject_name, s.slug as subject_slug 
         FROM topics t 
         JOIN subjects s ON t.subject_id = s.id 
         WHERE t.id = $1 LIMIT 1`,
        [topicId]
      );

      if (topicResult.rows.length > 0) {
        const topic = topicResult.rows[0];

        // 2. Fetch Subtopics
        const subtopicsResult = await pool.query(
          'SELECT id, name, slug, order_index FROM subtopics WHERE topic_id = $1 ORDER BY order_index ASC',
          [topicId]
        );

        // 3. Fetch Problems under Topic with user solved status
        const userRole = req.user?.role || 'STUDENT';
        const problemVisibilityClause =
          userRole !== 'ADMIN'
            ? "AND p.status = 'PUBLISHED' AND (p.is_deleted = FALSE OR p.is_deleted IS NULL)"
            : 'AND (p.is_deleted = FALSE OR p.is_deleted IS NULL)';

        const problemsQuery = `
          SELECT 
            p.id,
            p.title,
            p.difficulty,
            p.level,
            p.subtopic_id,
            p.status as problem_status,
            COALESCE(upp.status, 'UNSOLVED') as status,
            COALESCE(upp.is_bookmarked, FALSE) as is_bookmarked
          FROM problems p
          LEFT JOIN user_problem_progress upp ON p.id = upp.problem_id AND upp.user_id = $1
          WHERE p.topic_id = $2 ${problemVisibilityClause}
          ORDER BY p.id ASC
        `;

        const problemsResult = await pool.query(problemsQuery, [userId, topicId]);
        let problems = problemsResult.rows;

        // If DB has 0 problems for this topic, check fallback store strictly matching topic & subject
        if (problems.length === 0) {
          const fallbackData = fallbackStore.getTopicBySlugAndSubject(topic.slug, topic.subject_slug, userId);
          if (fallbackData && fallbackData.problems.length > 0) {
            problems = fallbackData.problems;
          }
        }

        res.status(200).json({
          success: true,
          message: 'Topic details retrieved successfully.',
          data: {
            topic,
            subtopics: subtopicsResult.rows,
            problems,
          },
        });
        return;
      }
    } catch (dbErr) {
      console.warn(`[Learning Controller] Database query for topic #${topicId} failed, using fallback store:`, (dbErr as any).message);
    }

    // Fallback store
    const fallbackTopic = fallbackStore.getTopicById(topicId, userId);
    if (!fallbackTopic) {
      res.status(404).json({
        success: false,
        message: 'Topic not found.',
        data: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Topic details retrieved successfully.',
      data: fallbackTopic,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/problems
export const getProblems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id || null;
    const { subject, topic, difficulty, level, status, bookmarked, language, search, page = '1', limit = '50' } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 50));
    const offset = (pageNum - 1) * limitNum;

    try {
      const whereClauses: string[] = [];
      const params: any[] = [userId]; // $1 is userId

      // Filters
      if (subject) {
        if (!isNaN(Number(subject))) {
          params.push(Number(subject));
          whereClauses.push(`p.subject_id = $${params.length}`);
        } else {
          params.push(subject);
          whereClauses.push(`s.slug = $${params.length}`);
        }
      }

      if (topic && !isNaN(Number(topic))) {
        params.push(Number(topic));
        whereClauses.push(`p.topic_id = $${params.length}`);
      }

      if (difficulty && ['EASY', 'MEDIUM', 'HARD'].includes(String(difficulty).toUpperCase())) {
        params.push(String(difficulty).toUpperCase());
        whereClauses.push(`p.difficulty = $${params.length}`);
      }

      if (level && ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PLACEMENT'].includes(String(level).toUpperCase())) {
        params.push(String(level).toUpperCase());
        whereClauses.push(`p.level = $${params.length}`);
      }

      if (status) {
        const st = String(status).toUpperCase();
        if (st === 'SOLVED') {
          whereClauses.push("upp.status = 'SOLVED'");
        } else if (st === 'ATTEMPTED') {
          whereClauses.push("upp.status = 'ATTEMPTED'");
        } else if (st === 'UNSOLVED' || st === 'NOT_STARTED') {
          whereClauses.push("(upp.status IS NULL OR upp.status = 'UNSOLVED')");
        }
      }

      if (bookmarked === 'true') {
        whereClauses.push('upp.is_bookmarked = TRUE');
      }

      if (language) {
        const langNorm = String(language).toLowerCase();
        const langTarget = langNorm.includes('java') ? 'Java' : langNorm.includes('py') ? 'Python' : null;
        if (langTarget) {
          params.push(`%${langTarget}%`);
          whereClauses.push(`p.supported_languages::text ILIKE $${params.length}`);
        }
      }

      if (search && String(search).trim() !== '') {
        const searchTerm = `%${String(search).trim()}%`;
        params.push(searchTerm);
        const sIdx = params.length;
        whereClauses.push(
          `(p.title ILIKE $${sIdx} OR p.description ILIKE $${sIdx} OR t.name ILIKE $${sIdx} OR s.name ILIKE $${sIdx} OR p.difficulty ILIKE $${sIdx})`
        );
      }

      if (req.user?.role !== 'ADMIN') {
        whereClauses.push("p.status = 'PUBLISHED' AND (p.is_deleted = FALSE OR p.is_deleted IS NULL)");
      } else {
        whereClauses.push('(p.is_deleted = FALSE OR p.is_deleted IS NULL)');
      }

      const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

      const countSql = `
        SELECT COUNT(p.id) as total
        FROM problems p
        JOIN subjects s ON p.subject_id = s.id
        JOIN topics t ON p.topic_id = t.id
        LEFT JOIN user_problem_progress upp ON p.id = upp.problem_id AND upp.user_id = $1
        ${whereSql}
      `;

      const countResult = await pool.query(countSql, params);
      const total = Number(countResult.rows[0]?.total) || 0;

      if (total > 0) {
        const totalPages = Math.max(1, Math.ceil(total / limitNum));

        const dataParams = [...params];
        dataParams.push(limitNum);
        const limitPlaceholder = `$${dataParams.length}`;
        dataParams.push(offset);
        const offsetPlaceholder = `$${dataParams.length}`;

        const dataSql = `
          SELECT 
            p.id,
            p.title,
            p.difficulty,
            p.level,
            p.subject_id,
            p.topic_id,
            p.supported_languages,
            s.name as subject_name,
            s.slug as subject_slug,
            t.name as topic_name,
            COALESCE(upp.status, 'UNSOLVED') as status,
            COALESCE(upp.is_bookmarked, FALSE) as is_bookmarked,
            p.created_at
          FROM problems p
          JOIN subjects s ON p.subject_id = s.id
          JOIN topics t ON p.topic_id = t.id
          LEFT JOIN user_problem_progress upp ON p.id = upp.problem_id AND upp.user_id = $1
          ${whereSql}
          ORDER BY p.id ASC
          LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder}
        `;

        const dataResult = await pool.query(dataSql, dataParams);

        res.status(200).json({
          success: true,
          message: 'Problems retrieved successfully.',
          data: {
            total,
            page: pageNum,
            limit: limitNum,
            total_pages: totalPages,
            has_next: pageNum < totalPages,
            has_prev: pageNum > 1,
            problems: dataResult.rows,
          },
        });
        return;
      }
    } catch (dbErr) {
      console.warn('[Learning Controller] Database query for problems failed, using fallback store:', (dbErr as any).message);
    }

    // Fallback store
    const fallbackProblems = fallbackStore.getProblems(req.query, userId);
    res.status(200).json({
      success: true,
      message: 'Problems retrieved successfully.',
      data: fallbackProblems,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/problems/:id
export const getProblemById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const problemId = parseInt(req.params.id as string, 10);
    const userId = req.user?.id || null;

    if (isNaN(problemId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid problem ID.',
        data: null,
      });
      return;
    }

    try {
      const userRole = req.user?.role || 'STUDENT';
      const problemFilter =
        userRole !== 'ADMIN'
          ? "AND p.status = 'PUBLISHED' AND (p.is_deleted = FALSE OR p.is_deleted IS NULL)"
          : 'AND (p.is_deleted = FALSE OR p.is_deleted IS NULL)';

      const query = `
        SELECT 
          p.*,
          s.name as subject_name,
          s.slug as subject_slug,
          t.name as topic_name,
          st.name as subtopic_name,
          COALESCE(upp.status, 'UNSOLVED') as status,
          COALESCE(upp.is_bookmarked, FALSE) as is_bookmarked,
          upp.solved_at
        FROM problems p
        JOIN subjects s ON p.subject_id = s.id
        JOIN topics t ON p.topic_id = t.id
        LEFT JOIN subtopics st ON p.subtopic_id = st.id
        LEFT JOIN user_problem_progress upp ON p.id = upp.problem_id AND upp.user_id = $1
        WHERE p.id = $2 ${problemFilter}
        LIMIT 1
      `;

      const result = await pool.query(query, [userId, problemId]);

      if (result.rows.length > 0) {
        const problem = result.rows[0];

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
              : problem.supported_languages || [];
        } catch {
          supportedLanguages = [];
        }

        res.status(200).json({
          success: true,
          message: 'Problem retrieved successfully.',
          data: {
            problem: {
              ...problem,
              hints,
              supported_languages: supportedLanguages,
              is_bookmarked: Boolean(problem.is_bookmarked),
            },
          },
        });
        return;
      }
    } catch (dbErr) {
      console.warn(`[Learning Controller] Database query for problem #${problemId} failed, using fallback store:`, (dbErr as any).message);
    }

    // Fallback store
    const fallbackProblem = fallbackStore.getProblemById(problemId, userId);
    if (!fallbackProblem) {
      res.status(404).json({
        success: false,
        message: 'Problem not found.',
        data: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Problem retrieved successfully.',
      data: {
        problem: fallbackProblem,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/problems/:id/toggle-solve (Protected)
export const toggleProblemSolve = async (_req: Request, res: Response): Promise<void> => {
  res.status(403).json({
    success: false,
    message: 'Forbidden: Problem solve status can only be achieved through verified code execution and accepted verdict via /api/problems/:id/submit.',
    data: null,
  });
};

// POST /api/problems/:id/toggle-bookmark (Protected)
export const toggleProblemBookmark = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: Authentication required.',
        data: null,
      });
      return;
    }

    const problemId = parseInt(req.params.id as string, 10);
    const userId = req.user.id;

    if (isNaN(problemId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid problem ID.',
        data: null,
      });
      return;
    }

    let newBookmarkState = false;

    try {
      const checkRes = await pool.query(
        'SELECT is_bookmarked FROM user_problem_progress WHERE user_id = $1 AND problem_id = $2 LIMIT 1',
        [userId, problemId]
      );

      const isCurrent = checkRes.rows.length > 0 ? Boolean(checkRes.rows[0].is_bookmarked) : false;
      newBookmarkState = !isCurrent;

      await pool.query(
        `INSERT INTO user_problem_progress (user_id, problem_id, is_bookmarked)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, problem_id) DO UPDATE SET is_bookmarked = EXCLUDED.is_bookmarked`,
        [userId, problemId, newBookmarkState]
      );

      if (newBookmarkState) {
        await pool.query(
          `INSERT INTO bookmarks (user_id, problem_id) VALUES ($1, $2)
           ON CONFLICT (user_id, problem_id) DO UPDATE SET created_at = CURRENT_TIMESTAMP`,
          [userId, problemId]
        );
      } else {
        await pool.query('DELETE FROM bookmarks WHERE user_id = $1 AND problem_id = $2', [userId, problemId]);
      }
    } catch (dbErr) {
      console.warn('[Learning Controller] Database bookmark update failed, using fallback store:', (dbErr as any).message);
      newBookmarkState = fallbackStore.toggleBookmark(userId, problemId);
    }

    res.status(200).json({
      success: true,
      message: newBookmarkState ? 'Problem bookmarked.' : 'Bookmark removed.',
      data: {
        problem_id: problemId,
        is_bookmarked: newBookmarkState,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/user/progress (Protected)
export const getUserProgress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    try {
      // 1. Overall stats
      const totalResult = await pool.query(
        "SELECT COUNT(*) as count FROM problems WHERE status = 'PUBLISHED' AND (is_deleted = FALSE OR is_deleted IS NULL)"
      );
      const totalProblems = Number(totalResult.rows[0]?.count) || 0;

      if (totalProblems > 0) {
        const solvedResult = await pool.query(
          `SELECT COUNT(DISTINCT upp.problem_id) as count 
           FROM user_problem_progress upp
           JOIN problems p ON upp.problem_id = p.id AND p.status = 'PUBLISHED' AND (p.is_deleted = FALSE OR p.is_deleted IS NULL)
           WHERE upp.user_id = $1 AND upp.status = 'SOLVED'`,
          [userId]
        );
        const solvedProblems = Number(solvedResult.rows[0]?.count) || 0;
        const overallProgress = totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;

        // 2. Per-subject stats
        const subjectSql = `
          SELECT 
            s.id,
            s.slug,
            s.name,
            COUNT(p.id) as total,
            COUNT(CASE WHEN upp.status = 'SOLVED' THEN 1 END) as solved
          FROM subjects s
          LEFT JOIN problems p ON s.id = p.subject_id AND p.status = 'PUBLISHED' AND (p.is_deleted = FALSE OR p.is_deleted IS NULL)
          LEFT JOIN user_problem_progress upp ON p.id = upp.problem_id AND upp.user_id = $1
          GROUP BY s.id, s.slug, s.name, s.order_index
          ORDER BY s.order_index ASC
        `;

        const subjectResult = await pool.query(subjectSql, [userId]);
        const subjects = subjectResult.rows.map((row: any) => {
          const tot = Number(row.total) || 0;
          const sol = Number(row.solved) || 0;
          return {
            id: row.id,
            slug: row.slug,
            name: row.name,
            total: tot,
            solved: sol,
            percentage: tot > 0 ? Math.round((sol / tot) * 100) : 0,
          };
        });

        // 3. Current streak calculation
        const streakResult = await pool.query(
          `SELECT DISTINCT DATE(solved_at) as solve_date 
           FROM user_problem_progress 
           WHERE user_id = $1 AND status = 'SOLVED' AND solved_at IS NOT NULL 
           ORDER BY solve_date DESC`,
          [userId]
        );

        const streakRows = streakResult.rows;
        let currentStreak = 0;
        if (streakRows.length > 0) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);

          const firstDate = new Date(streakRows[0].solve_date);
          firstDate.setHours(0, 0, 0, 0);

          if (firstDate.getTime() === today.getTime() || firstDate.getTime() === yesterday.getTime()) {
            currentStreak = 1;
            let expectedDate = new Date(firstDate);

            for (let i = 1; i < streakRows.length; i++) {
              expectedDate.setDate(expectedDate.getDate() - 1);
              const nextDate = new Date(streakRows[i].solve_date);
              nextDate.setHours(0, 0, 0, 0);

              if (nextDate.getTime() === expectedDate.getTime()) {
                currentStreak++;
              } else {
                break;
              }
            }
          }
        }

        res.status(200).json({
          success: true,
          message: 'User progress calculated successfully.',
          data: {
            problems_solved: solvedProblems,
            total_problems: totalProblems,
            overall_progress_percentage: overallProgress,
            current_streak_days: currentStreak,
            subjects,
          },
        });
        return;
      }
    } catch (dbErr) {
      console.warn('[Learning Controller] Database user progress query failed, using fallback store:', (dbErr as any).message);
    }

    // Fallback store
    const dashboard = fallbackStore.getUserDashboard(userId);
    res.status(200).json({
      success: true,
      message: 'User progress calculated successfully.',
      data: {
        problems_solved: dashboard.problems_solved,
        total_problems: dashboard.total_problems,
        overall_progress_percentage: dashboard.overall_progress_percentage,
        current_streak_days: dashboard.current_streak,
        subjects: dashboard.subjects,
      },
    });
  } catch (error) {
    next(error);
  }
};
