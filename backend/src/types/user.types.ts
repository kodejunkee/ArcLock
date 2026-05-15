/**
 * ArcLock Backend — User Types
 */

import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  encryptedTemplate: string;
  publicKey: string;
  encryptedPrivateKey: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  securityStatus: 'active' | 'locked' | 'suspended';
}

export interface UpdateProfileRequest {
  name?: string;
}
