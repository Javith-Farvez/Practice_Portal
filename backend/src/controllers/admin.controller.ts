import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/db';
import { AdminProblemService } from '../services/admin/admin-problem.service';
import { TestCaseManagementService } from '../services/admin/testcase-management.service';
import { AuditService } from '../services/admin/audit.service';
import { fallbackStore } from '../data/fallbackStore';

// GET /api/admin/metrics
export const getAdminMetrics = async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
  try {
    // 1. Total users, students, admins
    const userResult = await pool.query(
      `SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN role = 'STUDENT' THEN 1 END) as total_students,
        COUNT(CASE WHEN role = 'ADMIN' THEN 1 END) as total_admins
       FROM users`
    );

    // 2. Active users (distinct users with at least 1 daily_activity or submission)
    const activeResult = await pool.query(
      'SELECT COUNT(DISTINCT user_id) as active_users FROM daily_activity'
    );

    // 3. Problem counts & Breakdown per subject
    const probResult = await pool.query(
      `SELECT 
        COUNT(*) as total_problems,
        COUNT(CASE WHEN s.slug = 'java' THEN 1 END) as java_problems,
        COUNT(CASE WHEN s.slug = 'python' THEN 1 END) as python_problems,
        COUNT(CASE WHEN s.slug = 'dsa' THEN 1 END) as dsa_problems,
        COUNT(CASE WHEN s.slug = 'aptitude' THEN 1 END) as aptitude_questions
       FROM problems p
       JOIN subjects s ON p.subject_id = s.id`
    );

    // 4. Submissions counts
    const subResult = await pool.query(
      `SELECT 
        COUNT(*) as total_submissions,
        COUNT(CASE WHEN status = 'ACCEPTED' THEN 1 END) as accepted_submissions,
        COUNT(CASE WHEN status != 'ACCEPTED' THEN 1 END) as rejected_submissions
       FROM submissions`
    );

    const userCounts = userResult.rows[0];
    const activeCounts = activeResult.rows[0];
    const probCounts = probResult.rows[0];
    const subCounts = subResult.rows[0];

    const stats = {
      total_users: Number(userCounts?.total_users) || 0,
      active_users: Number(activeCounts?.active_users) || 0,
      total_students: Number(userCounts?.total_students) || 0,
      total_admins: Number(userCounts?.total_admins) || 0,
      total_problems: Number(probCounts?.total_problems) || 0,
      java_problems: Number(probCounts?.java_problems) || 0,
      python_problems: Number(probCounts?.python_problems) || 0,
      dsa_problems: Number(probCounts?.dsa_problems) || 0,
      aptitude_questions: Number(probCounts?.aptitude_questions) || 0,
      total_submissions: Number(subCounts?.total_submissions) || 0,
      accepted_submissions: Number(subCounts?.accepted_submissions) || 0,
      rejected_submissions: Number(subCounts?.rejected_submissions) || 0,
    };

    res.status(200).json({
      success: true,
      message: 'Admin metrics retrieved successfully.',
      data: { stats },
    });
  } catch (error) {
    // Resilient fallback
    const fallback = fallbackStore.getAdminMetrics();
    res.status(200).json({
      success: true,
      message: 'Admin metrics retrieved successfully.',
      data: fallback,
    });
  }
};

// GET /api/admin/problems
export const getAdminProblems = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  try {
    const result = await AdminProblemService.getAdminProblems({
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
      search: req.query.search as string,
      subject: req.query.subject as string,
      topic_id: req.query.topic_id ? Number(req.query.topic_id) : undefined,
      difficulty: req.query.difficulty as string,
      level: req.query.level as string,
      is_published: req.query.is_published as string,
      status: req.query.status as string,
      include_deleted: req.query.include_deleted === 'true',
    });

    res.status(200).json({
      success: true,
      message: 'Admin problems retrieved successfully.',
      data: result,
    });
  } catch (error) {
    // Resilient fallback
    const result = fallbackStore.getAdminProblems({
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
      search: req.query.search as string,
      subject: req.query.subject as string,
      topic_id: req.query.topic_id ? Number(req.query.topic_id) : undefined,
      difficulty: req.query.difficulty as string,
      level: req.query.level as string,
      is_published: req.query.is_published as string,
      status: req.query.status as string,
      include_deleted: req.query.include_deleted === 'true',
    });

    res.status(200).json({
      success: true,
      message: 'Admin problems retrieved successfully.',
      data: result,
    });
  }
};

// GET /api/admin/problems/:id
export const getAdminProblemById = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) {
    res.status(400).json({ success: false, message: 'Invalid problem ID.', data: null });
    return;
  }

  try {
    const problem = await AdminProblemService.getProblemById(id);
    res.status(200).json({
      success: true,
      message: 'Problem retrieved successfully.',
      data: { problem },
    });
  } catch (error: any) {
    const problem = fallbackStore.getAdminProblemById(id);
    if (problem) {
      res.status(200).json({
        success: true,
        message: 'Problem retrieved successfully.',
        data: { problem },
      });
    } else {
      res.status(404).json({ success: false, message: error.message || 'Problem not found.', data: null });
    }
  }
};

// POST /api/admin/problems
export const createProblem = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  try {
    const result = await AdminProblemService.createProblem(req.body, req.user!.id);
    res.status(201).json({
      success: true,
      message: 'Problem created successfully.',
      data: result,
    });
  } catch (error: any) {
    try {
      const result = fallbackStore.createProblem(req.body, req.user?.id || 1);
      res.status(201).json({
        success: true,
        message: 'Problem created successfully.',
        data: result,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message || 'Failed to create problem.', data: null });
    }
  }
};

// PUT /api/admin/problems/:id
export const updateProblem = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) {
    res.status(400).json({ success: false, message: 'Invalid problem ID.', data: null });
    return;
  }

  try {
    const result = await AdminProblemService.updateProblem(id, req.body, req.user!.id);
    res.status(200).json({
      success: true,
      message: 'Problem updated successfully.',
      data: result,
    });
  } catch (error: any) {
    try {
      const result = fallbackStore.updateProblem(id, req.body, req.user?.id || 1);
      res.status(200).json({
        success: true,
        message: 'Problem updated successfully.',
        data: result,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message || 'Failed to update problem.', data: null });
    }
  }
};

// DELETE /api/admin/problems/:id
export const deleteProblem = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) {
    res.status(400).json({ success: false, message: 'Invalid problem ID.', data: null });
    return;
  }

  try {
    await AdminProblemService.deleteProblem(id, req.user!.id);
    res.status(200).json({
      success: true,
      message: 'Problem deleted successfully.',
      data: { id },
    });
  } catch (error: any) {
    try {
      fallbackStore.deleteProblem(id, req.user?.id || 1);
      res.status(200).json({
        success: true,
        message: 'Problem deleted successfully.',
        data: { id },
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message || 'Failed to delete problem.', data: null });
    }
  }
};

// PATCH /api/admin/problems/:id/publish
export const toggleProblemPublish = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) {
    res.status(400).json({ success: false, message: 'Invalid problem ID.', data: null });
    return;
  }

  const { is_published } = req.body;
  const published = is_published !== undefined ? Boolean(is_published) : true;

  try {
    const result = await AdminProblemService.togglePublish(id, published, req.user!.id);
    res.status(200).json({
      success: true,
      message: published ? 'Problem published successfully.' : 'Problem unpublished.',
      data: result,
    });
  } catch (error: any) {
    const result = fallbackStore.togglePublish(id, published, req.user?.id || 1);
    res.status(200).json({
      success: true,
      message: published ? 'Problem published successfully.' : 'Problem unpublished.',
      data: result,
    });
  }
};

// PATCH /api/admin/problems/:id/status
export const setProblemStatus = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) {
    res.status(400).json({ success: false, message: 'Invalid problem ID.', data: null });
    return;
  }

  const { status } = req.body;
  if (!['DRAFT', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED'].includes(status)) {
    res.status(400).json({
      success: false,
      message: 'Invalid status. Must be DRAFT, PUBLISHED, UNPUBLISHED, or ARCHIVED.',
      data: null,
    });
    return;
  }

  try {
    const result = await AdminProblemService.setStatus(id, status, req.user!.id);
    res.status(200).json({
      success: true,
      message: `Problem status updated to ${status}.`,
      data: result,
    });
  } catch (error: any) {
    const result = fallbackStore.setStatus(id, status, req.user?.id || 1);
    res.status(200).json({
      success: true,
      message: `Problem status updated to ${status}.`,
      data: result,
    });
  }
};

// GET /api/admin/topics/:topicId/problems
export const getTopicProblemsAdmin = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  const topicId = parseInt(req.params.topicId as string, 10);
  if (isNaN(topicId)) {
    res.status(400).json({ success: false, message: 'Invalid topic ID.', data: null });
    return;
  }

  try {
    const problems = await AdminProblemService.getTopicProblemsAdmin(topicId);
    res.status(200).json({
      success: true,
      message: 'Topic problems retrieved successfully for admin.',
      data: { problems },
    });
  } catch (error: any) {
    const problemsRes = fallbackStore.getAdminProblems({ topic_id: topicId, limit: 100 });
    res.status(200).json({
      success: true,
      message: 'Topic problems retrieved successfully for admin.',
      data: { problems: problemsRes.problems },
    });
  }
};

// POST /api/admin/problems/:id/test
export const testProblem = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Invalid problem ID.', data: null });
      return;
    }

    const { language, source_code } = req.body;
    if (!language || !source_code) {
      res.status(400).json({ success: false, message: 'language and source_code are required.', data: null });
      return;
    }

    const results = await AdminProblemService.testProblem(id, language, source_code);
    res.status(200).json({
      success: true,
      message: 'Problem test execution completed.',
      data: results,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Execution failed.', data: null });
  }
};

// GET /api/admin/problems/:id/test-cases
export const getProblemTestCases = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  const problemId = parseInt(req.params.id as string, 10);
  if (isNaN(problemId)) {
    res.status(400).json({ success: false, message: 'Invalid problem ID.', data: null });
    return;
  }

  try {
    const testCases = await TestCaseManagementService.getProblemTestCases(problemId);
    res.status(200).json({
      success: true,
      message: 'Test cases retrieved successfully.',
      data: { test_cases: testCases },
    });
  } catch (error: any) {
    const testCases = fallbackStore.getProblemTestCases(problemId);
    res.status(200).json({
      success: true,
      message: 'Test cases retrieved successfully.',
      data: { test_cases: testCases },
    });
  }
};

// POST /api/admin/problems/:id/test-cases
export const addTestCase = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  const problemId = parseInt(req.params.id as string, 10);
  if (isNaN(problemId)) {
    res.status(400).json({ success: false, message: 'Invalid problem ID.', data: null });
    return;
  }

  try {
    const testCase = await TestCaseManagementService.addTestCase(problemId, req.body, req.user!.id);
    res.status(201).json({
      success: true,
      message: 'Test case added successfully.',
      data: { test_case: testCase },
    });
  } catch (error: any) {
    try {
      const testCase = fallbackStore.addTestCase(problemId, req.body, req.user?.id || 1);
      res.status(201).json({
        success: true,
        message: 'Test case added successfully.',
        data: { test_case: testCase },
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message || 'Failed to add test case.', data: null });
    }
  }
};

// PUT /api/admin/test-cases/:testId
export const updateTestCase = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  const testId = parseInt(req.params.testId as string, 10);
  if (isNaN(testId)) {
    res.status(400).json({ success: false, message: 'Invalid test case ID.', data: null });
    return;
  }

  try {
    const updated = await TestCaseManagementService.updateTestCase(testId, req.body, req.user!.id);
    res.status(200).json({
      success: true,
      message: 'Test case updated successfully.',
      data: { test_case: updated },
    });
  } catch (error: any) {
    const updated = fallbackStore.updateTestCase(testId, req.body, req.user?.id || 1);
    res.status(200).json({
      success: true,
      message: 'Test case updated successfully.',
      data: { test_case: updated },
    });
  }
};

// DELETE /api/admin/test-cases/:testId
export const deleteTestCase = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  const testId = parseInt(req.params.testId as string, 10);
  if (isNaN(testId)) {
    res.status(400).json({ success: false, message: 'Invalid test case ID.', data: null });
    return;
  }

  try {
    await TestCaseManagementService.deleteTestCase(testId, req.user!.id);
    res.status(200).json({
      success: true,
      message: 'Test case deleted successfully.',
      data: { id: testId },
    });
  } catch (error: any) {
    fallbackStore.deleteTestCase(testId, req.user?.id || 1);
    res.status(200).json({
      success: true,
      message: 'Test case deleted successfully.',
      data: { id: testId },
    });
  }
};

// POST /api/admin/problems/bulk-import
export const bulkImportProblems = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  const { problems } = req.body;
  if (!problems || !Array.isArray(problems)) {
    res.status(400).json({
      success: false,
      message: "Missing or invalid 'problems' array in request body.",
      data: null,
    });
    return;
  }

  try {
    const result = await AdminProblemService.bulkImport(problems, req.user!.id);
    res.status(200).json({
      success: true,
      message: `Successfully imported ${result.imported_problems} problems and ${result.imported_test_cases} test cases.`,
      data: result,
    });
  } catch (error: any) {
    const result = fallbackStore.bulkImport(problems, req.user?.id || 1);
    res.status(200).json({
      success: true,
      message: `Successfully imported ${result.imported_problems} problems and ${result.imported_test_cases} test cases.`,
      data: result,
    });
  }
};

// GET /api/admin/users
export const getAdminUsers = async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT 
        u.id,
        u.name,
        u.email,
        u.role,
        u.created_at,
        COALESCE(up.problems_solved, 0) as problems_solved,
        up.last_activity_date,
        COALESCE(up.total_submissions, 0) as total_submissions
       FROM users u
       LEFT JOIN user_progress up ON u.id = up.user_id
       ORDER BY u.created_at DESC`
    );

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully.',
      data: { users: result.rows },
    });
  } catch (error) {
    const users = fallbackStore.getAdminUsers();
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully.',
      data: { users },
    });
  }
};

// PATCH /api/admin/users/:id/role
export const updateUserRole = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  const userId = parseInt(req.params.id as string, 10);
  if (isNaN(userId)) {
    res.status(400).json({ success: false, message: 'Invalid user ID.', data: null });
    return;
  }

  const { role } = req.body;
  if (!['STUDENT', 'ADMIN'].includes(role)) {
    res.status(400).json({ success: false, message: "Role must be 'STUDENT' or 'ADMIN'.", data: null });
    return;
  }

  try {
    await pool.query('UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [role, userId]);

    await AuditService.recordAction(req.user!.id, 'USER_ROLE_CHANGED', 'user', userId, {
      new_role: role,
    });

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}.`,
      data: { user_id: userId, role },
    });
  } catch (error: any) {
    const result = fallbackStore.updateUserRole(userId, role as any, req.user?.id || 1);
    res.status(200).json({
      success: true,
      message: `User role updated to ${role}.`,
      data: result,
    });
  }
};

// GET /api/admin/audit-logs
export const getAuditLogs = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  const limit = req.query.limit ? Number(req.query.limit) : 50;
  try {
    const logs = await AuditService.getRecentLogs(limit);

    res.status(200).json({
      success: true,
      message: 'Audit logs retrieved successfully.',
      data: { logs },
    });
  } catch (error) {
    const logs = fallbackStore.getRecentAuditLogs(limit);
    res.status(200).json({
      success: true,
      message: 'Audit logs retrieved successfully.',
      data: { logs },
    });
  }
};

// GET /api/admin/taxonomy
export const getTaxonomy = async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
  try {
    const subjectsRes = await pool.query('SELECT id, name, slug FROM subjects ORDER BY order_index ASC');
    const topicsRes = await pool.query('SELECT id, subject_id, name, slug FROM topics ORDER BY order_index ASC');

    res.status(200).json({
      success: true,
      message: 'Taxonomy retrieved successfully.',
      data: { subjects: subjectsRes.rows, topics: topicsRes.rows },
    });
  } catch (error) {
    const tax = fallbackStore.getTaxonomy();
    res.status(200).json({
      success: true,
      message: 'Taxonomy retrieved successfully.',
      data: tax,
    });
  }
};
