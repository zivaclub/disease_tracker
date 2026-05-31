from datetime import datetime

from app.api.schemas.responses import (
    AlertResponse,
    DataSourceResponse,
    DiseaseResponse,
    EtlLogResponse,
    KidsFriendlySymptom,
    NewsResponse,
    OutbreakResponse,
    VaccineResponse,
)
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


def _iso_date(dt: datetime | None) -> str:
    if dt is None:
        return datetime.utcnow().isoformat()
    return dt.isoformat()


def _date_only(value: str | None) -> str:
    if not value:
        return datetime.utcnow().strftime("%Y-%m-%d")
    return value.split("T")[0] if "T" in value else value


def map_kids_symptoms(raw: list | None) -> list[KidsFriendlySymptom]:
    if not raw:
        return []
    result: list[KidsFriendlySymptom] = []
    for item in raw:
        if isinstance(item, dict):
            result.append(
                KidsFriendlySymptom(
                    name=item.get("name", ""),
                    icon=item.get("icon", ""),
                    descriptor=item.get("descriptor", ""),
                )
            )
    return result


def map_disease(disease: Disease, education: DiseaseEducation | None = None) -> DiseaseResponse:
    edu = education or disease.education
    return DiseaseResponse(
        id=disease.id,
        name=disease.name,
        type=disease.disease_type,  # type: ignore[arg-type]
        firstDiscovered=disease.first_discovered or "",
        transmissionMethods=disease.transmission_methods or [],
        symptomsList=disease.symptoms_list or [],
        riskGroups=disease.risk_groups or [],
        treatmentMethods=disease.treatment_methods or [],
        vaccinationAvailable=disease.vaccination_available,
        mortalityRate=disease.mortality_rate or "",
        historicalOutbreaks=disease.historical_outbreaks or "",
        whatIsIt=(edu.what_is_it if edu else "") or "",
        howItSpreads=(edu.how_spreads if edu else "") or "",
        symptoms10YL=map_kids_symptoms(edu.symptoms_10yl if edu else []),
        staySafe10YL=(edu.stay_safe_10yl if edu else []) or [],
        isThereVaccine10YL=(edu.vaccine_info if edu else "") or "",
        whyCare10YL=(edu.why_care if edu else "") or "",
        whatToDoNow10YL=(edu.what_to_do_now if edu else []) or [],
        benefitsOfPrevention=(edu.benefits_of_prevention if edu else []) or [],
    )


def map_vaccine(vaccine: Vaccine) -> VaccineResponse:
    return VaccineResponse(
        diseaseId=vaccine.disease_id,
        diseaseName=vaccine.disease_name,
        vaccineName=vaccine.vaccine_name,
        available=vaccine.available,
        doses=vaccine.doses,
        ageRecommendation=vaccine.age_recommendation or "",
        boosterRequirements=vaccine.booster_requirements or "",
        effectiveness=vaccine.effectiveness or "",
        sideEffects=vaccine.side_effects or [],
        whoRecommendation=vaccine.who_recommendation or "",
        countryAvailability=vaccine.country_availability or "",
    )


def map_outbreak(outbreak: Outbreak) -> OutbreakResponse:
    return OutbreakResponse(
        id=outbreak.id,
        diseaseId=outbreak.disease_id,
        diseaseName=outbreak.disease_name,
        country=outbreak.country,
        region=outbreak.region,
        city=outbreak.city,
        cases=outbreak.cases,
        deaths=outbreak.deaths,
        recovered=outbreak.recovered,
        latitude=outbreak.latitude,
        longitude=outbreak.longitude,
        active=outbreak.active,
        firstDetected=_date_only(outbreak.first_detected),
        lastUpdated=_date_only(outbreak.last_updated),
        riskLevel=outbreak.risk_level,  # type: ignore[arg-type]
    )


def map_alert(alert: Alert) -> AlertResponse:
    return AlertResponse(
        id=alert.id,
        diseaseId=alert.disease_id,
        diseaseName=alert.disease_name,
        country=alert.country,
        title=alert.title,
        message=alert.message,
        riskScore=alert.risk_score,
        level=alert.level,  # type: ignore[arg-type]
        date=_iso_date(alert.date),
        isRead=alert.is_read,
    )


def map_data_source(source: DataSource) -> DataSourceResponse:
    return DataSourceResponse(
        id=source.id,
        name=source.name,
        type=source.source_type,  # type: ignore[arg-type]
        url=source.base_url,
        reliabilityScore=float(source.reliability_score),
        updateFrequency=source.update_frequency or "",
        completenessScore=float(source.completeness_score),
        active=source.is_active,
        status=source.status,
    )


def map_news_article(article: NewsArticle) -> NewsResponse:
    return NewsResponse(
        id=article.id,
        title=article.title,
        source=article.source,
        summary=article.summary or "",
        sentiment=article.sentiment or "Under Review",
        url=article.url or "",
        date=_iso_date(article.date),
        trustScore=article.trust_score,
    )


map_news = map_news_article


def map_etl_log(log: EtlLog) -> EtlLogResponse:
    return EtlLogResponse(
        id=log.id,
        timestamp=_iso_date(log.timestamp),
        stage=log.stage,  # type: ignore[arg-type]
        level=log.level,  # type: ignore[arg-type]
        message=log.message,
    )
