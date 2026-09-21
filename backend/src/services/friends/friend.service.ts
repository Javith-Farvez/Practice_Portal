import { pool } from '../../config/db';
import { ProgressService } from '../progress/progress.service';

export interface FriendProfile {
  id: number;
  friendship_id: number;
  name: string;
  email: string;
  avatar?: string;
  problems_solved: number;
  current_streak: number;
  longest_streak: number;
  accuracy: number;
  since: string;
}

export interface FriendRequestItem {
  id: number;
  user_id: number;
  name: string;
  email: string;
  created_at: string;
}

export class FriendService {
  /**
   * Send a friend request by receiver user_id or email
   */
  public static async sendFriendRequest(
    requesterId: number,
    target: string | number
  ): Promise<{ friendship_id: number; status: string }> {
    let receiverId: number;

    if (typeof target === 'number' || !isNaN(Number(target))) {
      receiverId = Number(target);
    } else {
      const userRes = await pool.query<any>(
        'SELECT id FROM users WHERE email = $1 LIMIT 1',
        [String(target).trim().toLowerCase()]
      );
      const userRows = userRes.rows;
      if (userRows.length === 0) {
        throw new Error('User with this email not found.');
      }
      receiverId = userRows[0].id;
    }

    if (requesterId === receiverId) {
      throw new Error('You cannot send a friend request to yourself.');
    }

    // Verify receiver exists
    const recvRes = await pool.query<any>(
      'SELECT id, name, email FROM users WHERE id = $1 LIMIT 1',
      [receiverId]
    );
    const recvRows = recvRes.rows;
    if (recvRows.length === 0) {
      throw new Error('User not found.');
    }

    // Check existing friendship/request in either direction
    const existRes = await pool.query<any>(
      `SELECT id, requester_id, receiver_id, status 
       FROM friends 
       WHERE (requester_id = $1 AND receiver_id = $2) 
          OR (requester_id = $3 AND receiver_id = $4)
       LIMIT 1`,
      [requesterId, receiverId, receiverId, requesterId]
    );
    const existingRows = existRes.rows;

    if (existingRows.length > 0) {
      const existing = existingRows[0];
      if (existing.status === 'ACCEPTED') {
        throw new Error('You are already friends with this user.');
      }
      if (existing.status === 'PENDING') {
        if (existing.requester_id === requesterId) {
          throw new Error('A friend request has already been sent and is pending.');
        } else {
          // If the other user already sent a pending request to this user, automatically accept it!
          await pool.query('UPDATE friends SET status = $1 WHERE id = $2', ['ACCEPTED', existing.id]);
          return { friendship_id: existing.id, status: 'ACCEPTED' };
        }
      }
      // If previous was REJECTED, reset to PENDING
      await pool.query(
        'UPDATE friends SET requester_id = $1, receiver_id = $2, status = $3, updated_at = NOW() WHERE id = $4',
        [requesterId, receiverId, 'PENDING', existing.id]
      );
      return { friendship_id: existing.id, status: 'PENDING' };
    }

    // Insert new pending friend request
    const insertRes = await pool.query<any>(
      'INSERT INTO friends (requester_id, receiver_id, status) VALUES ($1, $2, $3) RETURNING id',
      [requesterId, receiverId, 'PENDING']
    );

    // Phase 8: Emit notification to receiver
    try {
      const reqUser = await pool.query<any>('SELECT name FROM users WHERE id = $1', [requesterId]);
      const reqName = reqUser.rows[0]?.name || 'A student';
      const { NotificationService } = await import('../notification.service');
      await NotificationService.createNotification(
        receiverId,
        'FRIEND_REQUEST',
        'New Friend Request',
        `${reqName} sent you a friend request.`,
        '/friends'
      );
    } catch {}

    return { friendship_id: insertRes.rows[0].id, status: 'PENDING' };
  }

  /**
   * Accept an incoming friend request
   */
  public static async acceptFriendRequest(
    userId: number,
    identifier: number
  ): Promise<{ friendship_id: number; status: string }> {
    // identifier can be request row ID or requester's user ID
    const res = await pool.query<any>(
      `SELECT id, requester_id, receiver_id, status 
       FROM friends 
       WHERE (id = $1 OR requester_id = $2) 
         AND receiver_id = $3 
         AND status = 'PENDING'
       LIMIT 1`,
      [identifier, identifier, userId]
    );
    const rows = res.rows;

    if (rows.length === 0) {
      throw new Error('Friend request not found or already processed.');
    }

    const friendshipId = rows[0].id;
    await pool.query('UPDATE friends SET status = $1 WHERE id = $2', ['ACCEPTED', friendshipId]);

    return { friendship_id: friendshipId, status: 'ACCEPTED' };
  }

  /**
   * Reject an incoming friend request
   */
  public static async rejectFriendRequest(
    userId: number,
    identifier: number
  ): Promise<{ friendship_id: number; status: string }> {
    const res = await pool.query<any>(
      `SELECT id, requester_id, receiver_id, status 
       FROM friends 
       WHERE (id = $1 OR requester_id = $2) 
         AND receiver_id = $3 
         AND status = 'PENDING'
       LIMIT 1`,
      [identifier, identifier, userId]
    );
    const rows = res.rows;

    if (rows.length === 0) {
      throw new Error('Friend request not found or already processed.');
    }

    const friendshipId = rows[0].id;
    await pool.query('UPDATE friends SET status = $1 WHERE id = $2', ['REJECTED', friendshipId]);

    return { friendship_id: friendshipId, status: 'REJECTED' };
  }

  /**
   * Remove / unfriend or cancel a request
   */
  public static async removeFriend(userId: number, targetId: number): Promise<boolean> {
    const res = await pool.query<any>(
      `DELETE FROM friends 
       WHERE id = $1 
          OR ((requester_id = $2 AND receiver_id = $3) OR (requester_id = $4 AND receiver_id = $5))`,
      [targetId, userId, targetId, targetId, userId]
    );

    return (res.rowCount || 0) > 0;
  }

  /**
   * Retrieve friends list, incoming pending requests, and outgoing sent requests
   */
  public static async getFriendsOverview(userId: number): Promise<{
    friends: FriendProfile[];
    pending_incoming: FriendRequestItem[];
    pending_outgoing: FriendRequestItem[];
  }> {
    // 1. Accepted Friends
    const friendRes = await pool.query<any>(
      `SELECT 
        f.id as friendship_id,
        f.created_at as friendship_date,
        u.id as user_id,
        u.name,
        u.email,
        COALESCE(up.problems_solved, 0) as problems_solved,
        COALESCE(up.current_streak, 0) as current_streak,
        COALESCE(up.longest_streak, 0) as longest_streak,
        COALESCE(up.accuracy, 0) as accuracy
       FROM friends f
       JOIN users u ON (u.id = CASE WHEN f.requester_id = $1 THEN f.receiver_id ELSE f.requester_id END)
       LEFT JOIN user_progress up ON up.user_id = u.id
       WHERE (f.requester_id = $2 OR f.receiver_id = $3) AND f.status = 'ACCEPTED'
       ORDER BY up.problems_solved DESC, u.name ASC`,
      [userId, userId, userId]
    );
    const friendRows = friendRes.rows;

    const friends: FriendProfile[] = friendRows.map((r) => ({
      id: r.user_id,
      friendship_id: r.friendship_id,
      name: r.name,
      email: r.email,
      problems_solved: Number(r.problems_solved) || 0,
      current_streak: Number(r.current_streak) || 0,
      longest_streak: Number(r.longest_streak) || 0,
      accuracy: Number(r.accuracy) || 0,
      since: r.friendship_date,
    }));

    // 2. Incoming Requests (others sent to user)
    const inRes = await pool.query<any>(
      `SELECT f.id, u.id as user_id, u.name, u.email, f.created_at
       FROM friends f
       JOIN users u ON f.requester_id = u.id
       WHERE f.receiver_id = $1 AND f.status = 'PENDING'
       ORDER BY f.created_at DESC`,
      [userId]
    );
    const inRows = inRes.rows;

    const pendingIncoming: FriendRequestItem[] = inRows.map((r) => ({
      id: r.id,
      user_id: r.user_id,
      name: r.name,
      email: r.email,
      created_at: r.created_at,
    }));

    // 3. Outgoing Requests (user sent to others)
    const outRes = await pool.query<any>(
      `SELECT f.id, u.id as user_id, u.name, u.email, f.created_at
       FROM friends f
       JOIN users u ON f.receiver_id = u.id
       WHERE f.requester_id = $1 AND f.status = 'PENDING'
       ORDER BY f.created_at DESC`,
      [userId]
    );
    const outRows = outRes.rows;

    const pendingOutgoing: FriendRequestItem[] = outRows.map((r: any) => ({
      id: r.id,
      user_id: r.user_id,
      name: r.name,
      email: r.email,
      created_at: r.created_at,
    }));

    return {
      friends,
      pending_incoming: pendingIncoming,
      pending_outgoing: pendingOutgoing,
    };
  }

  /**
   * Retrieve Friend's Dashboard. Strictly verifies privacy:
   * Only allowed if friendship status is ACCEPTED!
   */
  public static async getFriendDashboard(userId: number, friendId: number) {
    if (userId === friendId) {
      return await ProgressService.getUserDashboard(userId);
    }

    // Verify ACCEPTED friendship
    const checkRes = await pool.query<any>(
      `SELECT id, status FROM friends 
       WHERE ((requester_id = $1 AND receiver_id = $2) OR (requester_id = $3 AND receiver_id = $4))
         AND status = 'ACCEPTED'
       LIMIT 1`,
      [userId, friendId, friendId, userId]
    );

    if (checkRes.rows.length === 0) {
      const err: any = new Error('Access denied: You can only view statistics of accepted friends.');
      err.statusCode = 403;
      throw err;
    }

    // Retrieve friend profile and dashboard
    const userRes = await pool.query<any>(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1 LIMIT 1',
      [friendId]
    );
    if (userRes.rows.length === 0) {
      throw new Error('Friend user not found.');
    }

    const dashboard = await ProgressService.getUserDashboard(friendId);
    return {
      user: userRes.rows[0],
      ...dashboard,
    };
  }

  /**
   * Compare "You" vs "Friend" side-by-side using factual metrics
   */
  public static async compareWithFriend(userId: number, friendId: number) {
    // Privacy verification
    if (userId !== friendId) {
      const checkRes = await pool.query<any>(
        `SELECT id, status FROM friends 
         WHERE ((requester_id = $1 AND receiver_id = $2) OR (requester_id = $3 AND receiver_id = $4))
           AND status = 'ACCEPTED'
         LIMIT 1`,
        [userId, friendId, friendId, userId]
      );

      if (checkRes.rows.length === 0) {
        const err: any = new Error('Access denied: You can only compare statistics with accepted friends.');
        err.statusCode = 403;
        throw err;
      }
    }

    const userRes = await pool.query<any>(
      'SELECT id, name, email FROM users WHERE id IN ($1, $2)',
      [userId, friendId]
    );
    const userRows = userRes.rows;
    const youUser = userRows.find((u: any) => u.id === userId) || { id: userId, name: 'You', email: '' };
    const friendUser = userRows.find((u: any) => u.id === friendId) || { id: friendId, name: 'Friend', email: '' };

    const youDash = await ProgressService.getUserDashboard(userId);
    const friendDash = await ProgressService.getUserDashboard(friendId);

    // Subject breakdown side-by-side
    const subjects = youDash.subjects.map((s) => {
      const friendSub = friendDash.subjects.find((fs) => fs.slug === s.slug) || { solved: 0, percentage: 0 };
      return {
        name: s.name,
        slug: s.slug,
        total_problems: s.total,
        you_solved: s.solved,
        you_percentage: s.percentage,
        friend_solved: friendSub.solved,
        friend_percentage: friendSub.percentage,
      };
    });

    return {
      you: {
        id: youUser.id,
        name: youUser.name,
        email: youUser.email,
        problems_solved: youDash.problems_solved,
        problems_attempted: youDash.problems_attempted,
        accuracy: youDash.accuracy,
        current_streak: youDash.current_streak,
        longest_streak: youDash.longest_streak,
        total_active_days: youDash.total_active_days,
        overall_progress_percentage: youDash.overall_progress_percentage,
      },
      friend: {
        id: friendUser.id,
        name: friendUser.name,
        email: friendUser.email,
        problems_solved: friendDash.problems_solved,
        problems_attempted: friendDash.problems_attempted,
        accuracy: friendDash.accuracy,
        current_streak: friendDash.current_streak,
        longest_streak: friendDash.longest_streak,
        total_active_days: friendDash.total_active_days,
        overall_progress_percentage: friendDash.overall_progress_percentage,
      },
      subjects,
    };
  }

  /**
   * Search users to add as friends with current relationship status
   */
  public static async searchUsers(userId: number, query: string) {
    const trimmed = String(query).trim();
    if (!trimmed || trimmed.length < 2) {
      return [];
    }

    const searchTerm = `%${trimmed}%`;
    const userRes = await pool.query<any>(
      `SELECT u.id, u.name, u.email,
              COALESCE(up.problems_solved, 0) as problems_solved,
              COALESCE(up.current_streak, 0) as current_streak
       FROM users u
       LEFT JOIN user_progress up ON u.id = up.user_id
       WHERE (u.name ILIKE $1 OR u.email ILIKE $2) AND u.id != $3
       ORDER BY up.problems_solved DESC
       LIMIT 10`,
      [searchTerm, searchTerm, userId]
    );
    const users = userRes.rows;

    if (users.length === 0) {
      return [];
    }

    const userIds = users.map((u: any) => u.id);
    const friendRes = await pool.query<any>(
      `SELECT id, requester_id, receiver_id, status
       FROM friends
       WHERE (requester_id = $1 AND receiver_id = ANY($2::int[]))
          OR (receiver_id = $1 AND requester_id = ANY($2::int[]))`,
      [userId, userIds]
    );
    const friendships = friendRes.rows;

    return users.map((u: any) => {
      const match = friendships.find(
        (f: any) =>
          (f.requester_id === userId && f.receiver_id === u.id) ||
          (f.receiver_id === userId && f.requester_id === u.id)
      );

      let relationship = 'NONE';
      let friendshipId = null;

      if (match) {
        friendshipId = match.id;
        if (match.status === 'ACCEPTED') {
          relationship = 'ACCEPTED';
        } else if (match.status === 'PENDING') {
          relationship = match.requester_id === userId ? 'PENDING_SENT' : 'PENDING_RECEIVED';
        } else if (match.status === 'REJECTED') {
          relationship = 'REJECTED';
        }
      }

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        problems_solved: Number(u.problems_solved) || 0,
        current_streak: Number(u.current_streak) || 0,
        relationship,
        friendship_id: friendshipId,
      };
    });
  }
}
