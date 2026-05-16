/**
 * ArcLock Backend — Face Service Client
 * Communicates with the Python FastAPI face processing microservice.
 */

import axios, { AxiosInstance } from 'axios';
import { env } from '../config/environment';
import { FaceServiceResponse } from '../types/embedding.types';
import { logger } from '../utils/logger';

// Create dedicated Axios instance for the face service
const faceClient: AxiosInstance = axios.create({
  baseURL: env.FACE_SERVICE_URL,
  timeout: 120000, // 120 second timeout (first request downloads detector model)
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Send an image to the Python face service and get back a facial embedding.
 *
 * @param imageBase64 - Base64-encoded face image
 * @returns Face service response with embedding or error
 */
export async function generateEmbedding(
  imageBase64: string
): Promise<FaceServiceResponse> {
  try {
    logger.info('Sending image to face processing service...');

    const response = await faceClient.post<FaceServiceResponse>(
      '/generate-embedding',
      { image: imageBase64 }
    );

    if (response.data.success && response.data.embedding) {
      logger.info(
        `Embedding received (dim=${response.data.dimension}, ` +
        `confidence=${response.data.detection?.confidence?.toFixed(3)})`
      );
    }

    return response.data;
  } catch (error: any) {
    // Handle structured error responses from the face service
    if (error.response?.data) {
      const errorData = error.response.data;
      logger.warn(`Face service returned error: ${errorData.error} (${errorData.code})`);
      return {
        success: false,
        error: errorData.error || 'Face processing failed',
        code: errorData.code || 'FACE_SERVICE_ERROR',
      };
    }

    // Handle network/connection errors
    if (error.code === 'ECONNREFUSED') {
      logger.error('Face service is not running or unreachable');
      return {
        success: false,
        error: 'Face processing service is unavailable. Please try again later.',
        code: 'FACE_SERVICE_UNAVAILABLE',
      };
    }

    logger.error('Face service communication error:', error.message);
    return {
      success: false,
      error: 'Failed to process facial data',
      code: 'FACE_SERVICE_ERROR',
    };
  }
}

/**
 * Check if the face service is healthy.
 */
export async function checkFaceServiceHealth(): Promise<boolean> {
  try {
    const response = await faceClient.get('/health');
    return response.data?.status === 'healthy';
  } catch {
    return false;
  }
}
