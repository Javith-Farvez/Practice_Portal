import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  initiateOAuth,
  handleCallback,
  getGitHubStatus,
  getRepositories,
  selectRepository,
  pushSolution,
  disconnectGitHub,
} from '../controllers/github.controller';

const router = Router();

// Rate limiter specific to GitHub endpoints
const githubRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many GitHub requests. Please try again later.',
    data: null,
  },
});

router.use(githubRateLimiter);

// ---- OAuth Flow ----
// Initiates OAuth — requires user to be logged in (JWT auth)
router.get('/auth', authenticateToken, initiateOAuth);

// OAuth callback — GitHub redirects here; state in DB identifies the user
// NOTE: This is NOT protected by authenticateToken because the browser
// arrives here from GitHub's redirect without our JWT header.
// Security is provided by the CSRF state stored in github_oauth_states.
router.get('/callback', handleCallback);

// ---- Authenticated Endpoints ----
router.get('/status', authenticateToken, getGitHubStatus);
router.get('/repositories', authenticateToken, getRepositories);
router.post('/select-repository', authenticateToken, selectRepository);
router.post('/push', authenticateToken, pushSolution);
router.delete('/disconnect', authenticateToken, disconnectGitHub);

export default router;
