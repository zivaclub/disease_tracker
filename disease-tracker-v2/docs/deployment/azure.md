# Azure Deployment — DiseaseWatch v2

Use **Azure Container Apps** or **AKS** for the API, **Azure Database for PostgreSQL**, and **Azure Cache for Redis**.

Set `DATABASE_URL`, `REDIS_URL`, `SECRET_KEY`, and `CORS_ORIGINS` as Container App secrets. Mount Prometheus/Grafana via Azure Monitor or self-hosted containers.

Health probe: `GET /api/health` on port 8000.
