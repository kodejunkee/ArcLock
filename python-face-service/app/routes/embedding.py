"""
ArcLock Face Service - Embedding Generation Route
Receives a base64-encoded face image, generates a 512-d ArcFace embedding,
and returns it. The raw image is destroyed from memory immediately after processing.
"""

import logging

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from app.models.schemas import EmbeddingRequest, EmbeddingResponse, ErrorResponse
from app.services.face_service import generate_embedding

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post(
    "/generate-embedding",
    response_model=EmbeddingResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Face validation failed"},
        422: {"model": ErrorResponse, "description": "Invalid input"},
        500: {"model": ErrorResponse, "description": "Processing error"},
    },
    tags=["Embedding"],
    summary="Generate Facial Embedding",
    description=(
        "Accepts a base64-encoded face image, detects the face, validates quality, "
        "generates a 512-dimensional ArcFace embedding, and immediately destroys "
        "the raw image from memory. Only the numerical embedding vector is returned."
    ),
)
async def create_embedding(request: EmbeddingRequest):
    """Generate a facial embedding from a base64-encoded image."""

    if not request.image or len(request.image) < 100:
        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "error": "Invalid or empty image data",
                "code": "INVALID_INPUT",
            },
        )

    # Limit image size (roughly 10MB base64)
    if len(request.image) > 15_000_000:
        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "error": "Image too large. Maximum size is ~10MB.",
                "code": "IMAGE_TOO_LARGE",
            },
        )

    logger.info("Processing embedding request...")
    result, error = generate_embedding(request.image)

    if error:
        status_code = 400
        if error["code"] == "PROCESSING_ERROR":
            status_code = 500

        return JSONResponse(
            status_code=status_code,
            content={
                "success": False,
                "error": error["error"],
                "code": error["code"],
            },
        )

    return EmbeddingResponse(
        success=True,
        embedding=result["embedding"],
        dimension=result["dimension"],
        detection=result["detection"],
    )
