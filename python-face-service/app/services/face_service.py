"""
ArcLock Face Service - Core Face Processing Service
Handles face detection, embedding generation, and secure image disposal.

CRITICAL: Raw images are processed entirely in memory and destroyed
immediately after embedding extraction. No image data is ever written to disk.
"""

import gc
import logging
from typing import Tuple, Dict, Any

import numpy as np
from deepface import DeepFace

from app.core.config import settings
from app.utils.image_utils import (
    decode_base64_image,
    validate_image_dimensions,
    destroy_image,
    resize_for_processing,
)
from app.services.validation_service import (
    validate_face_count,
    validate_face_confidence,
    validate_face_region,
)


logger = logging.getLogger(__name__)

# Track whether the model has been loaded
_model_loaded = False


def warm_up_model() -> bool:
    """
    Pre-load the ArcFace model into memory at startup.
    This avoids the cold-start delay on the first request.
    """
    global _model_loaded
    try:
        logger.info("Warming up ArcFace model...")
        # Create a small dummy image to trigger model download/load
        dummy = np.zeros((160, 160, 3), dtype=np.uint8)
        dummy[:] = 128  # gray fill

        try:
            DeepFace.represent(
                img_path=dummy,
                model_name=settings.MODEL_NAME,
                detector_backend="skip",  # skip detection for warmup
                enforce_detection=False,
            )
        except Exception:
            # Model might fail on dummy image but still loads weights
            pass

        _model_loaded = True
        logger.info("ArcFace model loaded successfully")
        return True

    except Exception as e:
        logger.error(f"Model warmup failed: {e}")
        _model_loaded = False
        return False


def is_model_loaded() -> bool:
    """Check if the face recognition model is loaded."""
    return _model_loaded


def generate_embedding(base64_image: str) -> Tuple[Dict[str, Any], None] | Tuple[None, Dict[str, Any]]:
    """
    Generate a 512-dimensional facial embedding from a base64-encoded image.

    Pipeline:
    1. Decode base64 → numpy array (in memory only)
    2. Validate image dimensions
    3. Resize if necessary
    4. Detect face using RetinaFace
    5. Validate: single face, confidence, positioning
    6. Generate ArcFace embedding
    7. DESTROY raw image from memory
    8. Return embedding vector

    Args:
        base64_image: Base64-encoded image string

    Returns:
        Tuple of (result_dict, None) on success or (None, error_dict) on failure
    """
    image = None

    try:
        # Step 1: Decode image
        logger.info("Decoding base64 image...")
        image = decode_base64_image(base64_image)

        # Step 2: Validate dimensions
        is_valid, error = validate_image_dimensions(image, settings.MIN_IMAGE_SIZE)
        if not is_valid:
            return None, {"error": error, "code": "INVALID_IMAGE_SIZE"}

        # Step 3: Resize for performance
        image = resize_for_processing(image, max_dimension=640)

        # Step 4 & 6: Detect face and generate embedding
        logger.info("Generating facial embedding with ArcFace...")
        results = DeepFace.represent(
            img_path=image,
            model_name=settings.MODEL_NAME,
            detector_backend=settings.DETECTOR_BACKEND,
            enforce_detection=True,
        )

        # Step 5a: Validate face count
        is_valid, error = validate_face_count(results)
        if not is_valid:
            return None, {"error": error, "code": "FACE_VALIDATION_FAILED"}

        face_result = results[0]

        # Extract detection metadata
        face_confidence = face_result.get("face_confidence", 0.0)
        facial_area = face_result.get("facial_area", {})

        # Step 5b: Validate confidence
        is_valid, error = validate_face_confidence(face_confidence)
        if not is_valid:
            return None, {"error": error, "code": "LOW_CONFIDENCE"}

        # Step 5c: Validate face region
        is_valid, error = validate_face_region(facial_area, image.shape)
        if not is_valid:
            return None, {"error": error, "code": "FACE_POSITIONING"}

        # Extract embedding
        embedding = face_result["embedding"]

        # Validate embedding dimension
        if len(embedding) != settings.EMBEDDING_DIMENSION:
            return None, {
                "error": f"Unexpected embedding dimension: {len(embedding)}",
                "code": "EMBEDDING_DIMENSION_MISMATCH",
            }

        logger.info(f"Embedding generated successfully (dim={len(embedding)}, confidence={face_confidence:.3f})")

        return {
            "embedding": embedding,
            "dimension": len(embedding),
            "detection": {
                "confidence": float(face_confidence),
                "face_region": {
                    "x": int(facial_area.get("x", 0)),
                    "y": int(facial_area.get("y", 0)),
                    "w": int(facial_area.get("w", 0)),
                    "h": int(facial_area.get("h", 0)),
                },
            },
        }, None

    except ValueError as e:
        logger.warning(f"Validation error: {e}")
        return None, {"error": str(e), "code": "VALIDATION_ERROR"}

    except Exception as e:
        error_msg = str(e)
        if "Face could not be detected" in error_msg:
            return None, {
                "error": "No face detected in the image. Please ensure your face is clearly visible with good lighting.",
                "code": "NO_FACE_DETECTED",
            }

        logger.error(f"Embedding generation failed: {e}")
        return None, {"error": f"Face processing failed: {error_msg}", "code": "PROCESSING_ERROR"}

    finally:
        # CRITICAL: Destroy raw image from memory immediately
        if image is not None:
            destroy_image(image)
            logger.info("Raw image destroyed from memory")
        gc.collect()
