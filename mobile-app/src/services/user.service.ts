/**
 * ArcLock Mobile — User Service
 * API calls for user profile and log endpoints.
 */

import api from './api';
import { API_ENDPOINTS } from '../constants/api';
import { ApiResponse, AuthLog, FailedAttempt } from '../types/auth';

export const userService = {
  async getProfile(): Promise<ApiResponse> {
    const response = await api.get(API_ENDPOINTS.PROFILE);
    return response.data;
  },

  async updateProfile(name: string): Promise<ApiResponse> {
    const response = await api.put(API_ENDPOINTS.UPDATE_PROFILE, { name });
    return response.data;
  },

  async deleteAccount(): Promise<ApiResponse> {
    const response = await api.delete(API_ENDPOINTS.DELETE_ACCOUNT);
    return response.data;
  },

  async getAuthLogs(limit: number = 20): Promise<ApiResponse<{ logs: AuthLog[] }>> {
    const response = await api.get(`${API_ENDPOINTS.AUTH_LOGS}?limit=${limit}`);
    return response.data;
  },

  async getFailures(limit: number = 20): Promise<ApiResponse<{ attempts: FailedAttempt[] }>> {
    const response = await api.get(`${API_ENDPOINTS.FAILURE_LOGS}?limit=${limit}`);
    return response.data;
  },
};
