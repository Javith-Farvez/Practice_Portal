import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  initiateOAuth,
  handleCallback,
  getGitHubStatus,
  getRepositories,
  getBranches,
  selectRepository,
  pushSolution,
  disconnectGitHub,
  toggleAutoPush,
  getGitHubHealth,
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

// ---- Public: GitHub configuration health check (no auth required) ----
// Useful for debugging deployment: GET /api/github/health
router.get('/health', getGitHubHealth);

// ---- OAuth Flow ----
// Initiates OAuth — requires user to be logged in (JWT auth)
// JWT is passed as ?token= query param because browser redirects can't set custom headers.
router.get('/auth', authenticateToken, initiateOAuth);

// OAuth callback — GitHub redirects here after the user approves/denies access.
// NOT protected by authenticateToken — browser arrives here from GitHub without our JWT.
// Security is enforced by the CSRF state stored in github_oauth_states table.
router.get('/callback', handleCallback);

// ---- Authenticated Endpoints (require valid portal JWT) ----
router.get('/status', authenticateToken, getGitHubStatus);
router.get('/repositories', authenticateToken, getRepositories);
router.get('/repositories/:owner/:repo/branches', authenticateToken, getBranches);
router.post('/select-repository', authenticateToken, selectRepository);
router.post('/push', authenticateToken, pushSolution);
router.post('/auto-push', authenticateToken, toggleAutoPush);
router.post('/disconnect', authenticateToken, disconnectGitHub);
router.delete('/disconnect', authenticateToken, disconnectGitHub);

export default router;
