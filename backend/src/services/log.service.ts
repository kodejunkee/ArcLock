/**
 * ArcLock Backend — Log Service
 * Manages auth log and failed attempt records.
 */

import { AuthLog, IAuthLog } from '../models/AuthLog';
import { FailedAttempt, IFailedAttempt } from '../models/FailedAttempt';
import { logger } from '../utils/logger';
import { CONSTANTS } from '../utils/constants';

/**
 * Log an authentication attempt (success or failure).
 */
export async function logAuthAttempt(data: {
  userId: string;
  status: 'success' | 'failure';
  similarity: number;
  device?: string;
  ipAddress?: string;
}): Promise<IAuthLog> {
  try {
    const log = await AuthLog.create({
      userId: data.userId,
      status: data.status,
      similarity: data.similarity,
      device: data.device || 'Unknown',
      ipAddress: data.ipAddress || '',
    });

    logger.info(`Auth log: ${data.status} for user ${data.userId} (sim: ${data.similarity})`);
    return log;
  } catch (error) {
    logger.error('Failed to create auth log:', error);
    throw error;
  }
}

/**
 * Log a failed authentication attempt.
 */
export async function logFailedAttempt(data: {
  userId: string;
  reason: string;
  device?: string;
  ipAddress?: string;
}): Promise<IFailedAttempt> {
  try {
    const attempt = await FailedAttempt.create({
      userId: data.userId,
      reason: data.reason,
      device: data.device || 'Unknown',
      ipAddress: data.ipAddress || '',
    });

    logger.warn(`Failed attempt: ${data.reason} for user ${data.userId}`);
    return attempt;
  } catch (error) {
    logger.error('Failed to log failed attempt:', error);
    throw error;
  }
}

/**
 * Get recent auth logs for a user.
 */
export async function getAuthLogs(
  userId: string,
  limit: number = CONSTANTS.DEFAULT_PAGE_SIZE
): Promise<IAuthLog[]> {
  return AuthLog.find({ userId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .exec();
}

/**
 * Get recent failed attempts for a user.
 */
export async function getFailedAttempts(
  userId: string,
  limit: number = CONSTANTS.DEFAULT_PAGE_SIZE
): Promise<IFailedAttempt[]> {
  return FailedAttempt.find({ userId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .exec();
}

/**
 * Check if a user is currently locked out due to too many failed attempts.
 */
export async function isUserLockedOut(userId: string): Promise<boolean> {
  const cutoff = new Date(Date.now() - CONSTANTS.LOCKOUT_DURATION_MS);

  const recentFailures = await FailedAttempt.countDocuments({
    userId,
    timestamp: { $gte: cutoff },
  });

  return recentFailures >= CONSTANTS.MAX_FAILED_ATTEMPTS;
}

/**
 * Get all auth logs (for admin).
 */
export async function getAllAuthLogs(
  limit: number = CONSTANTS.DEFAULT_PAGE_SIZE,
  page: number = 1
): Promise<{ logs: IAuthLog[]; total: number }> {
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    AuthLog.find()
      .populate('userId', 'name email')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .exec(),
    AuthLog.countDocuments(),
  ]);

  return { logs, total };
}
