/**
 * ArcLock Backend — Input Sanitization Middleware
 * Strips potentially dangerous characters from request inputs.
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Recursively sanitize string values in an object.
 * Strips HTML tags and potential script injections.
 */
function sanitizeValue(value: unknown): unknown {
  if (typeof value === 'string') {
    // Don't sanitize base64 image data
    if (value.length > 1000 && /^[A-Za-z0-9+/=\s,;:]+$/.test(value.substring(0, 100))) {
      return value;
    }
    // Strip HTML tags
    return value.replace(/<[^>]*>/g, '').trim();
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      sanitized[key] = sanitizeValue(val);
    }
    return sanitized;
  }

  return value;
}

export const sanitizer = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.query) {
    req.query = sanitizeValue(req.query) as any;
  }
  if (req.params) {
    req.params = sanitizeValue(req.params) as any;
  }
  next();
};
