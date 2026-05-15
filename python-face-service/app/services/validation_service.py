"""
ArcLock Face Service - Validation Service
Validates captured images for face enrollment and verification quality.
"""

from typing import Tuple, Optional

import numpy as np

from app.core.config import settings


def validate_face_count(face_results: list) -> Tuple[bool, Optional[str]]:
    """
    Validate that exactly one face is detected in the image.

    Args:
        face_results: List of face detection results from DeepFace

    Returns:
        Tuple of (is_valid, error_message)
    """
    face_count = len(face_results)

    if face_count == 0:
        return False, "No face detected. Please position your face clearly within the frame."

    if face_count > settings.MAX_FACES_ALLOWED:
        return False, (
            f"Multiple faces detected ({face_count}). "
            "Please ensure only one face is visible in the frame."
        )

    return True, None


def validate_face_confidence(confidence: float) -> Tuple[bool, Optional[str]]:
    """
    Validate that the face detection confidence meets the minimum threshold.

    Args:
        confidence: Face detection confidence score (0-1)

    Returns:
        Tuple of (is_valid, error_message)
    """
    if confidence < settings.MIN_FACE_CONFIDENCE:
        return False, (
            f"Face detection confidence too low ({confidence:.2f}). "
            f"Minimum required: {settings.MIN_FACE_CONFIDENCE}. "
            "Please ensure good lighting and face the camera directly."
        )

    return True, None


def validate_face_region(face_region: dict, image_shape: tuple) -> Tuple[bool, Optional[str]]:
    """
    Validate that the detected face occupies a reasonable portion of the image
    and is not too close to the edges.

    Args:
        face_region: Dict with keys {x, y, w, h}
        image_shape: Image shape tuple (height, width, channels)

    Returns:
        Tuple of (is_valid, error_message)
    """
    img_height, img_width = image_shape[:2]

    x = face_region.get("x", 0)
    y = face_region.get("y", 0)
    w = face_region.get("w", 0)
    h = face_region.get("h", 0)

    face_area = w * h
    image_area = img_width * img_height

    # Face should be at least 5% of the image
    if face_area / image_area < 0.05:
        return False, "Face is too far from the camera. Please move closer."

    # Face should not be more than 90% of the image
    if face_area / image_area > 0.90:
        return False, "Face is too close to the camera. Please move further away."

    # Face should not be cut off at edges (at least 5% margin)
    margin = 0.02
    if x < -img_width * margin or y < -img_height * margin:
        return False, "Face is too close to the edge. Please center your face."

    if (x + w) > img_width * (1 + margin) or (y + h) > img_height * (1 + margin):
        return False, "Face is partially outside the frame. Please center your face."

    return True, None
