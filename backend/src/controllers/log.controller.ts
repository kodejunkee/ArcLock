/**
 * ArcLock Backend — Log Controller
 * Handles auth log and failed attempt queries.
 */

import { Request, Response } from 'express';
import * as logService from '../services/log.service';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { logger } from '../utils/logger';

/**
 * GET /api/logs/auth
 * Get authentication logs for the current user.
 */
export const getAuthLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const logs = await logService.getAuthLogs(req.userId!, Math.min(limit, 100));

    sendSuccess(res, { logs }, 'Auth logs retrieved successfully');
  } catch (error: any) {
    logger.error('Get auth logs failed:', error.message);
    sendError(res, 'Failed to retrieve auth logs', 500);
  }
};

/**
 * GET /api/logs/failures
 * Get failed authentication attempts for the current user.
 */
export const getFailures = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const attempts = await logService.getFailedAttempts(req.userId!, Math.min(limit, 100));

    sendSuccess(res, { attempts }, 'Failed attempts retrieved successfully');
  } catch (error: any) {
    logger.error('Get failures failed:', error.message);
    sendError(res, 'Failed to retrieve failure logs', 500);
  }
};
