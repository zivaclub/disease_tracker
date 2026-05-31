import secrets
from datetime import datetime

import structlog
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models import Disease, Outbreak

logger = structlog.get_logger(__name__)


def _new_outbreak_id() -> str:
    return f"ob-{secrets.token_hex(5)}"


async def list_outbreaks(session: AsyncSession, *, active_only: bool = False) -> list:
    from app.services.mappers import map_outbreak

    stmt = select(Outbreak).order_by(Outbreak.last_updated.desc())
    if active_only:
        stmt = stmt.where(Outbreak.active.is_(True))
    result = await session.execute(stmt)
    outbreaks = result.scalars().all()
    return [map_outbreak(o) for o in outbreaks]


async def add_outbreak(session: AsyncSession, payload: dict) -> Outbreak | None:
    disease_id = payload.get("diseaseId") or payload.get("disease_id")
    country = payload.get("country")
    cases = payload.get("cases")
    deaths = payload.get("deaths")
    if not disease_id or not country or cases is None or deaths is None:
        return None

    region = payload.get("region")
    city = payload.get("city")
    recovered = payload.get("recovered", 0)
    latitude = payload.get("latitude", 0.0)
    longitude = payload.get("longitude", 0.0)
    risk_level = payload.get("riskLevel") or payload.get("risk_level") or "Medium"

    disease_result = await session.execute(select(Disease).where(Disease.id == disease_id))
    disease = disease_result.scalar_one_or_none()
    if disease is None:
        logger.warning("add_outbreak_unknown_disease", disease_id=disease_id)
        return None

    today = datetime.utcnow().strftime("%Y-%m-%d")
    outbreak = Outbreak(
        id=_new_outbreak_id(),
        disease_id=disease_id,
        disease_name=disease.name,
        country=country,
        region=region or "All",
        city=city or "Metropolitan Block",
        cases=cases,
        deaths=deaths,
        recovered=recovered,
        latitude=latitude,
        longitude=longitude,
        active=True,
        first_detected=today,
        last_updated=today,
        risk_level=risk_level,
    )
    session.add(outbreak)
    await session.flush()
    logger.info(
        "outbreak_added",
        outbreak_id=outbreak.id,
        disease_id=disease_id,
        country=country,
        cases=cases,
    )
    return outbreak


async def update_cases(session: AsyncSession, payload: dict) -> Outbreak | None:
    outbreak_id = payload.get("id") or payload.get("outbreak_id")
    cases = payload.get("cases")
    deaths = payload.get("deaths")
    recovered = payload.get("recovered")
    risk_level = payload.get("riskLevel") or payload.get("risk_level")

    if not outbreak_id:
        return None

    result = await session.execute(select(Outbreak).where(Outbreak.id == outbreak_id))
    outbreak = result.scalar_one_or_none()
    if outbreak is None:
        logger.warning("outbreak_not_found", outbreak_id=outbreak_id)
        return None

    if cases is not None:
        outbreak.cases = cases
    if deaths is not None:
        outbreak.deaths = deaths
    if recovered is not None:
        outbreak.recovered = recovered
    if risk_level is not None:
        outbreak.risk_level = risk_level
    outbreak.last_updated = datetime.utcnow().strftime("%Y-%m-%d")
    await session.flush()
    logger.info("outbreak_updated", outbreak_id=outbreak_id, cases=outbreak.cases)
    return outbreak
