/**
 * ArcLock Mobile — Auth Types
 */

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
  similarity?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  code?: string;
}

export interface AuthLog {
  _id: string;
  userId: string;
  status: 'success' | 'failure';
  similarity: number;
  device: string;
  timestamp: string;
}

export interface FailedAttempt {
  _id: string;
  userId: string;
  reason: string;
  device: string;
  timestamp: string;
}
