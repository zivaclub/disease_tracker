import os

# Use in-memory SQLite for tests before app imports
os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///:memory:")

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.database import get_db
from app.domain.models import Base
from app.main import app

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest_asyncio.fixture
async def db_session():
    engine = create_async_engine(TEST_DATABASE_URL, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with session_factory() as session:
        yield session
    await engine.dispose()


@pytest_asyncio.fixture
async def client(db_session):
    async def override_get_db():
        try:
            yield db_session
            await db_session.commit()
        except Exception:
            await db_session.rollback()
            raise

    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_root(client):
    response = await client.get("/")
    assert response.status_code == 200
    assert response.json()["version"] == "2.0.0"


@pytest.mark.asyncio
async def test_health(client):
    response = await client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


@pytest.mark.asyncio
async def test_diseases_empty(client):
    response = await client.get("/api/diseases")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_classify_dengue():
    from etl.classifiers import classify_text

    result = classify_text("Dengue fever outbreak in Brazil")
    assert result.disease_slug == "dengue"
    assert result.confidence > 0


@pytest.mark.asyncio
async def test_classify_covid():
    from etl.classifiers import classify_text

    result = classify_text("COVID-19 surge in winter season")
    assert result.disease_slug == "covid-19"


@pytest.mark.asyncio
async def test_early_warning_no_crash(db_session):
    from app.analytics.early_warning import run_early_warning_assessment

    count = await run_early_warning_assessment(db_session)
    assert count >= 0


@pytest.mark.asyncio
async def test_who_collector_health():
    from collectors.who_don import WhoDonCollector

    collector = WhoDonCollector()
    health = await collector.health_check()
    assert "healthy" in health


@pytest.mark.asyncio
async def test_global_stats(client):
    response = await client.get("/api/v1/stats/global")
    assert response.status_code == 200
    data = response.json()
    assert "totalActiveCases" in data
