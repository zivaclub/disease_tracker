"""Early Warning Evaluation Engine — ported from v1 server.ts."""

import secrets

import structlog
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models import Alert, Outbreak
from app.services.etl_log_service import add_log

logger = structlog.get_logger(__name__)

RiskLevel = str  # "Low" | "Medium" | "High" | "Critical"


def _compute_risk_score(outbreak: Outbreak) -> tuple[int, RiskLevel]:
    mortality_ratio = (outbreak.deaths / outbreak.cases) if outbreak.cases > 0 else 0.0

    risk_score = 0
    if outbreak.cases > 10000:
        risk_score += 30
    elif outbreak.cases > 500:
        risk_score += 15
    else:
        risk_score += 5

    if mortality_ratio > 0.40:
        risk_score += 40
    elif mortality_ratio > 0.10:
        risk_score += 25
    elif mortality_ratio > 0.01:
        risk_score += 15

    if outbreak.risk_level == "Critical":
        risk_score += 30
    elif outbreak.risk_level == "High":
        risk_score += 20
    elif outbreak.risk_level == "Medium":
        risk_score += 10

    risk_score = min(100, max(10, risk_score))

    level: RiskLevel = "Low"
    if risk_score >= 80:
        level = "Critical"
    elif risk_score >= 60:
        level = "High"
    elif risk_score >= 35:
        level = "Medium"

    return risk_score, level


async def run_early_warning_assessment(session: AsyncSession) -> int:
    """Analyze all outbreaks and create alerts when thresholds are met. Returns count added."""
    await add_log(
        session,
        stage="Warning Engine",
        level="INFO",
        message="Initiated Early Warning System assessment across all global records.",
    )

    result = await session.execute(select(Outbreak).where(Outbreak.active.is_(True)))
    outbreaks = result.scalars().all()

    alerts_result = await session.execute(select(Alert).where(Alert.is_active.is_(True)))
    existing_alerts = alerts_result.scalars().all()

    alerts_added = 0

    for ob in outbreaks:
        risk_score, level = _compute_risk_score(ob)
        if level == "Low":
            continue

        duplicate = next(
            (
                a
                for a in existing_alerts
                if a.disease_id == ob.disease_id
                and a.country == ob.country
                and a.level == level
            ),
            None,
        )
        if duplicate is not None:
            continue

        location_label = ob.city or ob.country
        title = f"{level} Outbreak Alert: {ob.disease_name} in {location_label}"
        message = (
            f"An early warning flag was triggered! Detected {ob.cases:,} cases with a "
            f"calculated severity score of {risk_score}/100. Local public health response "
            "is highly advised."
        )

        new_alert = Alert(
            id=f"al-{secrets.token_hex(5)}",
            disease_id=ob.disease_id,
            disease_name=ob.disease_name,
            country=ob.country,
            title=title,
            message=message,
            risk_score=risk_score,
            level=level,
            is_read=False,
            is_active=True,
        )
        session.add(new_alert)
        existing_alerts.append(new_alert)
        alerts_added += 1

        log_level = "WARNING" if level in ("Critical", "High") else "INFO"
        await add_log(
            session,
            stage="Warning Engine",
            level=log_level,
            message=f"New early warning alert generated: {title}",
        )

    await session.flush()
    logger.info("early_warning_complete", alerts_added=alerts_added, outbreaks=len(outbreaks))
    return alerts_added
