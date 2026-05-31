# DiseaseWatch v2 — Production Architecture

## Overview

DiseaseWatch v2 is a production-ready disease tracking platform with:

- **FastAPI** backend with PostgreSQL, Redis, rate limiting, Prometheus metrics
- **React + Vite** frontend with dark mode, 10YL disease education, maps, alerts
- **Real WHO API** integration via OData Disease Outbreak News collector
- **ETL pipeline** with validation, deduplication, classification, and early warning
- **Docker Compose** stack: API, DB, Redis, frontend (nginx), Prometheus, Grafana

## Quick Start (Docker)

```bash
cd disease-tracker-v2
cp .env.example .env
docker compose up --build
```

- Frontend: http://localhost:5173
- API docs: http://localhost:8000/docs
- Grafana: http://localhost:3001 (admin/admin)
- Prometheus: http://localhost:9090

## Local Development

### Backend

```bash
cd backend
pip install -e ".[dev]"
cp ../.env.example .env
# Start PostgreSQL (or use docker compose up db redis)
python scripts/seed_db.py
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
npm install
npm run dev   # proxies /api → localhost:8000
```

### Full stack

```bash
npm run dev:full   # backend + frontend concurrently
```

## API Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/health` | Health check + DB stats |
| `GET /api/diseases` | Disease catalog with 10YL content |
| `GET /api/outbreaks` | Active outbreak list |
| `GET /api/alerts` | Early warning alerts |
| `GET /api/news` | WHO-sourced news articles |
| `POST /api/etl/run` | Trigger WHO ETL pipeline |
| `GET /api/v1/stats/global` | Dashboard aggregates |
| `GET /metrics` | Prometheus metrics |

## Data Sources

See [docs/data-sources.md](docs/data-sources.md) for the validated source tier list.

Primary: WHO Disease Outbreak News OData API (reliability score 95+).

## Testing

```bash
cd backend && pytest
```

Target: 70%+ coverage (path to 90% with integration tests).
