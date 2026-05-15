"""
ArcLock Face Service - Pydantic Schemas
Request/response models for the face embedding API.
"""

from pydantic import BaseModel, Field
from typing import List, Optional


class EmbeddingRequest(BaseModel):
    """Request schema for generating a facial embedding."""
    image: str = Field(
        ...,
        description="Base64-encoded image string (with or without data URI prefix)"
    )


class FaceDetectionResult(BaseModel):
    """Details about the detected face."""
    confidence: float = Field(
        ...,
        description="Face detection confidence score (0-1)"
    )
    face_region: dict = Field(
        default_factory=dict,
        description="Bounding box of the detected face {x, y, w, h}"
    )


class EmbeddingResponse(BaseModel):
    """Successful embedding generation response."""
    success: bool = True
    embedding: List[float] = Field(
        ...,
        description="512-dimensional facial embedding vector"
    )
    dimension: int = Field(
        default=512,
        description="Embedding vector dimension"
    )
    detection: FaceDetectionResult = Field(
        ...,
        description="Face detection metadata"
    )


class ErrorResponse(BaseModel):
    """Error response schema."""
    success: bool = False
    error: str = Field(
        ...,
        description="Human-readable error message"
    )
    code: str = Field(
        ...,
        description="Machine-readable error code"
    )


class HealthResponse(BaseModel):
    """Health check response."""
    status: str = "healthy"
    service: str = "ArcLock Face Service"
    version: str = "1.0.0"
    model_loaded: bool = False
