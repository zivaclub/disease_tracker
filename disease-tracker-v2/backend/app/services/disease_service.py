from sqlalchemy import select
from sqlalchemy.orm import selectinload

import structlog
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.schemas.responses import DiseaseResponse
from app.domain.models import Disease
from app.services.mappers import map_disease

logger = structlog.get_logger(__name__)


async def list_diseases(session: AsyncSession) -> list[DiseaseResponse]:
    result = await session.execute(
        select(Disease)
        .where(Disease.is_active.is_(True))
        .options(selectinload(Disease.education))
        .order_by(Disease.name)
    )
    diseases = result.scalars().all()
    logger.info("diseases_listed", count=len(diseases))
    return [map_disease(d) for d in diseases]


async def get_disease_by_id(session: AsyncSession, disease_id: str) -> Disease | None:
    result = await session.execute(
        select(Disease)
        .where(Disease.id == disease_id)
        .options(selectinload(Disease.education))
    )
    disease = result.scalar_one_or_none()
    if disease is None:
        logger.warning("disease_not_found", disease_id=disease_id)
    return disease
