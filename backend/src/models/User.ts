/**
 * ArcLock Backend — User Model
 * Stores user data with encrypted biometric template.
 * 
 * SECURITY: Only encrypted embeddings and encrypted private keys
 * are stored. Raw facial data is NEVER persisted.
 */

import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types/user.types';

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name must not exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    encryptedTemplate: {
      type: String,
      required: [true, 'Encrypted biometric template is required'],
    },
    publicKey: {
      type: String,
      required: [true, 'Public key is required'],
    },
    encryptedPrivateKey: {
      type: String,
      required: [true, 'Encrypted private key is required'],
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

// Index for fast email lookups
UserSchema.index({ email: 1 });

// Remove sensitive fields when converting to JSON
UserSchema.set('toJSON', {
  transform: (_doc: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.encryptedTemplate;
    delete ret.publicKey;
    delete ret.encryptedPrivateKey;
    return ret;
  },
});

export const User = mongoose.model<IUser>('User', UserSchema);
