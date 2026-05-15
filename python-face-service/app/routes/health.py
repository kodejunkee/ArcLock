"""
ArcLock Face Service - Health Check Route
"""

from fastapi import APIRouter

from app.models.schemas import HealthResponse
from app.services.face_service import is_model_loaded
from app.core.config import settings

router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """
    Health check endpoint.
    Returns service status and whether the ArcFace model is loaded.
    """
    return HealthResponse(
        status="healthy" if is_model_loaded() else "degraded",
        service=settings.APP_NAME,
        version=settings.APP_VERSION,
        model_loaded=is_model_loaded(),
    )
