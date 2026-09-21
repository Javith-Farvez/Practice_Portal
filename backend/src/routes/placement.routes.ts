import { Router } from 'express';
import { generatePlacementSession } from '../controllers/placement.controller';
import { optionalAuth } from '../middleware/auth.middleware';

const router = Router();

// Allows logged-in or guest practice set generation
router.get('/generate', optionalAuth, generatePlacementSession);

export default router;
