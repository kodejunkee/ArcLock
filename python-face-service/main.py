"""
ArcLock Face Service — Main Entry Point

A lightweight FastAPI microservice for facial embedding generation.
Uses DeepFace with ArcFace backend for high-accuracy 512-dimensional
facial embeddings.

PRIVACY: Raw images are NEVER stored. They are processed entirely
in memory and destroyed immediately after embedding extraction.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routes.health import router as health_router
from app.routes.embedding import router as embedding_router
from app.services.face_service import warm_up_model


# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan — warm up the ArcFace model on startup."""
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    warm_up_model()
    logger.info("Service ready to accept requests")
    yield
    logger.info("Shutting down face service")


# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "Secure facial embedding generation service for ArcLock. "
        "Processes face images in memory, generates ArcFace embeddings, "
        "and destroys raw image data immediately."
    ),
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routes
app.include_router(health_router, prefix="")
app.include_router(embedding_router, prefix="")


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint — service info."""
    return {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
