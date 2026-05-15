/**
 * ArcLock Backend — Application Constants
 */

export const CONSTANTS = {
  // Biometric verification
  SIMILARITY_THRESHOLD: parseFloat(process.env.SIMILARITY_THRESHOLD || '0.6'),
  EMBEDDING_DIMENSION: 512,

  // Token expiry
  ACCESS_TOKEN_EXPIRY: process.env.JWT_EXPIRY || '15m',
  REFRESH_TOKEN_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',

  // Rate limiting
  MAX_FAILED_ATTEMPTS: 5,
  LOCKOUT_DURATION_MS: 15 * 60 * 1000, // 15 minutes

  // Image constraints
  MAX_IMAGE_SIZE_MB: 10,
  MAX_IMAGE_SIZE_BYTES: 10 * 1024 * 1024,

  // Security
  BCRYPT_SALT_ROUNDS: 12,

  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;
