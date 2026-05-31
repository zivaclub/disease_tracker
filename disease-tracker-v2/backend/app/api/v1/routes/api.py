import secrets
import time
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.ai.gemini_service import explain_outbreak, predict_risk
from app.analytics.early_warning import run_early_warning_assessment
from app.api.schemas.responses import (
    AiExplainResponse,
    AlertResponse,
    DataSourceResponse,
    DiseaseResponse,
    EtlLogResponse,
    GlobalStatsResponse,
    HealthResponse,
    MapPointResponse,
    NewsResponse,
    OutbreakResponse,
    RiskPredictionResponse,
    VaccineResponse,
)
from app.core.config import settings
from app.core.database import get_db
from app.domain.models import Alert, DataSource, Disease, EtlLog, NewsArticle, Outbreak, Vaccine
from app.services.alert_service import list_alerts, resolve_alert
from app.services.disease_service import get_disease_by_id, list_diseases
from app.services.etl_log_service import list_logs
from app.services.mappers import (
    map_alert,
    map_data_source,
    map_disease,
    map_etl_log,
    map_news,
    map_outbreak,
    map_vaccine,
)
from app.services.outbreak_service import add_outbreak, list_outbreaks, update_cases
from etl.pipeline import EtlPipeline

limiter = Limiter(key_func=get_remote_address)
router = APIRouter()


class ResolveAlertBody(BaseModel):
    id: str


class AddOutbreakBody(BaseModel):
    diseaseId: str
    country: str
    region: str | None = "All"
    city: str | None = "Metropolitan Block"
    cases: int
    deaths: int
    recovered: int | None = 0
    latitude: float | None = 0
    longitude: float | None = 0
    riskLevel: str | None = "Medium"


class UpdateCasesBody(BaseModel):
    id: str
    cases: int | None = None
    deaths: int | None = None
    recovered: int | None = None
    riskLevel: str | None = None


class ExplainBody(BaseModel):
    outbreakId: str
    customPrompt: str | None = None


class PredictRiskBody(BaseModel):
    country: str
    age: int = Field(ge=1, le=120)
    habits: str | None = None


@router.get("/health", response_model=HealthResponse)
async def health(db: Annotated[AsyncSession, Depends(get_db)]) -> HealthResponse:
    diseases_count = await db.scalar(select(func.count(Disease.id)))
    outbreaks_count = await db.scalar(select(func.count(Outbreak.id)))
    active_alerts = await db.scalar(
        select(func.count(Alert.id)).where(Alert.is_read.is_(False))
    )
    try:
        import resource

        usage = resource.getrusage(resource.RUSAGE_SELF)
        heap_mb = int(usage.ru_maxrss / 1024)
    except Exception:
        heap_mb = 0
    return HealthResponse(
        status="healthy",
        timestamp=__import__("datetime").datetime.utcnow().isoformat(),
        uptime=time.process_time(),
        database={
            "diseasesCount": diseases_count or 0,
            "outbreaksCount": outbreaks_count or 0,
            "activeAlerts": active_alerts or 0,
        },
        systemMetrics={"heapUsedMb": heap_mb, "heapTotalMb": heap_mb},
    )


@router.get("/sources", response_model=list[DataSourceResponse])
async def get_sources(db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(select(DataSource).order_by(DataSource.reliability_score.desc()))
    return [map_data_source(s) for s in result.scalars().all()]


@router.get("/diseases", response_model=list[DiseaseResponse])
async def get_diseases(db: Annotated[AsyncSession, Depends(get_db)]):
    return await list_diseases(db)


@router.get("/diseases/{disease_id}", response_model=DiseaseResponse)
async def get_disease(disease_id: str, db: Annotated[AsyncSession, Depends(get_db)]):
    disease = await get_disease_by_id(db, disease_id)
    if not disease:
        raise HTTPException(404, "Disease profile not found")
    return map_disease(disease)


@router.get("/vaccines", response_model=list[VaccineResponse])
async def get_vaccines(db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(select(Vaccine))
    return [map_vaccine(v) for v in result.scalars().all()]


@router.get("/outbreaks", response_model=list[OutbreakResponse])
async def get_outbreaks(db: Annotated[AsyncSession, Depends(get_db)]):
    return await list_outbreaks(db)


@router.get("/alerts", response_model=list[AlertResponse])
async def get_alerts(db: Annotated[AsyncSession, Depends(get_db)]):
    return await list_alerts(db)


@router.post("/alerts/resolve")
async def post_resolve_alert(body: ResolveAlertBody, db: Annotated[AsyncSession, Depends(get_db)]):
    alert = await resolve_alert(db, body.id)
    if not alert:
        raise HTTPException(404, "Alert reference not found")
    return {"status": "success", "alert": map_alert(alert)}


@router.get("/news", response_model=list[NewsResponse])
async def get_news(db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(select(NewsArticle).order_by(NewsArticle.date.desc()).limit(100))
    return [map_news(n) for n in result.scalars().all()]


@router.get("/etl-logs", response_model=list[EtlLogResponse])
async def get_etl_logs(db: Annotated[AsyncSession, Depends(get_db)]):
    logs = await list_logs(db)
    return [map_etl_log(log) for log in logs]


@router.post("/outbreaks/add")
async def post_add_outbreak(body: AddOutbreakBody, db: Annotated[AsyncSession, Depends(get_db)]):
    outbreak = await add_outbreak(db, body.model_dump())
    if not outbreak:
        raise HTTPException(404, "Target disease profile not recognized")
    await run_early_warning_assessment(db)
    return {"status": "success", "outbreak": map_outbreak(outbreak)}


@router.post("/outbreaks/update-cases")
async def post_update_cases(body: UpdateCasesBody, db: Annotated[AsyncSession, Depends(get_db)]):
    outbreak = await update_cases(db, body.model_dump())
    if not outbreak:
        raise HTTPException(404, "Outbreak reference not found")
    await run_early_warning_assessment(db)
    return {"status": "success", "outbreak": map_outbreak(outbreak)}


@router.post("/etl/run")
@limiter.limit("10/minute")
async def post_etl_run(request: Request, db: Annotated[AsyncSession, Depends(get_db)]):
    pipeline = EtlPipeline(db)
    result = await pipeline.run()
    return {
        "status": "success",
        "runId": result.run_id,
        "recordsIn": result.records_in,
        "recordsStored": result.records_stored,
        "articlesAdded": result.articles_added,
        "outbreaksAdded": result.outbreaks_added,
        "activeOutbreaksCount": await db.scalar(select(func.count(Outbreak.id))),
        "timestamp": __import__("datetime").datetime.utcnow().isoformat(),
    }


@router.post("/ai/explain-outbreak", response_model=AiExplainResponse)
@limiter.limit("20/minute")
async def post_explain_outbreak(
    request: Request,
    body: ExplainBody,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    outbreak = await db.get(Outbreak, body.outbreakId)
    if not outbreak:
        raise HTTPException(400, "Invalid outbreak reference requested")
    disease = await get_disease_by_id(db, outbreak.disease_id)
    if not disease:
        raise HTTPException(400, "Invalid outbreak reference requested")
    result = await explain_outbreak(disease, outbreak, body.customPrompt)  # type: ignore[arg-type]
    return AiExplainResponse(**result)


@router.post("/ai/predict-risk", response_model=RiskPredictionResponse)
@limiter.limit("20/minute")
async def post_predict_risk(
    request: Request,
    body: PredictRiskBody,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    ob_result = await db.execute(
        select(Outbreak).where(
            Outbreak.country.ilike(body.country),
            Outbreak.active.is_(True),
        )
    )
    outbreaks = list(ob_result.scalars().all())
    alert_result = await db.execute(
        select(Alert).where(
            Alert.country.ilike(body.country),
            Alert.is_read.is_(False),
        )
    )
    alerts = list(alert_result.scalars().all())
    result = await predict_risk(body.country, body.age, body.habits, outbreaks, alerts)
    return RiskPredictionResponse(**result)


# --- v1 extended endpoints ---

v1_router = APIRouter()


@v1_router.get("/stats/global", response_model=GlobalStatsResponse)
async def global_stats(db: Annotated[AsyncSession, Depends(get_db)]):
    ob_result = await db.execute(select(Outbreak).where(Outbreak.active.is_(True)))
    active = list(ob_result.scalars().all())
    countries = {o.country for o in active}
    vaccines = await db.scalar(
        select(func.count(Vaccine.id)).where(Vaccine.available.is_(True))
    )
    alert_count = await db.scalar(
        select(func.count(Alert.id)).where(Alert.is_read.is_(False), Alert.is_active.is_(True))
    )
    return GlobalStatsResponse(
        totalActiveCases=sum(o.cases for o in active),
        countriesAffected=len(countries),
        vaccinesAvailable=vaccines or 0,
        activeAlerts=alert_count or 0,
    )


@v1_router.get("/maps/heatmap", response_model=list[MapPointResponse])
async def map_heatmap(db: Annotated[AsyncSession, Depends(get_db)], disease_id: str | None = None):
    query = select(Outbreak).where(Outbreak.active.is_(True))
    if disease_id:
        query = query.where(Outbreak.disease_id == disease_id)
    result = await db.execute(query)
    return [
        MapPointResponse(
            latitude=o.latitude,
            longitude=o.longitude,
            cases=o.cases,
            diseaseId=o.disease_id,
            diseaseName=o.disease_name,
            country=o.country,
            riskLevel=o.risk_level,
        )
        for o in result.scalars().all()
    ]


@v1_router.get("/maps/risk")
async def map_risk(db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(
        select(Outbreak.country, Outbreak.risk_level, func.sum(Outbreak.cases).label("cases"))
        .where(Outbreak.active.is_(True))
        .group_by(Outbreak.country, Outbreak.risk_level)
    )
    return [
        {"country": row.country, "riskLevel": row.risk_level, "cases": int(row.cases or 0)}
        for row in result.all()
    ]


@v1_router.post("/admin/sources/validate")
async def admin_validate_sources(db: Annotated[AsyncSession, Depends(get_db)]):
    import subprocess
    import sys

    subprocess.run([sys.executable, "scripts/validate_sources.py"], cwd=str(__import__("pathlib").Path(__file__).resolve().parents[3]), check=False)
    result = await db.execute(select(DataSource))
    return {"status": "success", "sources": [map_data_source(s) for s in result.scalars().all()]}
