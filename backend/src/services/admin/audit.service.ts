import { pool } from '../../config/db';
import { fallbackStore } from '../../data/fallbackStore';

export class AuditService {
  /**
   * Record an administrative action into audit_logs
   */
  public static async recordAction(
    adminId: number,
    action: string,
    targetType: string,
    targetId: number | null,
    details?: any,
    ipAddress?: string
  ): Promise<number> {
    try {
      const detailsJson = details ? JSON.stringify(details) : null;
      const result = await pool.query<{ id: number }>(
        `INSERT INTO audit_logs (admin_id, action, target_type, target_id, details, ip_address)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [adminId, action, targetType, targetId, detailsJson, ipAddress || null]
      );

      return result.rows[0].id;
    } catch {
      // Graceful fallback to in-memory store
      return fallbackStore.recordAuditAction(adminId, action, targetType, targetId, details, ipAddress);
    }
  }

  /**
   * Retrieve recent audit logs with admin user name and email
   */
  public static async getRecentLogs(limit: number = 50) {
    const limitNum = Math.min(Math.max(1, limit), 200);
    try {
      const result = await pool.query(
        `SELECT 
          al.id,
          al.action,
          al.target_type,
          al.target_id,
          al.details,
          al.ip_address,
          al.created_at,
          u.id as admin_id,
          u.name as admin_name,
          u.email as admin_email
         FROM audit_logs al
         JOIN users u ON al.admin_id = u.id
         ORDER BY al.created_at DESC
         LIMIT $1`,
        [limitNum]
      );

      return result.rows.map((r: any) => {
        let parsedDetails = null;
        try {
          parsedDetails = typeof r.details === 'string' ? JSON.parse(r.details) : r.details;
        } catch {
          parsedDetails = r.details;
        }
        return {
          ...r,
          details: parsedDetails,
        };
      });
    } catch {
      // Fallback to in-memory audit logs
      return fallbackStore.getRecentAuditLogs(limitNum);
    }
  }
}

