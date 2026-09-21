import { Router } from 'express';
import {
  getAdminMetrics,
  getAdminProblems,
  getAdminProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
  toggleProblemPublish,
  setProblemStatus,
  getTopicProblemsAdmin,
  testProblem,
  getProblemTestCases,
  addTestCase,
  updateTestCase,
  deleteTestCase,
  bulkImportProblems,
  getAdminUsers,
  updateUserRole,
  getAuditLogs,
  getTaxonomy,
} from '../controllers/admin.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

// All admin routes strictly enforce authentication AND ADMIN role
router.use(authenticateToken, requireRole('ADMIN'));

// Taxonomy for admin problem management
router.get('/taxonomy', getTaxonomy);

// 1. Dashboard Metrics
router.get('/metrics', getAdminMetrics);

// 2. Problem Management CRUD
router.get('/problems', getAdminProblems);
router.post('/problems', createProblem);
router.get('/problems/:id', getAdminProblemById);
router.put('/problems/:id', updateProblem);
router.delete('/problems/:id', deleteProblem);
router.patch('/problems/:id/publish', toggleProblemPublish);
router.patch('/problems/:id/status', setProblemStatus);
router.get('/topics/:topicId/problems', getTopicProblemsAdmin);
router.post('/problems/:id/test', testProblem);

// 3. Test Cases Management
router.get('/problems/:id/test-cases', getProblemTestCases);
router.post('/problems/:id/test-cases', addTestCase);
router.put('/test-cases/:testId', updateTestCase);
router.delete('/test-cases/:testId', deleteTestCase);

// 4. Bulk Import (JSON/CSV)
router.post('/problems/bulk-import', bulkImportProblems);

// 5. User Management & Roles
router.get('/users', getAdminUsers);
router.patch('/users/:id/role', updateUserRole);

// 6. Audit Logs
router.get('/audit-logs', getAuditLogs);

export default router;
