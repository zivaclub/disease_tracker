import time
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.api.v1.routes.api import limiter, router, v1_router
from app.core.config import settings
from app.core.database import init_db
from app.core.logging import configure_logging, logger


@asynccontextmanager
async def lifespan(app: FastAPI):
    configure_logging()
    logger.info("starting_up", environment=settings.environment)
    await init_db()
    yield
    logger.info("shutting_down")


app = FastAPI(
    title=settings.app_name,
    version="2.0.0",
    description="Production Disease Tracker API — WHO/CDC data, 10YL education, early warning",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Legacy /api routes (v1 frontend contract)
app.include_router(router, prefix=settings.legacy_api_prefix, tags=["legacy"])
# Versioned API
app.include_router(v1_router, prefix=settings.api_v1_prefix, tags=["v1"])

Instrumentator().instrument(app).expose(app, endpoint="/metrics")


@app.get("/")
async def root():
    return {
        "name": settings.app_name,
        "version": "2.0.0",
        "docs": "/docs",
        "health": f"{settings.legacy_api_prefix}/health",
    }

