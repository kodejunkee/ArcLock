/**
 * ArcLock Backend — Embedding & Encryption Types
 */

export interface EmbeddingResult {
  embedding: number[];
  dimension: number;
  detection: {
    confidence: number;
    face_region: {
      x: number;
      y: number;
      w: number;
      h: number;
    };
  };
}

export interface FaceServiceResponse {
  success: boolean;
  embedding?: number[];
  dimension?: number;
  detection?: {
    confidence: number;
    face_region: {
      x: number;
      y: number;
      w: number;
      h: number;
    };
  };
  error?: string;
  code?: string;
}

export interface ECCKeyPair {
  publicKey: Buffer;
  privateKey: Buffer;
}

export interface EncryptedData {
  iv: string;
  ephemPublicKey: string;
  ciphertext: string;
  mac: string;
}

export interface AESEncryptedData {
  iv: string;
  ciphertext: string;
  authTag: string;
}
