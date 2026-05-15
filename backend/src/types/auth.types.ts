/**
 * ArcLock Backend — Auth Types
 * DTOs for authentication request/response flows.
 */

export interface RegisterRequest {
  name: string;
  email: string;
  imageBase64: string;
}

export interface LoginRequest {
  email: string;
  imageBase64: string;
}

export interface VerifyFaceRequest {
  email: string;
  imageBase64: string;
  device?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
  };
  tokens: AuthTokens;
  similarity?: number;
}

export interface TokenPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}
