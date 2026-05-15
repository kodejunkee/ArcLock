/**
 * ArcLock Backend — AES Encryption Service
 * Used to encrypt ECC private keys at rest using AES-256-GCM.
 *
 * The AES master key comes from the server environment (.env).
 * This adds a second layer of protection: even if the database
 * is compromised, the ECC private keys cannot be used without
 * the server's master key.
 */

import crypto from 'crypto';
import { env } from '../config/environment';
import { serializeAESData, deserializeAESData } from './serialization';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // 128 bits
const AUTH_TAG_LENGTH = 16; // 128 bits

/**
 * Get the AES master key as a Buffer.
 */
function getMasterKey(): Buffer {
  return Buffer.from(env.AES_MASTER_KEY, 'hex');
}

/**
 * Encrypt data using AES-256-GCM with the server master key.
 *
 * @param data - The data to encrypt (as a Buffer)
 * @returns Serialized JSON string containing iv, ciphertext, and authTag
 */
export function aesEncrypt(data: Buffer): string {
  const masterKey = getMasterKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, masterKey, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return serializeAESData({
    iv,
    ciphertext: encrypted,
    authTag,
  });
}

/**
 * Decrypt data using AES-256-GCM with the server master key.
 *
 * @param serialized - Serialized JSON string from aesEncrypt
 * @returns Decrypted data as a Buffer
 */
export function aesDecrypt(serialized: string): Buffer {
  const masterKey = getMasterKey();
  const { iv, ciphertext, authTag } = deserializeAESData(serialized);

  const decipher = crypto.createDecipheriv(ALGORITHM, masterKey, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);

  return decrypted;
}
