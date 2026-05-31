# GCP Deployment — DiseaseWatch v2

Use **Cloud Run** for the API (container from `backend/Dockerfile`), **Cloud SQL PostgreSQL**, and **Memorystore Redis**.

```bash
gcloud run deploy diseasewatch-api \
  --source ./backend \
  --set-env-vars DATABASE_URL=...,SECRET_KEY=...,ENVIRONMENT=production
```

Frontend: Firebase Hosting or Cloud Storage + Cloud CDN serving `dist/` from `npm run build:frontend`.

Health check: `/api/health`
