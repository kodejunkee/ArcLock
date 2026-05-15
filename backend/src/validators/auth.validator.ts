/**
 * ArcLock Backend — Auth Validators
 * Zod schemas for auth endpoint request validation.
 */

import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must not exceed 100 characters')
      .trim(),
    email: z
      .string()
      .email('Invalid email address')
      .toLowerCase()
      .trim(),
    imageBase64: z
      .string()
      .min(100, 'Image data is required')
      .max(15_000_000, 'Image data too large'),
  }),
});

export const verifyFaceSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email('Invalid email address')
      .toLowerCase()
      .trim(),
    imageBase64: z
      .string()
      .min(100, 'Image data is required')
      .max(15_000_000, 'Image data too large'),
    device: z.string().optional(),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z
      .string()
      .min(1, 'Refresh token is required'),
  }),
});
