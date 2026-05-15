/**
 * ArcLock Mobile — Auth Service
 * API calls for authentication endpoints.
 */

import api from './api';
import { API_ENDPOINTS } from '../constants/api';
import { ApiResponse, AuthResponse } from '../types/auth';

export const authService = {
  async register(
    name: string,
    email: string,
    imageBase64: string
  ): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post(API_ENDPOINTS.REGISTER, {
      name,
      email,
      imageBase64,
    });
    return response.data;
  },

  async login(
    email: string,
    imageBase64: string
  ): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post(API_ENDPOINTS.LOGIN, {
      email,
      imageBase64,
    });
    return response.data;
  },

  async verifyFace(
    email: string,
    imageBase64: string
  ): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post(API_ENDPOINTS.VERIFY_FACE, {
      email,
      imageBase64,
    });
    return response.data;
  },

  async refreshToken(
    refreshToken: string
  ): Promise<ApiResponse<{ tokens: { accessToken: string; refreshToken: string } }>> {
    const response = await api.post(API_ENDPOINTS.REFRESH_TOKEN, {
      refreshToken,
    });
    return response.data;
  },

  async logout(): Promise<ApiResponse> {
    const response = await api.post(API_ENDPOINTS.LOGOUT);
    return response.data;
  },
};
