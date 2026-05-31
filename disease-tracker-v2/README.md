# DiseaseWatch / Pandemic Pulse — Production v2

Global communicable disease monitoring with child-friendly (10YL) education, WHO data integration, early warning alerts, and production Docker deployment.

## Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.12, FastAPI, SQLAlchemy, PostgreSQL |
| Frontend | React 19, Vite, TypeScript, Tailwind CSS v4 |
| Data | WHO OData API, RSS collectors, ETL pipeline |
| Ops | Docker Compose, Prometheus, Grafana, structured logging |

## Quick Start

**Recommended — run everything with Docker:**

```bash
cd disease-tracker-v2
cp .env.example .env
npm run start:docker
# or: docker compose up --build
```

| Service | URL |
|---|---|
| App (frontend) | http://localhost:5173 |
| API docs | http://localhost:8000/docs |
| Grafana | http://localhost:3001 (admin/admin) |

**Local dev (hot reload):** start DB first, then backend + frontend:

```bash
npm run dev:db          # starts postgres + redis only
npm run dev:backend     # terminal 1 — FastAPI on :8000
npm run dev             # terminal 2 — Vite on :5173
```

> If you see `Connection refused` on the backend, Postgres is not running. Use `npm run dev:db` or `docker compose up -d db redis` first.

## Features (v2 Production)

- Real WHO Disease Outbreak News API collector
- Full ETL pipeline with deduplication and disease classification
- Early warning risk scoring engine
- PostgreSQL persistence (replaces JSON file store)
- Rate limiting, Prometheus metrics, health checks
- Dark mode, News feed page, 9 navigation sections
- Gemini AI for 10YL explanations (optional, with mock fallback)
- Docker Compose with Postgres, Redis, nginx, monitoring

## Documentation

- [Architecture](docs/architecture.md)
- [Data Sources](docs/data-sources.md)
- [Implementation Plan](../IMPLEMENTATION_PLAN.md)

## Legacy v1 Server

The original Express monolith (`server.ts`) is preserved. Use `npm run dev:legacy` for the v1 single-process mode.

## Testing

```bash
cd backend && pytest
```
