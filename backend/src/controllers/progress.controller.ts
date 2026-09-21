import { Request, Response, NextFunction } from 'express';
import { ProgressService } from '../services/progress/progress.service';
import { DailyPracticeService } from '../services/progress/dailyPractice.service';
import { AchievementService } from '../services/progress/achievement.service';

// GET /api/user/dashboard (and /api/user/progress)
export const getUserDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: Authentication required.',
        data: null,
      });
      return;
    }

    const dashboard = await ProgressService.getUserDashboard(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Dashboard data retrieved successfully.',
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/user/activity-heatmap
export const getActivityHeatmap = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: Authentication required.',
        data: null,
      });
      return;
    }

    const heatmap = await ProgressService.getActivityHeatmap(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Activity heatmap retrieved successfully.',
      data: heatmap,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/daily-practice
export const getDailyPractice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id || 0;
    const practice = await DailyPracticeService.getTodayPractice(userId);

    res.status(200).json({
      success: true,
      message: "Today's practice generated successfully.",
      data: practice,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/user/achievements
export const getUserAchievements = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: Authentication required.',
        data: null,
      });
      return;
    }

    const achievements = await AchievementService.getUserAchievements(req.user.id);

    res.status(200).json({
      success: true,
      message: 'User achievements retrieved successfully.',
      data: { achievements },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/user/analytics
export const getUserAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: Authentication required.',
        data: null,
      });
      return;
    }

    const analytics = await ProgressService.getUserAnalytics(req.user.id);

    res.status(200).json({
      success: true,
      message: 'User learning analytics retrieved successfully.',
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
};
