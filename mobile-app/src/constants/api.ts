/**
 * ArcLock Mobile — API Constants
 */

// Change this to your backend URL when deploying
export const API_BASE_URL = 'http://10.186.14.13:5000';

export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/api/auth/register',
  LOGIN: '/api/auth/login',
  VERIFY_FACE: '/api/auth/verify-face',
  REFRESH_TOKEN: '/api/auth/refresh-token',
  LOGOUT: '/api/auth/logout',

  // User
  PROFILE: '/api/user/profile',
  UPDATE_PROFILE: '/api/user/profile',
  DELETE_ACCOUNT: '/api/user/delete',

  // Logs
  AUTH_LOGS: '/api/logs/auth',
  FAILURE_LOGS: '/api/logs/failures',

  // Health
  HEALTH: '/health',
} as const;

export const API_TIMEOUT = 120000; // 120 seconds (first request downloads ML models)
