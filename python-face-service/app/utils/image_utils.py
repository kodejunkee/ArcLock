"""
ArcLock Face Service - Image Utilities
Handles base64 decoding, numpy conversion, and secure memory cleanup.
Raw images are NEVER persisted — they exist only in memory during processing.
"""

import base64
import gc
import re
from typing import Optional, Tuple

import cv2
import numpy as np


def decode_base64_image(base64_string: str) -> np.ndarray:
    """
    Decode a base64-encoded image string into an OpenCV numpy array.
    Strips the data URI prefix if present.

    Args:
        base64_string: Base64 image string (with or without data URI prefix)

    Returns:
        OpenCV image as numpy array (BGR format)

    Raises:
        ValueError: If the image cannot be decoded
    """
    # Strip data URI prefix if present (e.g., "data:image/jpeg;base64,")
    if "," in base64_string:
        base64_string = base64_string.split(",", 1)[1]

    # Remove any whitespace/newlines
    base64_string = re.sub(r"\s+", "", base64_string)

    try:
        image_bytes = base64.b64decode(base64_string)
        np_array = np.frombuffer(image_bytes, dtype=np.uint8)
        image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

        if image is None:
            raise ValueError("Failed to decode image — invalid or corrupt data")

        return image

    except Exception as e:
        raise ValueError(f"Image decoding failed: {str(e)}")


def validate_image_dimensions(image: np.ndarray, min_size: int = 64) -> Tuple[bool, Optional[str]]:
    """
    Validate that an image meets minimum dimension requirements.

    Args:
        image: OpenCV image array
        min_size: Minimum width/height in pixels

    Returns:
        Tuple of (is_valid, error_message)
    """
    height, width = image.shape[:2]

    if width < min_size or height < min_size:
        return False, f"Image too small: {width}x{height}. Minimum: {min_size}x{min_size}"

    if width > 4096 or height > 4096:
        return False, f"Image too large: {width}x{height}. Maximum: 4096x4096"

    return True, None


def destroy_image(image: np.ndarray) -> None:
    """
    Securely destroy an image from memory.
    Overwrites the buffer with zeros before releasing.

    This is a CRITICAL privacy requirement — raw facial images
    must never persist in memory longer than necessary.
    """
    if image is not None:
        # Overwrite memory with zeros
        image[:] = 0
        del image
        gc.collect()


def resize_for_processing(image: np.ndarray, max_dimension: int = 640) -> np.ndarray:
    """
    Resize an image if it exceeds max dimension while maintaining aspect ratio.
    This improves processing speed without significantly affecting embedding quality.
    """
    height, width = image.shape[:2]
    if max(height, width) <= max_dimension:
        return image

    scale = max_dimension / max(height, width)
    new_width = int(width * scale)
    new_height = int(height * scale)

    return cv2.resize(image, (new_width, new_height), interpolation=cv2.INTER_AREA)
