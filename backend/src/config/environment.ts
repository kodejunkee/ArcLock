/**
 * ArcLock Backend — Environment Configuration
 * Validates and exports typed environment variables using Zod.
 */

import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // MongoDB
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),

  // JWT
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 characters'),
  JWT_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  // AES Master Key (for encrypting ECC private keys)
  AES_MASTER_KEY: z.string().length(64, 'AES_MASTER_KEY must be 64 hex characters (32 bytes)'),

  // Python Face Service
  FACE_SERVICE_URL: z.string().url().default('http://localhost:8000'),

  // Similarity threshold
  SIMILARITY_THRESHOLD: z.string().default('0.6').transform(Number),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().default('900000').transform(Number),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100').transform(Number),
  AUTH_RATE_LIMIT_MAX_REQUESTS: z.string().default('10').transform(Number),

  // CORS
  CORS_ORIGIN: z.string().default('*'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Environment validation failed:');
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
