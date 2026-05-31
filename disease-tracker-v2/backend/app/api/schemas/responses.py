from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field


class KidsFriendlySymptom(BaseModel):
    name: str
    icon: str
    descriptor: str


DiseaseType = Literal["Virus", "Bacteria", "Fungus", "Parasite"]
RiskLevel = Literal["Low", "Medium", "High", "Critical"]
SourceType = Literal["API", "RSS", "Web Scraping", "Dataset"]
EtlStage = Literal["Discovery", "Validation", "Scraping", "ETL Pipeline", "Warning Engine"]
LogLevel = Literal["INFO", "WARNING", "ERROR"]


class DiseaseResponse(BaseModel):
    id: str
    name: str
    type: DiseaseType
    firstDiscovered: str
    transmissionMethods: list[str]
    symptomsList: list[str]
    riskGroups: list[str]
    treatmentMethods: list[str]
    vaccinationAvailable: bool
    mortalityRate: str
    historicalOutbreaks: str
    whatIsIt: str
    howItSpreads: str
    symptoms10YL: list[KidsFriendlySymptom]
    staySafe10YL: list[str]
    isThereVaccine10YL: str
    whyCare10YL: str
    whatToDoNow10YL: list[str]
    benefitsOfPrevention: list[str]


class VaccineResponse(BaseModel):
    diseaseId: str
    diseaseName: str
    vaccineName: str
    available: bool
    doses: int
    ageRecommendation: str
    boosterRequirements: str
    effectiveness: str
    sideEffects: list[str]
    whoRecommendation: str
    countryAvailability: str


class OutbreakResponse(BaseModel):
    id: str
    diseaseId: str
    diseaseName: str
    country: str
    region: str
    city: str
    cases: int
    deaths: int
    recovered: int
    latitude: float
    longitude: float
    active: bool
    firstDetected: str
    lastUpdated: str
    riskLevel: RiskLevel


class AlertResponse(BaseModel):
    id: str
    diseaseId: str
    diseaseName: str
    country: str
    title: str
    message: str
    riskScore: int = Field(ge=0, le=100)
    level: RiskLevel
    date: str
    isRead: bool


class DataSourceResponse(BaseModel):
    id: str
    name: str
    type: SourceType
    url: str
    reliabilityScore: float = Field(ge=0, le=100)
    updateFrequency: str
    completenessScore: float = Field(ge=0, le=100)
    active: bool
    status: str


class NewsResponse(BaseModel):
    id: str
    title: str
    source: str
    summary: str
    sentiment: str
    url: str
    date: str
    trustScore: int = Field(ge=0, le=100)


class EtlLogResponse(BaseModel):
    id: str
    timestamp: str
    stage: EtlStage
    level: LogLevel
    message: str


# Aliases matching frontend TypeScript export names
Disease = DiseaseResponse
VaccineDetails = VaccineResponse
Outbreak = OutbreakResponse
DiseaseAlert = AlertResponse
DataSource = DataSourceResponse
NewsArticle = NewsResponse
EtlLog = EtlLogResponse


class HealthResponse(BaseModel):
    status: str
    timestamp: str
    uptime: float
    database: dict[str, Any]
    systemMetrics: dict[str, int]


class GlobalStatsResponse(BaseModel):
    totalActiveCases: int
    countriesAffected: int
    vaccinesAvailable: int
    activeAlerts: int


class MapPointResponse(BaseModel):
    latitude: float
    longitude: float
    cases: int
    diseaseId: str
    diseaseName: str
    country: str
    riskLevel: str


class RiskPredictionResponse(BaseModel):
    riskLevel: str
    explanation: str
    actionSteps: list[str]


class AiExplainResponse(BaseModel):
    summary: str
    isSimulated: bool = False
    error: str | None = None
