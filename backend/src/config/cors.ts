/**
 * ArcLock Backend — CORS Configuration
 */

import cors from 'cors';
import { env } from './environment';

export const corsOptions: cors.CorsOptions = {
  origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Device-Info'],
  maxAge: 86400, // 24 hours
};
