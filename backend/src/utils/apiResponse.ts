/**
 * ArcLock Backend — API Response Builder
 * Standardized response format for all API endpoints.
 */

import { Response } from 'express';
import { ApiResponse } from '../types/api.types';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };

  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 400,
  code?: string
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    error: message,
    code,
  };

  return res.status(statusCode).json(response);
};

export const sendCreated = <T>(
  res: Response,
  data: T,
  message: string = 'Created successfully'
): Response => {
  return sendSuccess(res, data, message, 201);
};

export const sendUnauthorized = (
  res: Response,
  message: string = 'Unauthorized'
): Response => {
  return sendError(res, message, 401, 'UNAUTHORIZED');
};

export const sendForbidden = (
  res: Response,
  message: string = 'Forbidden'
): Response => {
  return sendError(res, message, 403, 'FORBIDDEN');
};

export const sendNotFound = (
  res: Response,
  message: string = 'Resource not found'
): Response => {
  return sendError(res, message, 404, 'NOT_FOUND');
};

export const sendServerError = (
  res: Response,
  message: string = 'Internal server error'
): Response => {
  return sendError(res, message, 500, 'INTERNAL_ERROR');
};
