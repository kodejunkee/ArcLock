/**
 * ArcLock Backend — Database Configuration
 * Establishes connection to MongoDB Atlas via Mongoose.
 */

import mongoose from 'mongoose';
import { env } from './environment';
import { logger } from '../utils/logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    logger.info('Connecting to MongoDB Atlas...');

    await mongoose.connect(env.MONGODB_URI, {
      // Connection pool settings
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info('✅ MongoDB Atlas connected successfully');

    // Connection event handlers
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting reconnection...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected successfully');
    });

  } catch (error) {
    logger.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
};
