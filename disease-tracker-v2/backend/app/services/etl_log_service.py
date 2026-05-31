import secrets
from datetime import datetime, timezone

import structlog
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.schemas.responses import EtlLogResponse
from app.domain.models import EtlLog
from app.services.mappers import map_etl_log

logger = structlog.get_logger(__name__)

MAX_LOGS = 200


def _new_log_id() -> str:
    return f"log-{secrets.token_hex(5)}"


async def add_log(
    session: AsyncSession,
    *,
    stage: str,
    level: str,
    message: str,
    run_id: str | None = None,
    records_in: int | None = None,
    records_out: int | None = None,
) -> EtlLogResponse:
    log = EtlLog(
        id=_new_log_id(),
        timestamp=datetime.now(timezone.utc),
        stage=stage,
        level=level,
        message=message,
        run_id=run_id,
        records_in=records_in,
        records_out=records_out,
    )
    session.add(log)
    await session.flush()
    logger.info("etl_log_added", stage=stage, level=level, log_id=log.id)
    return map_etl_log(log)


async def list_logs(session: AsyncSession, *, limit: int = MAX_LOGS) -> list[EtlLogResponse]:
    result = await session.execute(
        select(EtlLog).order_by(EtlLog.timestamp.desc()).limit(min(limit, MAX_LOGS))
    )
    logs = result.scalars().all()
    return [map_etl_log(log) for log in logs]
