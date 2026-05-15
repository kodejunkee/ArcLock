/**
 * ArcLock Backend — Auth Service
 * Core authentication business logic: registration & facial verification.
 *
 * FLOW (Registration):
 *   Image → Python service → embedding → ECC encrypt → MongoDB
 *
 * FLOW (Verification):
 *   Image → Python service → new embedding
 *   MongoDB → encrypted template → ECC decrypt → stored embedding
 *   Compare(new, stored) → cosine similarity → accept/reject
 */

import { generateEmbedding } from './face.service';
import { prepareForStorage, retrieveEmbedding } from '../encryption/ecc.service';
import { matchEmbeddings } from './similarity.service';
import { generateTokens } from './token.service';
import * as userService from './user.service';
import * as logService from './log.service';
import { AuthResponse } from '../types/auth.types';
import { env } from '../config/environment';
import { logger } from '../utils/logger';

/**
 * Register a new user with facial biometrics.
 *
 * Steps:
 * 1. Check if user already exists
 * 2. Send image to Python face service for embedding
 * 3. Encrypt embedding with ECC
 * 4. Store encrypted template + keys in MongoDB
 * 5. Generate JWT tokens
 */
export async function register(
  name: string,
  email: string,
  imageBase64: string,
  device?: string,
  ipAddress?: string
): Promise<AuthResponse> {
  // 1. Check for existing user
  const existingUser = await userService.findByEmail(email);
  if (existingUser) {
    throw new Error('A user with this email is already registered');
  }

  // 2. Generate facial embedding
  logger.info(`Registering new user: ${email}`);
  const faceResult = await generateEmbedding(imageBase64);

  if (!faceResult.success || !faceResult.embedding) {
    throw new Error(faceResult.error || 'Failed to process facial data');
  }

  // 3. Encrypt embedding with ECC
  const encryptedData = await prepareForStorage(faceResult.embedding);

  // 4. Create user record
  const user = await userService.createUser({
    name,
    email,
    encryptedTemplate: encryptedData.encryptedTemplate,
    publicKey: encryptedData.publicKey,
    encryptedPrivateKey: encryptedData.encryptedPrivateKey,
  });

  // 5. Generate tokens
  const tokens = generateTokens(user._id.toString(), user.email);

  // 6. Log success
  await logService.logAuthAttempt({
    userId: user._id.toString(),
    status: 'success',
    similarity: 1.0,
    device,
    ipAddress,
  });

  logger.info(`User registered successfully: ${email}`);

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
    tokens,
  };
}

/**
 * Verify a user's face against their stored biometric template.
 *
 * Steps:
 * 1. Find user by email
 * 2. Check for lockout
 * 3. Generate embedding from new face image
 * 4. Decrypt stored embedding
 * 5. Compare embeddings using cosine similarity
 * 6. Return auth result
 */
export async function verifyFace(
  email: string,
  imageBase64: string,
  device?: string,
  ipAddress?: string
): Promise<AuthResponse> {
  // 1. Find user
  const user = await userService.findByEmail(email);
  if (!user) {
    throw new Error('No account found with this email');
  }

  // 2. Check lockout
  const isLocked = await logService.isUserLockedOut(user._id.toString());
  if (isLocked) {
    throw new Error('Account temporarily locked due to multiple failed attempts. Please try again in 15 minutes.');
  }

  // 3. Generate new embedding
  logger.info(`Verifying face for user: ${email}`);
  const faceResult = await generateEmbedding(imageBase64);

  if (!faceResult.success || !faceResult.embedding) {
    // Log failure
    await logService.logFailedAttempt({
      userId: user._id.toString(),
      reason: faceResult.error || 'Face processing failed',
      device,
      ipAddress,
    });
    throw new Error(faceResult.error || 'Failed to process facial data');
  }

  // 4. Decrypt stored embedding
  const storedEmbedding = await retrieveEmbedding(
    user.encryptedTemplate,
    user.encryptedPrivateKey
  );

  // 5. Compare embeddings
  const { isMatch, similarity } = matchEmbeddings(
    faceResult.embedding,
    storedEmbedding,
    env.SIMILARITY_THRESHOLD
  );

  if (!isMatch) {
    // Log failure
    await logService.logAuthAttempt({
      userId: user._id.toString(),
      status: 'failure',
      similarity,
      device,
      ipAddress,
    });

    await logService.logFailedAttempt({
      userId: user._id.toString(),
      reason: `Face verification failed (similarity: ${similarity})`,
      device,
      ipAddress,
    });

    throw new Error(`Face verification failed. Similarity: ${similarity.toFixed(2)} (threshold: ${env.SIMILARITY_THRESHOLD})`);
  }

  // 6. Success — generate tokens
  const tokens = generateTokens(user._id.toString(), user.email);

  await logService.logAuthAttempt({
    userId: user._id.toString(),
    status: 'success',
    similarity,
    device,
    ipAddress,
  });

  logger.info(`Face verified for ${email} (similarity: ${similarity})`);

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
    tokens,
    similarity,
  };
}
