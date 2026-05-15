/**
 * ArcLock Backend — Auth Middleware
 * JWT authentication guard for protected routes.
 */

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../services/token.service';
import { sendUnauthorized } from '../utils/apiResponse';

// Extend Express Request to include user info
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
    }
  }
}

/**
 * Middleware that requires a valid JWT access token.
 * Extracts user info and attaches it to the request.
 */
export const authGuard = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendUnauthorized(res, 'Access token is required');
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    sendUnauthorized(res, 'Invalid authorization header');
    return;
  }

  const payload = verifyAccessToken(token);

  if (!payload) {
    sendUnauthorized(res, 'Invalid or expired access token');
    return;
  }

  // Attach user info to request
  req.userId = payload.userId;
  req.userEmail = payload.email;

  next();
};
