/**
 * ArcLock Backend — User Service
 * User CRUD operations.
 */

import { User } from '../models/User';
import { IUser } from '../types/user.types';
import { logger } from '../utils/logger';

/**
 * Find a user by email.
 */
export async function findByEmail(email: string): Promise<IUser | null> {
  return User.findOne({ email: email.toLowerCase() }).exec();
}

/**
 * Find a user by ID.
 */
export async function findById(userId: string): Promise<IUser | null> {
  return User.findById(userId).exec();
}

/**
 * Create a new user with encrypted biometric data.
 */
export async function createUser(data: {
  name: string;
  email: string;
  encryptedTemplate: string;
  publicKey: string;
  encryptedPrivateKey: string;
}): Promise<IUser> {
  try {
    const user = await User.create({
      name: data.name,
      email: data.email.toLowerCase(),
      encryptedTemplate: data.encryptedTemplate,
      publicKey: data.publicKey,
      encryptedPrivateKey: data.encryptedPrivateKey,
    });

    logger.info(`User created: ${user.email}`);
    return user;
  } catch (error: any) {
    if (error.code === 11000) {
      throw new Error('A user with this email already exists');
    }
    throw error;
  }
}

/**
 * Update user profile fields (name only — biometric data cannot be updated here).
 */
export async function updateProfile(
  userId: string,
  data: { name?: string }
): Promise<IUser | null> {
  return User.findByIdAndUpdate(
    userId,
    { $set: data },
    { new: true, runValidators: true }
  ).exec();
}

/**
 * Delete a user and all associated data.
 */
export async function deleteUser(userId: string): Promise<boolean> {
  const result = await User.findByIdAndDelete(userId).exec();
  if (result) {
    logger.info(`User deleted: ${result.email}`);
  }
  return !!result;
}

/**
 * Get user with encrypted data (for internal use during verification).
 */
export async function getUserWithBiometrics(email: string): Promise<IUser | null> {
  return User.findOne({ email: email.toLowerCase() })
    .select('+encryptedTemplate +publicKey +encryptedPrivateKey')
    .exec();
}
