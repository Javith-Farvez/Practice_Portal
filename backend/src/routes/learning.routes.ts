import { Router } from 'express';
import {
  getSubjects,
  getSubjectBySlug,
  getTopicById,
  getProblems,
  getProblemById,
  toggleProblemSolve,
  toggleProblemBookmark,
  getUserProgress,
} from '../controllers/learning.controller';
import { authenticateToken, optionalAuth } from '../middleware/auth.middleware';

import {
  runProblemCode,
  submitProblemCode,
  getUserSubmissions,
  getSubmissionById,
} from '../controllers/submission.controller';

import {
  getUserDashboard,
  getActivityHeatmap,
  getDailyPractice,
  getUserAchievements,
  getUserAnalytics,
} from '../controllers/progress.controller';

import {
  addBookmark,
  removeBookmark,
  getBookmarks,
} from '../controllers/bookmark.controller';


import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  removeFriend,
  getFriendDashboard,
  compareWithFriend,
  searchUsers,
} from '../controllers/friend.controller';

const router = Router();

// Subject & Topic Roadmap Routes (Optional auth to include user solved stats)
router.get('/subjects', optionalAuth, getSubjects);
router.get('/subjects/:slug', optionalAuth, getSubjectBySlug);
router.get('/topics/:id', optionalAuth, getTopicById);

// Problem Catalog & Details Routes
router.get('/problems', optionalAuth, getProblems);
router.get('/problems/:id', optionalAuth, getProblemById);

// User Progress & Problem Tracking Routes (Protected)
router.post('/problems/:id/toggle-solve', authenticateToken, toggleProblemSolve);
router.post('/problems/:id/toggle-bookmark', authenticateToken, toggleProblemBookmark);
router.get('/user/progress', authenticateToken, getUserDashboard); // Uses enhanced Phase 4 dashboard progress

// Phase 3: Code Execution & Judge Submissions
router.post('/problems/:id/run', optionalAuth, runProblemCode);
router.post('/problems/:id/submit', authenticateToken, submitProblemCode);
router.get('/submissions', authenticateToken, getUserSubmissions);
router.get('/submissions/:id', authenticateToken, getSubmissionById);

// Phase 4: Progress, Streak, Daily Practice, Bookmarks & Analytics
router.get('/user/dashboard', authenticateToken, getUserDashboard);
router.get('/user/activity-heatmap', authenticateToken, getActivityHeatmap);
router.get('/daily-practice', optionalAuth, getDailyPractice);
router.get('/user/achievements', authenticateToken, getUserAchievements);
router.get('/user/analytics', authenticateToken, getUserAnalytics);

// Phase 4: Dedicated Bookmarks
router.post('/bookmarks', authenticateToken, addBookmark);
router.delete('/bookmarks/:problemId', authenticateToken, removeBookmark);
router.delete('/bookmarks', authenticateToken, removeBookmark);
router.get('/bookmarks', authenticateToken, getBookmarks);

// Phase 6: Friends System & Comparison
router.post('/friends/request', authenticateToken, sendFriendRequest);
router.post('/friends/accept', authenticateToken, acceptFriendRequest);
router.post('/friends/reject', authenticateToken, rejectFriendRequest);
router.get('/friends', authenticateToken, getFriends);
router.delete('/friends/:friendId', authenticateToken, removeFriend);
router.delete('/friends', authenticateToken, removeFriend);
router.get('/friends/search', authenticateToken, searchUsers);
router.get('/friends/:friendId/dashboard', authenticateToken, getFriendDashboard);
router.get('/friends/:friendId/compare', authenticateToken, compareWithFriend);

export default router;
