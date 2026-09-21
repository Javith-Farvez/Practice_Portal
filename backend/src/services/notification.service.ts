import { pool } from '../config/db';

export type NotificationType =
  | 'PROBLEM_SOLVED'
  | 'ACHIEVEMENT_UNLOCKED'
  | 'STREAK_MILESTONE'
  | 'FRIEND_REQUEST'
  | 'SYSTEM';

export interface NotificationItem {
  id: number;
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export class NotificationService {
  /**
   * Creates a notification with anti-spam deduplication.
   */
  public static async createNotification(
    userId: number,
    type: NotificationType,
    title: string,
    message: string,
    link: string | null = null
  ): Promise<number | null> {
    try {
      // Deduplication check within the last 1 hour for identical title/message for this user
      const existingRes = await pool.query<any>(
        `SELECT id FROM notifications 
         WHERE user_id = $1 AND type = $2 AND title = $3 AND created_at >= NOW() - INTERVAL '1 hour' 
         LIMIT 1`,
        [userId, type, title]
      );
      const existing = existingRes.rows;

      if (existing.length > 0) {
        return existing[0].id; // Prevent spam
      }

      const res = await pool.query<any>(
        `INSERT INTO notifications (user_id, type, title, message, link, is_read)
         VALUES ($1, $2, $3, $4, $5, FALSE)
         RETURNING id`,
        [userId, type, title, message, link]
      );

      return res.rows[0].id;
    } catch (err) {
      console.error('[NotificationService] Failed to create notification:', err);
      return null;
    }
  }

  /**
   * Retrieves user notifications with unread count.
   */
  public static async getUserNotifications(
    userId: number,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ notifications: NotificationItem[]; unread_count: number; total: number }> {
    const unreadRes = await pool.query<any>(
      'SELECT COUNT(*) as unread FROM notifications WHERE user_id = $1 AND is_read = FALSE',
      [userId]
    );
    const unread_count = Number(unreadRes.rows[0]?.unread) || 0;

    const totalRes = await pool.query<any>(
      'SELECT COUNT(*) as total FROM notifications WHERE user_id = $1',
      [userId]
    );
    const total = Number(totalRes.rows[0]?.total) || 0;

    const rowsRes = await pool.query<any>(
      `SELECT id, user_id, type, title, message, link, is_read, created_at
       FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    const rows = rowsRes.rows;

    const notifications: NotificationItem[] = rows.map((r) => ({
      id: r.id,
      user_id: r.user_id,
      type: r.type as NotificationType,
      title: r.title,
      message: r.message,
      link: r.link,
      is_read: Boolean(r.is_read),
      created_at: r.created_at,
    }));

    return { notifications, unread_count, total };
  }

  /**
   * Marks a single notification as read.
   */
  public static async markAsRead(userId: number, notificationId: number): Promise<boolean> {
    const res = await pool.query<any>(
      'UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2',
      [notificationId, userId]
    );
    return (res.rowCount || 0) > 0;
  }

  /**
   * Marks all notifications as read for a user.
   */
  public static async markAllAsRead(userId: number): Promise<number> {
    const res = await pool.query<any>(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE',
      [userId]
    );
    return res.rowCount || 0;
  }
}
