/**
 * ArcLock Backend — Similarity Service
 * Computes cosine similarity between facial embedding vectors.
 */

import { logger } from '../utils/logger';

/**
 * Compute the cosine similarity between two embedding vectors.
 *
 * Cosine similarity measures the angle between two vectors:
 *   similarity = (A · B) / (|A| × |B|)
 *
 * Returns a value between -1 and 1:
 *   1.0 = identical
 *   0.0 = completely different
 *  -1.0 = opposite
 *
 * For facial recognition, a threshold of 0.6 is used.
 *
 * @param embeddingA - First embedding vector
 * @param embeddingB - Second embedding vector
 * @returns Cosine similarity score
 */
export function cosineSimilarity(embeddingA: number[], embeddingB: number[]): number {
  if (embeddingA.length !== embeddingB.length) {
    throw new Error(
      `Embedding dimension mismatch: ${embeddingA.length} vs ${embeddingB.length}`
    );
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < embeddingA.length; i++) {
    dotProduct += embeddingA[i] * embeddingB[i];
    magnitudeA += embeddingA[i] * embeddingA[i];
    magnitudeB += embeddingB[i] * embeddingB[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    logger.warn('Zero-magnitude embedding detected');
    return 0;
  }

  const similarity = dotProduct / (magnitudeA * magnitudeB);

  logger.debug(`Cosine similarity: ${similarity.toFixed(4)}`);

  return similarity;
}

/**
 * Check if two embeddings match based on a similarity threshold.
 *
 * @param embeddingA - First embedding
 * @param embeddingB - Second embedding
 * @param threshold - Minimum similarity for a match (default: 0.6)
 * @returns Object with match result and similarity score
 */
export function matchEmbeddings(
  embeddingA: number[],
  embeddingB: number[],
  threshold: number = 0.6
): { isMatch: boolean; similarity: number } {
  const similarity = cosineSimilarity(embeddingA, embeddingB);

  return {
    isMatch: similarity >= threshold,
    similarity: parseFloat(similarity.toFixed(4)),
  };
}
