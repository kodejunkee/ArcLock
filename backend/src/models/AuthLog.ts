/**
 * ArcLock Backend — Auth Log Model
 * Tracks all authentication attempts for security auditing.
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IAuthLog extends Document {
  userId: mongoose.Types.ObjectId;
  status: 'success' | 'failure';
  similarity: number;
  device: string;
  ipAddress: string;
  timestamp: Date;
}

const AuthLogSchema = new Schema<IAuthLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['success', 'failure'],
      required: true,
    },
    similarity: {
      type: Number,
      default: 0,
    },
    device: {
      type: String,
      default: 'Unknown',
    },
    ipAddress: {
      type: String,
      default: '',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'auth_logs',
  }
);

// Index for querying user's auth history
AuthLogSchema.index({ userId: 1, timestamp: -1 });

// Auto-expire old logs after 90 days
AuthLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

export const AuthLog = mongoose.model<IAuthLog>('AuthLog', AuthLogSchema);
