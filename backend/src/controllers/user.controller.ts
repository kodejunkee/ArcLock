/**
 * ArcLock Backend — User Controller
 * Handles user profile operations.
 */

import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { sendSuccess, sendError, sendNotFound } from '../utils/apiResponse';
import { logger } from '../utils/logger';

/**
 * GET /api/user/profile
 * Get the authenticated user's profile.
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.findById(req.userId!);

    if (!user) {
      sendNotFound(res, 'User not found');
      return;
    }

    sendSuccess(res, {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      securityStatus: 'active',
    }, 'Profile retrieved successfully');
  } catch (error: any) {
    logger.error('Get profile failed:', error.message);
    sendError(res, 'Failed to retrieve profile', 500);
  }
};

/**
 * PUT /api/user/profile
 * Update the authenticated user's profile.
 */
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;

    const user = await userService.updateProfile(req.userId!, { name });

    if (!user) {
      sendNotFound(res, 'User not found');
      return;
    }

    sendSuccess(res, {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    }, 'Profile updated successfully');
  } catch (error: any) {
    logger.error('Update profile failed:', error.message);
    sendError(res, 'Failed to update profile', 500);
  }
};

/**
 * DELETE /api/user/delete
 * Delete the authenticated user's account and all data.
 */
export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await userService.deleteUser(req.userId!);

    if (!deleted) {
      sendNotFound(res, 'User not found');
      return;
    }

    sendSuccess(res, null, 'Account deleted successfully');
  } catch (error: any) {
    logger.error('Delete account failed:', error.message);
    sendError(res, 'Failed to delete account', 500);
  }
};
