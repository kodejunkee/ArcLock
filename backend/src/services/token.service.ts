/**
 * ArcLock Backend — JWT Token Service
 * Manages access and refresh token generation and verification.
 */

import jwt from 'jsonwebtoken';
import { env } from '../config/environment';
import { TokenPayload, AuthTokens } from '../types/auth.types';
import { logger } from '../utils/logger';

/**
 * Generate an access + refresh token pair for a user.
 */
export function generateTokens(userId: string, email: string): AuthTokens {
  const payload: TokenPayload = { userId, email };

  const accessToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRY,
  } as jwt.SignOptions);

  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRY,
  } as jwt.SignOptions);

  return { accessToken, refreshToken };
}

/**
 * Verify an access token and return the decoded payload.
 */
export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    logger.debug('Access token verification failed');
    return null;
  }
}

/**
 * Verify a refresh token and return the decoded payload.
 */
export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    logger.debug('Refresh token verification failed');
    return null;
  }
}
