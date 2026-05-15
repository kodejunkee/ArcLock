/**
 * ArcLock Backend — ECC Encryption Service
 * Elliptic Curve Cryptography using ECIES (secp256k1).
 *
 * FLOW:
 * 1. Generate key pair (per user, at registration)
 * 2. Encrypt embedding with public key → stored in DB
 * 3. Private key encrypted with AES master key → stored in DB
 * 4. At verification: decrypt private key → decrypt embedding → compare
 *
 * Raw embeddings are NEVER stored. Only encrypted templates.
 */

import eccrypto from '@toruslabs/eccrypto';
import {
  serializeEncryptedData,
  deserializeEncryptedData,
  embeddingToBuffer,
  bufferToEmbedding,
} from './serialization';
import { aesEncrypt, aesDecrypt } from './aes.service';
import { ECCKeyPair } from '../types/embedding.types';
import { logger } from '../utils/logger';

/**
 * Generate a new ECC key pair (secp256k1).
 * Used once per user at registration time.
 */
export function generateKeyPair(): ECCKeyPair {
  const privateKey = eccrypto.generatePrivate();
  const publicKey = eccrypto.getPublic(privateKey);

  return { publicKey, privateKey };
}

/**
 * Encrypt a facial embedding using ECC (ECIES).
 *
 * @param embedding - The 512-dimensional embedding vector
 * @param publicKey - The user's ECC public key
 * @returns Serialized encrypted data as a JSON string
 */
export async function encryptEmbedding(
  embedding: number[],
  publicKey: Buffer
): Promise<string> {
  try {
    const embeddingBuffer = embeddingToBuffer(embedding);
    const encrypted = await eccrypto.encrypt(publicKey, embeddingBuffer);

    return serializeEncryptedData(encrypted);
  } catch (error) {
    logger.error('ECC encryption failed:', error);
    throw new Error('Failed to encrypt biometric template');
  }
}

/**
 * Decrypt a facial embedding using ECC (ECIES).
 *
 * @param encryptedData - Serialized encrypted data from encryptEmbedding
 * @param privateKey - The user's ECC private key (decrypted from AES)
 * @returns The original 512-dimensional embedding vector
 */
export async function decryptEmbedding(
  encryptedData: string,
  privateKey: Buffer
): Promise<number[]> {
  try {
    const encrypted = deserializeEncryptedData(encryptedData);
    const decryptedBuffer = await eccrypto.decrypt(privateKey, encrypted);

    return bufferToEmbedding(decryptedBuffer);
  } catch (error) {
    logger.error('ECC decryption failed:', error);
    throw new Error('Failed to decrypt biometric template');
  }
}

/**
 * Encrypt and store a user's biometric data.
 * Returns everything needed to store in the database.
 *
 * @param embedding - The raw 512-d embedding from the face service
 * @returns Object containing encrypted template, public key, and encrypted private key
 */
export async function prepareForStorage(embedding: number[]): Promise<{
  encryptedTemplate: string;
  publicKey: string;
  encryptedPrivateKey: string;
}> {
  // 1. Generate fresh key pair for this user
  const keyPair = generateKeyPair();

  // 2. Encrypt embedding with public key (ECIES)
  const encryptedTemplate = await encryptEmbedding(embedding, keyPair.publicKey);

  // 3. Encrypt private key with AES master key (for storage)
  const encryptedPrivateKey = aesEncrypt(keyPair.privateKey);

  // 4. Serialize public key for storage
  const publicKeyHex = keyPair.publicKey.toString('hex');

  logger.info('Biometric template encrypted and ready for storage');

  return {
    encryptedTemplate,
    publicKey: publicKeyHex,
    encryptedPrivateKey,
  };
}

/**
 * Retrieve and decrypt a user's stored embedding for comparison.
 *
 * @param encryptedTemplate - The stored encrypted embedding
 * @param encryptedPrivateKey - The stored AES-encrypted private key
 * @returns The decrypted 512-d embedding vector
 */
export async function retrieveEmbedding(
  encryptedTemplate: string,
  encryptedPrivateKey: string
): Promise<number[]> {
  // 1. Decrypt the ECC private key using AES master key
  const privateKey = aesDecrypt(encryptedPrivateKey);

  // 2. Decrypt the embedding using ECC private key
  const embedding = await decryptEmbedding(encryptedTemplate, privateKey);

  return embedding;
}
