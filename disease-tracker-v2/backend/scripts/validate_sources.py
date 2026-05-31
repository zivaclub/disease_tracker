#!/usr/bin/env python3
"""Validate configured data sources and update reliability scores."""

import asyncio
import sys
from datetime import datetime, timezone
from pathlib import Path

import structlog

BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from sqlalchemy import select

from app.core.config import settings
from app.core.database import async_session_factory, init_db
from app.core.logging import configure_logging
from app.domain.models import DataSource
from collectors.rss_collector import RssCollector
from collectors.who_don import WhoDonCollector

configure_logging()
logger = structlog.get_logger(__name__)

ECDC_RSS = "https://www.ecdc.europa.eu/en/taxonomy/term/1255/feed"
CDC_RSS = "https://tools.cdc.gov/api/v2/resources/media/403372.rss"


def _collectors_for_source(source: DataSource) -> list:
    url = source.base_url.lower()
    if "who.int" in url or source.id == "who-don":
        return [WhoDonCollector(source_id=source.id, source_name=source.name)]
    if source.source_type == "RSS":
        return [RssCollector(source.id, source.name, source.base_url)]
    if "ecdc" in url:
        return [RssCollector(source.id, source.name, ECDC_RSS)]
    if "cdc" in url:
        return [RssCollector(source.id, source.name, CDC_RSS)]
    return []


def _score_from_health(health: dict, base_score: float) -> float:
    if health.get("healthy"):
        return min(100.0, base_score + 2.0)
    penalty = 25.0 if health.get("error") else 15.0
    return max(0.0, base_score - penalty)


async def validate_sources() -> None:
    await init_db()
    who_default = WhoDonCollector()

    async with async_session_factory() as session:
        result = await session.execute(select(DataSource))
        sources = result.scalars().all()

        if not sources:
            logger.warning("no_sources_configured")
            session.add(
                DataSource(
                    id="who-don",
                    name="WHO Disease Outbreak News",
                    source_type="API",
                    base_url=settings.who_don_api_url,
                    reliability_score=90.0,
                    update_frequency="Daily",
                    completeness_score=90.0,
                    is_active=True,
                    status="Pending validation",
                )
            )
            await session.flush()
            result = await session.execute(select(DataSource))
            sources = result.scalars().all()

        for source in sources:
            collectors = _collectors_for_source(source)
            if not collectors and source.source_type == "API":
                collectors = [who_default]

            if not collectors:
                source.status = "Skipped (no validator)"
                logger.info("source_skipped", source_id=source.id)
                continue

            best_health: dict | None = None
            for collector in collectors:
                health = await collector.health_check()
                if best_health is None or health.get("healthy"):
                    best_health = health

            assert best_health is not None
            source.reliability_score = _score_from_health(best_health, float(source.reliability_score or 80))
            source.completeness_score = min(
                100.0,
                float(source.completeness_score or 80) + (2.0 if best_health.get("healthy") else -5.0),
            )
            source.last_validated_at = datetime.now(timezone.utc)
            if best_health.get("healthy"):
                source.last_successful_fetch_at = datetime.now(timezone.utc)
                source.status = "Fetched Successfully"
            else:
                source.status = f"Validation failed: {best_health.get('error', 'unknown')}"

            logger.info(
                "source_validated",
                source_id=source.id,
                healthy=best_health.get("healthy"),
                reliability=source.reliability_score,
                status=source.status,
            )

        await session.commit()
    logger.info("validate_sources_complete", count=len(sources))


def main() -> None:
    asyncio.run(validate_sources())


if __name__ == "__main__":
    main()
