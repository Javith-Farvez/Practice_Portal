import { Request, Response, NextFunction } from 'express';
import { FriendService } from '../services/friends/friend.service';

// POST /api/friends/request
export const sendFriendRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized', data: null });
      return;
    }

    const { receiver_id, receiver_email, email } = req.body;
    const target = receiver_id || receiver_email || email;

    if (!target) {
      res.status(400).json({
        success: false,
        message: 'Please provide receiver_id or receiver_email.',
        data: null,
      });
      return;
    }

    const result = await FriendService.sendFriendRequest(req.user.id, target);

    res.status(200).json({
      success: true,
      message: result.status === 'ACCEPTED' ? 'Friend request automatically accepted!' : 'Friend request sent successfully.',
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to send friend request.',
      data: null,
    });
  }
};

// POST /api/friends/accept
export const acceptFriendRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized', data: null });
      return;
    }

    const { request_id, friend_id } = req.body;
    const identifier = request_id || friend_id;

    if (!identifier) {
      res.status(400).json({
        success: false,
        message: 'Please provide request_id or friend_id to accept.',
        data: null,
      });
      return;
    }

    const result = await FriendService.acceptFriendRequest(req.user.id, Number(identifier));

    res.status(200).json({
      success: true,
      message: 'Friend request accepted!',
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to accept friend request.',
      data: null,
    });
  }
};

// POST /api/friends/reject
export const rejectFriendRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized', data: null });
      return;
    }

    const { request_id, friend_id } = req.body;
    const identifier = request_id || friend_id;

    if (!identifier) {
      res.status(400).json({
        success: false,
        message: 'Please provide request_id or friend_id to reject.',
        data: null,
      });
      return;
    }

    const result = await FriendService.rejectFriendRequest(req.user.id, Number(identifier));

    res.status(200).json({
      success: true,
      message: 'Friend request declined.',
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to reject friend request.',
      data: null,
    });
  }
};

// GET /api/friends
export const getFriends = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized', data: null });
      return;
    }

    const overview = await FriendService.getFriendsOverview(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Friends overview retrieved successfully.',
      data: overview,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/friends/:friendId or DELETE /api/friends
export const removeFriend = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized', data: null });
      return;
    }

    const rawId = req.params.friendId || req.body?.friend_id || req.body?.request_id || req.query?.friend_id;
    const targetId = parseInt(rawId as string, 10);

    if (isNaN(targetId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid friend identifier provided.',
        data: null,
      });
      return;
    }

    const removed = await FriendService.removeFriend(req.user.id, targetId);

    res.status(200).json({
      success: true,
      message: removed ? 'Friend or request removed successfully.' : 'No active friendship found to remove.',
      data: { removed },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/friends/:friendId/dashboard
export const getFriendDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized', data: null });
      return;
    }

    const friendId = parseInt(req.params.friendId as string, 10);
    if (isNaN(friendId)) {
      res.status(400).json({ success: false, message: 'Invalid friend ID.', data: null });
      return;
    }

    const dashboard = await FriendService.getFriendDashboard(req.user.id, friendId);

    res.status(200).json({
      success: true,
      message: 'Friend dashboard retrieved successfully.',
      data: dashboard,
    });
  } catch (error: any) {
    if (error.statusCode === 403) {
      res.status(403).json({
        success: false,
        message: error.message || 'Access denied: You can only view statistics of accepted friends.',
        data: null,
      });
      return;
    }
    next(error);
  }
};

// GET /api/friends/:friendId/compare
export const compareWithFriend = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized', data: null });
      return;
    }

    const friendId = parseInt(req.params.friendId as string, 10);
    if (isNaN(friendId)) {
      res.status(400).json({ success: false, message: 'Invalid friend ID.', data: null });
      return;
    }

    const comparison = await FriendService.compareWithFriend(req.user.id, friendId);

    res.status(200).json({
      success: true,
      message: 'Friend comparison retrieved successfully.',
      data: comparison,
    });
  } catch (error: any) {
    if (error.statusCode === 403) {
      res.status(403).json({
        success: false,
        message: error.message || 'Access denied: You can only compare statistics with accepted friends.',
        data: null,
      });
      return;
    }
    next(error);
  }
};

// GET /api/friends/search?q=...
export const searchUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized', data: null });
      return;
    }

    const query = String(req.query.q || '').trim();
    const users = await FriendService.searchUsers(req.user.id, query);

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully.',
      data: { users },
    });
  } catch (error) {
    next(error);
  }
};
