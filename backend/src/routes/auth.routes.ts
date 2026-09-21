import { Router } from 'express';
import {
  register,
  login,
  getMe,
  logout,
  registerSchema,
  loginSchema,
} from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { authRateLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

// Public routes (rate limited & validated)
router.post('/register', authRateLimiter, validateBody(registerSchema), register);
router.post('/login', authRateLimiter, validateBody(loginSchema), login);
router.post('/logout', logout);

// Protected route
router.get('/me', authenticateToken, getMe);

export default router;
