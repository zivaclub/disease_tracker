import structlog
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.schemas.responses import AlertResponse
from app.domain.models import Alert
from app.services.mappers import map_alert

logger = structlog.get_logger(__name__)


async def list_alerts(
    session: AsyncSession,
    *,
    unread_only: bool = False,
) -> list[AlertResponse]:
    stmt = select(Alert).where(Alert.is_active.is_(True)).order_by(Alert.date.desc())
    if unread_only:
        stmt = stmt.where(Alert.is_read.is_(False))
    result = await session.execute(stmt)
    alerts = result.scalars().all()
    return [map_alert(a) for a in alerts]


async def resolve_alert(session: AsyncSession, alert_id: str) -> AlertResponse | None:
    result = await session.execute(select(Alert).where(Alert.id == alert_id))
    alert = result.scalar_one_or_none()
    if alert is None:
        logger.warning("alert_not_found", alert_id=alert_id)
        return None
    alert.is_read = True
    await session.flush()
    logger.info("alert_resolved", alert_id=alert_id)
    return map_alert(alert)
