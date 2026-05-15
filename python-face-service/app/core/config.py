"""
ArcLock Face Service - Configuration
"""

import os


class Settings:
    """Application configuration settings."""

    APP_NAME: str = "ArcLock Face Service"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"

    # Face detection settings
    DETECTOR_BACKEND: str = "retinaface"
    MODEL_NAME: str = "ArcFace"
    EMBEDDING_DIMENSION: int = 512

    # Validation settings
    MIN_FACE_CONFIDENCE: float = 0.90
    MAX_FACES_ALLOWED: int = 1
    MIN_IMAGE_SIZE: int = 64  # minimum width/height in pixels

    # Server settings
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    # CORS
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5000",
    ]


settings = Settings()
