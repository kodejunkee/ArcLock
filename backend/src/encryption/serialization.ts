/**
 * ArcLock Backend — Serialization Utilities
 * Converts encrypted data structures to/from JSON strings for MongoDB storage.
 */

import { EncryptedData, AESEncryptedData } from '../types/embedding.types';

/**
 * Serialize an ECIES encrypted object to a storable JSON string.
 * The encrypted data from eccrypto contains Buffers which need
 * to be converted to hex strings for storage.
 */
export function serializeEncryptedData(encrypted: {
  iv: Buffer;
  ephemPublicKey: Buffer;
  ciphertext: Buffer;
  mac: Buffer;
}): string {
  const serialized: EncryptedData = {
    iv: encrypted.iv.toString('hex'),
    ephemPublicKey: encrypted.ephemPublicKey.toString('hex'),
    ciphertext: encrypted.ciphertext.toString('hex'),
    mac: encrypted.mac.toString('hex'),
  };

  return JSON.stringify(serialized);
}

/**
 * Deserialize a stored JSON string back into Buffer-based encrypted data
 * suitable for eccrypto decryption.
 */
export function deserializeEncryptedData(serialized: string): {
  iv: Buffer;
  ephemPublicKey: Buffer;
  ciphertext: Buffer;
  mac: Buffer;
} {
  const parsed: EncryptedData = JSON.parse(serialized);

  return {
    iv: Buffer.from(parsed.iv, 'hex'),
    ephemPublicKey: Buffer.from(parsed.ephemPublicKey, 'hex'),
    ciphertext: Buffer.from(parsed.ciphertext, 'hex'),
    mac: Buffer.from(parsed.mac, 'hex'),
  };
}

/**
 * Serialize AES encrypted data for storage.
 */
export function serializeAESData(data: {
  iv: Buffer;
  ciphertext: Buffer;
  authTag: Buffer;
}): string {
  const serialized: AESEncryptedData = {
    iv: data.iv.toString('hex'),
    ciphertext: data.ciphertext.toString('hex'),
    authTag: data.authTag.toString('hex'),
  };

  return JSON.stringify(serialized);
}

/**
 * Deserialize stored AES encrypted data.
 */
export function deserializeAESData(serialized: string): {
  iv: Buffer;
  ciphertext: Buffer;
  authTag: Buffer;
} {
  const parsed: AESEncryptedData = JSON.parse(serialized);

  return {
    iv: Buffer.from(parsed.iv, 'hex'),
    ciphertext: Buffer.from(parsed.ciphertext, 'hex'),
    authTag: Buffer.from(parsed.authTag, 'hex'),
  };
}

/**
 * Convert a floating-point embedding array to a Buffer for encryption.
 */
export function embeddingToBuffer(embedding: number[]): Buffer {
  const float64Array = new Float64Array(embedding);
  return Buffer.from(float64Array.buffer);
}

/**
 * Convert a Buffer back to a floating-point embedding array.
 */
export function bufferToEmbedding(buffer: Buffer): number[] {
  const float64Array = new Float64Array(
    buffer.buffer,
    buffer.byteOffset,
    buffer.length / Float64Array.BYTES_PER_ELEMENT
  );
  return Array.from(float64Array);
}
