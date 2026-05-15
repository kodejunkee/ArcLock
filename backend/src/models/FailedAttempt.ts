/**
 * ArcLock Backend — Failed Attempt Model
 * Tracks failed authentication attempts for security monitoring.
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IFailedAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  reason: string;
  timestamp: Date;
  device: string;
  ipAddress: string;
}

const FailedAttemptSchema = new Schema<IFailedAttempt>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    device: {
      type: String,
      default: 'Unknown',
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    collection: 'failed_attempts',
  }
);

// Index for querying user's failed attempts
FailedAttemptSchema.index({ userId: 1, timestamp: -1 });

// Auto-expire after 30 days
FailedAttemptSchema.index({ timestamp: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export const FailedAttempt = mongoose.model<IFailedAttempt>('FailedAttempt', FailedAttemptSchema);
