import { Request, Response, NextFunction } from 'express';
import { PlacementService } from '../services/placement.service';

// GET /api/placement/generate
export const generatePlacementSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const java_count = req.query.java_count ? parseInt(req.query.java_count as string, 10) : 5;
    const dsa_count = req.query.dsa_count ? parseInt(req.query.dsa_count as string, 10) : 5;
    const aptitude_count = req.query.aptitude_count ? parseInt(req.query.aptitude_count as string, 10) : 5;
    const difficulty = req.query.difficulty as string | undefined;

    const data = await PlacementService.generatePlacementSet({
      java_count,
      dsa_count,
      aptitude_count,
      difficulty,
      userId: req.user?.id || null,
    });

    res.status(200).json({
      success: true,
      message: 'Placement practice session generated successfully.',
      data,
    });
  } catch (error) {
    next(error);
  }
};
