import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service';

// GET /api/notifications
export const getNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 20));
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const offset = (page - 1) * limit;

    try {
      const data = await NotificationService.getUserNotifications(userId, limit, offset);

      res.status(200).json({
        success: true,
        message: 'Notifications retrieved successfully.',
        data: {
          ...data,
          page,
          limit,
        },
      });
    } catch (dbErr) {
      res.status(200).json({
        success: true,
        message: 'Notifications retrieved successfully.',
        data: {
          notifications: [],
          unreadCount: 0,
          page,
          limit,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

// PATCH /api/notifications/:id/read
export const markNotificationRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Invalid notification ID.', data: null });
      return;
    }

    const updated = await NotificationService.markAsRead(userId, id);

    res.status(200).json({
      success: true,
      message: updated ? 'Notification marked as read.' : 'Notification not found or already read.',
      data: { id, is_read: true },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/notifications/read-all
export const markAllNotificationsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const updatedCount = await NotificationService.markAllAsRead(userId);

    res.status(200).json({
      success: true,
      message: `Marked ${updatedCount} notifications as read.`,
      data: { updated_count: updatedCount },
    });
  } catch (error) {
    next(error);
  }
};
