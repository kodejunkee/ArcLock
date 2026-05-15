/**
 * ArcLock Backend — Auth Controller
 * Handles authentication endpoints.
 */

import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { verifyRefreshToken, generateTokens } from '../services/token.service';
import { sendSuccess, sendCreated, sendError, sendUnauthorized } from '../utils/apiResponse';
import { logger } from '../utils/logger';

/**
 * POST /api/auth/register
 * Register a new user with facial biometrics.
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, imageBase64 } = req.body;
    const device = req.headers['x-device-info'] as string || 'Unknown';
    const ipAddress = req.ip || '';

    const result = await authService.register(name, email, imageBase64, device, ipAddress);

    sendCreated(res, result, 'Registration successful');
  } catch (error: any) {
    logger.error('Registration failed:', error.message);

    if (error.message.includes('already registered') || error.message.includes('already exists')) {
      sendError(res, error.message, 409, 'USER_EXISTS');
      return;
    }

    sendError(res, error.message, 400, 'REGISTRATION_FAILED');
  }
};

/**
 * POST /api/auth/verify-face
 * Verify a user's face for login.
 */
export const verifyFace = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, imageBase64, device: bodyDevice } = req.body;
    const device = bodyDevice || (req.headers['x-device-info'] as string) || 'Unknown';
    const ipAddress = req.ip || '';

    const result = await authService.verifyFace(email, imageBase64, device, ipAddress);

    sendSuccess(res, result, 'Face verification successful');
  } catch (error: any) {
    logger.error('Face verification failed:', error.message);

    if (error.message.includes('No account found')) {
      sendError(res, error.message, 404, 'USER_NOT_FOUND');
      return;
    }

    if (error.message.includes('locked')) {
      sendError(res, error.message, 429, 'ACCOUNT_LOCKED');
      return;
    }

    if (error.message.includes('verification failed')) {
      sendError(res, error.message, 401, 'VERIFICATION_FAILED');
      return;
    }

    sendError(res, error.message, 400, 'FACE_ERROR');
  }
};

/**
 * POST /api/auth/login
 * Alias for verify-face (same flow).
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  return verifyFace(req, res);
};

/**
 * POST /api/auth/refresh-token
 * Refresh an expired access token.
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken: token } = req.body;

    const payload = verifyRefreshToken(token);
    if (!payload) {
      sendUnauthorized(res, 'Invalid or expired refresh token');
      return;
    }

    const newTokens = generateTokens(payload.userId, payload.email);

    sendSuccess(res, { tokens: newTokens }, 'Token refreshed successfully');
  } catch (error: any) {
    logger.error('Token refresh failed:', error.message);
    sendUnauthorized(res, 'Token refresh failed');
  }
};

/**
 * POST /api/auth/logout
 * Client-side logout (invalidate tokens on client).
 */
export const logout = async (_req: Request, res: Response): Promise<void> => {
  // In a stateless JWT system, logout is handled client-side
  // by removing tokens from secure storage.
  sendSuccess(res, null, 'Logged out successfully');
};
