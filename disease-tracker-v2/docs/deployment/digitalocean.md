# DigitalOcean Deployment — DiseaseWatch v2

Use **App Platform** with two components:

1. **Web Service** — backend Docker image, port 8000, health check `/api/health`
2. **Static Site** — frontend `dist/` build output

Managed add-ons:
- **Managed PostgreSQL**
- **Managed Redis**

Set env vars in App Platform dashboard. Run `python scripts/seed_db.py` once via console job or deploy hook.
