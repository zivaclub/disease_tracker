import uuid
from datetime import date, datetime
from enum import Enum

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    JSON,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

JsonType = JSON().with_variant(JSONB, "postgresql")


class Base(DeclarativeBase):
    pass


class RiskLevel(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"


class DiseaseType(str, Enum):
    VIRUS = "Virus"
    BACTERIA = "Bacteria"
    FUNGUS = "Fungus"
    PARASITE = "Parasite"


class SourceType(str, Enum):
    API = "API"
    RSS = "RSS"
    SCRAPER = "Web Scraping"
    DATASET = "Dataset"


class UserRole(str, Enum):
    VIEWER = "viewer"
    EDITOR = "editor"
    ADMIN = "admin"
    RESEARCHER = "researcher"


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), default=UserRole.VIEWER.value)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Country(Base):
    __tablename__ = "countries"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    iso_code: Mapped[str] = mapped_column(String(2), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    continent: Mapped[str | None] = mapped_column(String(50))
    latitude: Mapped[float | None] = mapped_column(Float)
    longitude: Mapped[float | None] = mapped_column(Float)


class Disease(Base):
    __tablename__ = "diseases"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    disease_type: Mapped[str] = mapped_column(String(50), nullable=False)
    pathogen: Mapped[str | None] = mapped_column(String(255))
    first_discovered: Mapped[str | None] = mapped_column(String(255))
    transmission_methods: Mapped[list] = mapped_column(JsonType, default=list)
    symptoms_list: Mapped[list] = mapped_column(JsonType, default=list)
    risk_groups: Mapped[list] = mapped_column(JsonType, default=list)
    treatment_methods: Mapped[list] = mapped_column(JsonType, default=list)
    vaccination_available: Mapped[bool] = mapped_column(Boolean, default=False)
    mortality_rate: Mapped[str | None] = mapped_column(String(100))
    historical_outbreaks: Mapped[str | None] = mapped_column(Text)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    education: Mapped["DiseaseEducation | None"] = relationship(back_populates="disease", uselist=False)
    vaccines: Mapped[list["Vaccine"]] = relationship(back_populates="disease")
    outbreaks: Mapped[list["Outbreak"]] = relationship(back_populates="disease")


class DiseaseEducation(Base):
    __tablename__ = "disease_education"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    disease_id: Mapped[str] = mapped_column(ForeignKey("diseases.id"), unique=True)
    what_is_it: Mapped[str | None] = mapped_column(Text)
    how_spreads: Mapped[str | None] = mapped_column(Text)
    symptoms_10yl: Mapped[list] = mapped_column(JsonType, default=list)
    stay_safe_10yl: Mapped[list] = mapped_column(JsonType, default=list)
    vaccine_info: Mapped[str | None] = mapped_column(Text)
    why_care: Mapped[str | None] = mapped_column(Text)
    what_to_do_now: Mapped[list] = mapped_column(JsonType, default=list)
    benefits_of_prevention: Mapped[list] = mapped_column(JsonType, default=list)
    reviewed: Mapped[bool] = mapped_column(Boolean, default=True)

    disease: Mapped["Disease"] = relationship(back_populates="education")


class Vaccine(Base):
    __tablename__ = "vaccines"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    disease_id: Mapped[str] = mapped_column(ForeignKey("diseases.id"))
    disease_name: Mapped[str] = mapped_column(String(255))
    vaccine_name: Mapped[str] = mapped_column(String(255))
    available: Mapped[bool] = mapped_column(Boolean, default=True)
    doses: Mapped[int] = mapped_column(Integer, default=1)
    age_recommendation: Mapped[str | None] = mapped_column(String(100))
    booster_requirements: Mapped[str | None] = mapped_column(String(255))
    effectiveness: Mapped[str | None] = mapped_column(String(100))
    side_effects: Mapped[list] = mapped_column(JsonType, default=list)
    who_recommendation: Mapped[str | None] = mapped_column(Text)
    country_availability: Mapped[str | None] = mapped_column(String(255))

    disease: Mapped["Disease"] = relationship(back_populates="vaccines")


class DataSource(Base):
    __tablename__ = "data_sources"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    source_type: Mapped[str] = mapped_column(String(50), nullable=False)
    base_url: Mapped[str] = mapped_column(Text)
    reliability_score: Mapped[float] = mapped_column(Float, default=0)
    update_frequency: Mapped[str | None] = mapped_column(String(50))
    completeness_score: Mapped[float] = mapped_column(Float, default=0)
    last_validated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    last_successful_fetch_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    status: Mapped[str] = mapped_column(String(100), default="Unknown")
    access_restrictions: Mapped[str | None] = mapped_column(Text)
    license: Mapped[str | None] = mapped_column(String(100))
    validation_metadata: Mapped[dict] = mapped_column(JsonType, default=dict)


class Outbreak(Base):
    __tablename__ = "outbreaks"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    disease_id: Mapped[str] = mapped_column(ForeignKey("diseases.id"))
    disease_name: Mapped[str] = mapped_column(String(255))
    country: Mapped[str] = mapped_column(String(255))
    region: Mapped[str] = mapped_column(String(255), default="All")
    city: Mapped[str] = mapped_column(String(255), default="")
    cases: Mapped[int] = mapped_column(Integer, default=0)
    deaths: Mapped[int] = mapped_column(Integer, default=0)
    recovered: Mapped[int] = mapped_column(Integer, default=0)
    latitude: Mapped[float] = mapped_column(Float, default=0.0)
    longitude: Mapped[float] = mapped_column(Float, default=0.0)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    first_detected: Mapped[str | None] = mapped_column(String(20))
    last_updated: Mapped[str | None] = mapped_column(String(20))
    risk_level: Mapped[str] = mapped_column(String(20), default=RiskLevel.MEDIUM.value)
    external_id: Mapped[str | None] = mapped_column(String(255))
    source_id: Mapped[str | None] = mapped_column(ForeignKey("data_sources.id"))
    title: Mapped[str | None] = mapped_column(String(500))
    summary: Mapped[str | None] = mapped_column(Text)

    disease: Mapped["Disease"] = relationship(back_populates="outbreaks")


class Alert(Base):
    __tablename__ = "alerts"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    disease_id: Mapped[str] = mapped_column(ForeignKey("diseases.id"))
    disease_name: Mapped[str] = mapped_column(String(255))
    country: Mapped[str] = mapped_column(String(255))
    title: Mapped[str] = mapped_column(String(255))
    message: Mapped[str] = mapped_column(Text)
    message_10yl: Mapped[str | None] = mapped_column(Text)
    risk_score: Mapped[int] = mapped_column(Integer, default=0)
    level: Mapped[str] = mapped_column(String(20))
    date: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    recommended_actions: Mapped[list] = mapped_column(JsonType, default=list)


class NewsArticle(Base):
    __tablename__ = "articles"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    title: Mapped[str] = mapped_column(String(500))
    source: Mapped[str] = mapped_column(String(255))
    summary: Mapped[str | None] = mapped_column(Text)
    summary_10yl: Mapped[str | None] = mapped_column(Text)
    sentiment: Mapped[str | None] = mapped_column(String(50))
    url: Mapped[str | None] = mapped_column(Text)
    date: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    trust_score: Mapped[int] = mapped_column(Integer, default=80)
    disease_id: Mapped[str | None] = mapped_column(ForeignKey("diseases.id"))
    source_id: Mapped[str | None] = mapped_column(ForeignKey("data_sources.id"))
    content_hash: Mapped[str | None] = mapped_column(String(64), unique=True)


class EtlLog(Base):
    __tablename__ = "etl_logs"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    stage: Mapped[str] = mapped_column(String(50))
    level: Mapped[str] = mapped_column(String(20), default="INFO")
    message: Mapped[str] = mapped_column(Text)
    run_id: Mapped[str | None] = mapped_column(String(64))
    records_in: Mapped[int | None] = mapped_column(Integer)
    records_out: Mapped[int | None] = mapped_column(Integer)


class RawIngestion(Base):
    __tablename__ = "raw_ingestions"
    __table_args__ = (UniqueConstraint("source_id", "external_id", "content_hash"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_id: Mapped[str] = mapped_column(ForeignKey("data_sources.id"))
    external_id: Mapped[str] = mapped_column(String(255))
    content_hash: Mapped[str] = mapped_column(String(64))
    payload: Mapped[dict] = mapped_column(JsonType)
    ingested_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class RiskScore(Base):
    __tablename__ = "risk_scores"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    disease_id: Mapped[str] = mapped_column(ForeignKey("diseases.id"))
    country: Mapped[str] = mapped_column(String(255))
    score: Mapped[float] = mapped_column(Float)
    risk_level: Mapped[str] = mapped_column(String(20))
    factors: Mapped[dict] = mapped_column(JsonType, default=dict)
    calculated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id"))
    action: Mapped[str] = mapped_column(String(100))
    entity_type: Mapped[str | None] = mapped_column(String(100))
    entity_id: Mapped[str | None] = mapped_column(String(64))
    details: Mapped[dict] = mapped_column(JsonType, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
