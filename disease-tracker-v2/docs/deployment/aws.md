# AWS Deployment Guide — DiseaseWatch v2

## Recommended architecture

- **ECS Fargate** — backend API containers
- **RDS PostgreSQL 16** — primary database
- **ElastiCache Redis** — Celery broker / cache
- **Application Load Balancer** — HTTPS termination
- **S3 + CloudFront** — frontend static assets (optional; or serve via nginx on ECS)
- **Amazon ECR** — container registry

## Steps

1. Push images to ECR:
   ```bash
   docker build -t diseasewatch-api ./backend
   docker tag diseasewatch-api:latest <account>.dkr.ecr.<region>.amazonaws.com/diseasewatch-api:latest
   docker push <account>.dkr.ecr.<region>.amazonaws.com/diseasewatch-api:latest
   ```

2. Create RDS PostgreSQL instance (`diseasewatch` database).

3. Set environment variables on ECS task:
   - `DATABASE_URL=postgresql+asyncpg://user:pass@rds-endpoint:5432/diseasewatch`
   - `REDIS_URL=redis://elasticache-endpoint:6379/0`
   - `SECRET_KEY=<openssl rand -hex 32>`
   - `ENVIRONMENT=production`
   - `CORS_ORIGINS=https://your-domain.com`

4. Run seed once as ECS task: `python scripts/seed_db.py`

5. Point ALB to ECS service on port 8000; configure health check on `/api/health`.

6. Enable Prometheus scraping from `/metrics` via AWS Managed Prometheus or self-hosted.

See also: [Azure](azure.md) · [GCP](gcp.md) · [DigitalOcean](digitalocean.md)
