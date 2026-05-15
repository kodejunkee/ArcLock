/**
 * ArcLock Backend — Server Entry Point
 *
 * Express.js server with:
 * - Helmet security headers
 * - CORS
 * - Rate limiting
 * - Input sanitization
 * - JWT authentication
 * - MongoDB Atlas connection
 * - Global error handling
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/environment';
import { connectDatabase } from './config/database';
import { corsOptions } from './config/cors';
import { generalLimiter } from './middleware/rateLimiter';
import { sanitizer } from './middleware/sanitizer';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';
import { logger } from './utils/logger';
import { checkFaceServiceHealth } from './services/face.service';

const app = express();

// ━━━ Security Middleware ━━━
app.use(helmet());
app.use(cors(corsOptions));
app.use(generalLimiter);

// ━━━ Body Parsing ━━━
app.use(express.json({ limit: '15mb' })); // Large limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// ━━━ Input Sanitization ━━━
app.use(sanitizer);

// ━━━ API Routes ━━━
app.use('/api', routes);

// ━━━ Health Check ━━━
app.get('/health', async (_req, res) => {
  const faceServiceHealthy = await checkFaceServiceHealth();

  res.json({
    status: 'healthy',
    service: 'ArcLock Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    dependencies: {
      faceService: faceServiceHealthy ? 'connected' : 'unavailable',
      database: 'connected',
    },
  });
});

// ━━━ Root ━━━
app.get('/', (_req, res) => {
  res.json({
    service: 'ArcLock Backend',
    version: '1.0.0',
    docs: '/health',
  });
});

// ━━━ 404 Handler ━━━
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    code: 'NOT_FOUND',
  });
});

// ━━━ Global Error Handler ━━━
app.use(errorHandler);

// ━━━ Start Server ━━━
const startServer = async () => {
  try {
    // Connect to MongoDB Atlas
    await connectDatabase();

    // Start Express server
    app.listen(env.PORT, () => {
      logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      logger.info(`  🔒 ArcLock Backend v1.0.0`);
      logger.info(`  📡 Running on port ${env.PORT}`);
      logger.info(`  🌍 Environment: ${env.NODE_ENV}`);
      logger.info(`  🧬 Face Service: ${env.FACE_SERVICE_URL}`);
      logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
