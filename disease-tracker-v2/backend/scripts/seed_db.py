#!/usr/bin/env python3
"""Seed the database from ../scripts/seed_data.json or a minimal built-in dataset."""

import asyncio
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

import structlog

# Allow running as `python scripts/seed_db.py` from backend/
BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from sqlalchemy import select

from app.core.database import async_session_factory, init_db
from app.core.logging import configure_logging
from app.domain.models import (
    Alert,
    DataSource,
    Disease,
    DiseaseEducation,
    EtlLog,
    NewsArticle,
    Outbreak,
    Vaccine,
)

configure_logging()
logger = structlog.get_logger(__name__)

SEED_JSON = BACKEND_ROOT / "scripts" / "seed_data.json"
if not SEED_JSON.is_file():
    SEED_JSON = BACKEND_ROOT.parent / "scripts" / "seed_data.json"


def _minimal_seed() -> dict:
    return {
        "diseases": [
            {
                "id": "covid-19",
                "name": "COVID-19 (Coronavirus)",
                "type": "Virus",
                "firstDiscovered": "2019 in Wuhan, China",
                "transmissionMethods": ["Airborne droplets"],
                "symptomsList": ["Fever", "Cough"],
                "riskGroups": ["Older adults"],
                "treatmentMethods": ["Supportive care"],
                "vaccinationAvailable": True,
                "mortalityRate": "0.5% - 1.2%",
                "historicalOutbreaks": "Global pandemic 2019+",
                "whatIsIt": "A coronavirus illness.",
                "howItSpreads": "Through respiratory droplets.",
                "symptoms10YL": [],
                "staySafe10YL": ["Wash hands often"],
                "isThereVaccine10YL": "Yes, vaccines are available.",
                "whyCare10YL": "Protect vulnerable family members.",
                "whatToDoNow10YL": ["Stay home if sick"],
                "benefitsOfPrevention": ["Fewer missed school days"],
            },
            {
                "id": "dengue",
                "name": "Dengue Fever",
                "type": "Virus",
                "firstDiscovered": "1779",
                "transmissionMethods": ["Mosquito bites"],
                "symptomsList": ["Fever", "Joint pain"],
                "riskGroups": ["Children"],
                "treatmentMethods": ["Fluids", "Rest"],
                "vaccinationAvailable": True,
                "mortalityRate": "< 1% if treated",
                "historicalOutbreaks": "Tropical seasonal surges",
                "whatIsIt": "A mosquito-borne fever.",
                "howItSpreads": "Aedes mosquito bites.",
                "symptoms10YL": [],
                "staySafe10YL": ["Remove standing water"],
                "isThereVaccine10YL": "Yes in endemic regions.",
                "whyCare10YL": "Prevent severe dengue.",
                "whatToDoNow10YL": ["Use repellent"],
                "benefitsOfPrevention": ["Safer outdoor play"],
            },
            {
                "id": "nipah",
                "name": "Nipah Virus Infection",
                "type": "Virus",
                "firstDiscovered": "1998 Malaysia",
                "transmissionMethods": ["Bats", "Close contact"],
                "symptomsList": ["Fever", "Encephalitis"],
                "riskGroups": ["Healthcare workers"],
                "treatmentMethods": ["Supportive care"],
                "vaccinationAvailable": False,
                "mortalityRate": "40% - 75%",
                "historicalOutbreaks": "Periodic South Asia outbreaks",
                "whatIsIt": "A rare bat-borne virus.",
                "howItSpreads": "Contact with infected persons or bats.",
                "symptoms10YL": [],
                "staySafe10YL": ["Avoid raw date palm sap"],
                "isThereVaccine10YL": "Research vaccines in trials.",
                "whyCare10YL": "High severity when outbreaks occur.",
                "whatToDoNow10YL": ["Report unusual fever clusters"],
                "benefitsOfPrevention": ["Protect communities"],
            },
        ],
        "vaccines": [],
        "outbreaks": [
            {
                "id": "ob-seed-1",
                "diseaseId": "nipah",
                "diseaseName": "Nipah Virus Infection",
                "country": "India",
                "region": "Kerala",
                "city": "Kozhikode",
                "cases": 14,
                "deaths": 2,
                "recovered": 5,
                "latitude": 11.2588,
                "longitude": 75.7804,
                "active": True,
                "firstDetected": "2026-05-28",
                "lastUpdated": "2026-06-01",
                "riskLevel": "Critical",
            }
        ],
        "sources": [
            {
                "id": "who-don",
                "name": "WHO Disease Outbreak News",
                "type": "API",
                "url": "https://www.who.int/api/news/diseaseoutbreaknews",
                "reliabilityScore": 98,
                "updateFrequency": "Daily",
                "completenessScore": 95,
                "active": True,
                "status": "Pending validation",
            }
        ],
        "news": [],
        "alerts": [
            {
                "id": "al-seed-1",
                "diseaseId": "nipah",
                "diseaseName": "Nipah Virus Infection",
                "country": "India",
                "title": "Critical Warning: Kozhikode District Alert",
                "message": "Unusual fever cases suspected; strict precautions issued.",
                "riskScore": 89,
                "level": "Critical",
                "date": datetime.now(timezone.utc).isoformat(),
                "isRead": False,
            }
        ],
        "etlLogs": [
            {
                "id": "log-seed-1",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "stage": "ETL Pipeline",
                "level": "INFO",
                "message": "Database seeded with minimal baseline dataset.",
            }
        ],
    }


def _load_seed_data() -> dict:
    if SEED_JSON.is_file():
        logger.info("loading_seed_json", path=str(SEED_JSON))
        with SEED_JSON.open(encoding="utf-8") as fh:
            data = json.load(fh)
        data.setdefault("alerts", [])
        data.setdefault("etlLogs", [])
        return data
    logger.warning("seed_json_missing", path=str(SEED_JSON), fallback="minimal")
    return _minimal_seed()


def _parse_dt(value: str | None) -> datetime:
    if not value:
        return datetime.now(timezone.utc)
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return datetime.now(timezone.utc)


async def seed() -> None:
    await init_db()
    data = _load_seed_data()

    async with async_session_factory() as session:
        existing = await session.execute(select(Disease.id).limit(1))
        if existing.scalar_one_or_none():
            logger.info("database_already_seeded")
            return

        for item in data.get("diseases", []):
            disease = Disease(
                id=item["id"],
                name=item["name"],
                slug=item["id"],
                disease_type=item["type"],
                first_discovered=item.get("firstDiscovered"),
                transmission_methods=item.get("transmissionMethods", []),
                symptoms_list=item.get("symptomsList", []),
                risk_groups=item.get("riskGroups", []),
                treatment_methods=item.get("treatmentMethods", []),
                vaccination_available=item.get("vaccinationAvailable", False),
                mortality_rate=item.get("mortalityRate"),
                historical_outbreaks=item.get("historicalOutbreaks"),
            )
            session.add(disease)
            session.add(
                DiseaseEducation(
                    disease_id=item["id"],
                    what_is_it=item.get("whatIsIt"),
                    how_spreads=item.get("howItSpreads"),
                    symptoms_10yl=item.get("symptoms10YL", []),
                    stay_safe_10yl=item.get("staySafe10YL", []),
                    vaccine_info=item.get("isThereVaccine10YL"),
                    why_care=item.get("whyCare10YL"),
                    what_to_do_now=item.get("whatToDoNow10YL", []),
                    benefits_of_prevention=item.get("benefitsOfPrevention", []),
                )
            )

        await session.flush()
        disease_ids = {item["id"] for item in data.get("diseases", [])}

        for item in data.get("vaccines", []):
            if item.get("diseaseId") not in disease_ids:
                continue
            session.add(
                Vaccine(
                    disease_id=item["diseaseId"],
                    disease_name=item["diseaseName"],
                    vaccine_name=item["vaccineName"],
                    available=item.get("available", True),
                    doses=item.get("doses", 1),
                    age_recommendation=item.get("ageRecommendation"),
                    booster_requirements=item.get("boosterRequirements"),
                    effectiveness=item.get("effectiveness"),
                    side_effects=item.get("sideEffects", []),
                    who_recommendation=item.get("whoRecommendation"),
                    country_availability=item.get("countryAvailability"),
                )
            )

        for item in data.get("sources", []):
            session.add(
                DataSource(
                    id=item["id"],
                    name=item["name"],
                    source_type=item["type"],
                    base_url=item["url"],
                    reliability_score=float(item.get("reliabilityScore", 0)),
                    update_frequency=item.get("updateFrequency"),
                    completeness_score=float(item.get("completenessScore", 0)),
                    is_active=item.get("active", True),
                    status=item.get("status", "Unknown"),
                )
            )

        await session.flush()

        for item in data.get("outbreaks", []):
            if item.get("diseaseId") not in disease_ids:
                continue
            session.add(
                Outbreak(
                    id=item["id"],
                    disease_id=item["diseaseId"],
                    disease_name=item["diseaseName"],
                    country=item["country"],
                    region=item.get("region", "All"),
                    city=item.get("city", ""),
                    cases=item.get("cases", 0),
                    deaths=item.get("deaths", 0),
                    recovered=item.get("recovered", 0),
                    latitude=item.get("latitude", 0.0),
                    longitude=item.get("longitude", 0.0),
                    active=item.get("active", True),
                    first_detected=item.get("firstDetected"),
                    last_updated=item.get("lastUpdated"),
                    risk_level=item.get("riskLevel", "Medium"),
                )
            )

        for item in data.get("news", []):
            session.add(
                NewsArticle(
                    id=item["id"],
                    title=item["title"],
                    source=item["source"],
                    summary=item.get("summary"),
                    sentiment=item.get("sentiment"),
                    url=item.get("url"),
                    date=_parse_dt(item.get("date")),
                    trust_score=item.get("trustScore", 80),
                )
            )

        for item in data.get("alerts", []):
            if item.get("diseaseId") not in disease_ids:
                continue
            session.add(
                Alert(
                    id=item["id"],
                    disease_id=item["diseaseId"],
                    disease_name=item["diseaseName"],
                    country=item["country"],
                    title=item["title"],
                    message=item["message"],
                    risk_score=item.get("riskScore", 0),
                    level=item["level"],
                    date=_parse_dt(item.get("date")),
                    is_read=item.get("isRead", False),
                )
            )

        for item in data.get("etlLogs", []):
            session.add(
                EtlLog(
                    id=item["id"],
                    timestamp=_parse_dt(item.get("timestamp")),
                    stage=item["stage"],
                    level=item.get("level", "INFO"),
                    message=item["message"],
                )
            )

        await session.commit()
        logger.info(
            "seed_complete",
            diseases=len(data.get("diseases", [])),
            outbreaks=len(data.get("outbreaks", [])),
        )


def main() -> None:
    asyncio.run(seed())


if __name__ == "__main__":
    main()
