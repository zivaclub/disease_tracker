# DiseaseWatch / Pandemic Pulse — Full Implementation Plan

> Production-ready Disease Tracker platform  
> Stack: Python · FastAPI · PostgreSQL · Vite · React · TypeScript · Tailwind  
> Audience: Citizens, students, parents, schools, NGOs, healthcare workers, researchers, governments  
> Content standard: **10YL** (explain like the audience is 10 years old)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Architecture](#2-system-architecture)
3. [Repository Structure](#3-repository-structure)
4. [Phase Roadmap & Timeline](#4-phase-roadmap--timeline)
5. [Step 1 — Product Discovery & Data Source Report](#5-step-1--product-discovery--data-source-report)
6. [Step 2 — Data Source Validation](#6-step-2--data-source-validation)
7. [Step 3 — Data Collection Layer](#7-step-3--data-collection-layer)
8. [Step 4 — Scraping Framework](#8-step-4--scraping-framework)
9. [Step 5 — ETL Pipeline](#9-step-5--etl-pipeline)
10. [Step 6 — Disease Intelligence Engine](#10-step-6--disease-intelligence-engine)
11. [Step 7 — Vaccination Intelligence Module](#11-step-7--vaccination-intelligence-module)
12. [Step 8 — Early Warning System](#12-step-8--early-warning-system)
13. [Step 9 — Geographic Intelligence](#13-step-9--geographic-intelligence)
14. [Step 10 — Database Design](#14-step-10--database-design)
15. [Step 11 — Backend Architecture](#15-step-11--backend-architecture)
16. [Step 12 — Frontend Architecture](#16-step-12--frontend-architecture)
17. [Step 13 — Dashboard Components](#17-step-13--dashboard-components)
18. [Step 14 — AI Features](#18-step-14--ai-features)
19. [Step 15–18 — 10YL Content & UX Framework](#19-step-1518--10yl-content--ux-framework)
20. [Step 19 — Observability](#20-step-19--observability)
21. [Step 20 — Testing Requirements](#21-step-20--testing-requirements)
22. [Step 21 — Deployment](#22-step-21--deployment)
23. [Step 22 — Deliverables Checklist](#23-step-22--deliverables-checklist)
24. [Assumptions, Trade-offs & Risks](#24-assumptions-trade-offs--risks)

---

## 1. Executive Summary

**DiseaseWatch** (working name; README also suggests **Pandemic Pulse**) is a global communicable-disease monitoring platform that aggregates authoritative public-health data, transforms it through a validated ETL pipeline, and presents it through a child-friendly, action-oriented web experience.

### Core value proposition

| Stakeholder | Value |
|---|---|
| Citizens / parents | Simple outbreak alerts, prevention steps, vaccination info |
| Students / schools | Age-appropriate disease education (10YL format) |
| NGOs / governments | Geographic spread, risk scores, historical trends |
| Researchers | Normalized datasets, API access, audit trails |

### Build strategy

Deliver in **6 phases over ~16–20 weeks** (1 senior full-stack engineer equivalent). Prioritize:

1. **WHO Disease Outbreak News (DON) API** as the primary outbreak signal (stable OData v4, no auth, global coverage).
2. **CDC SODA Open Data** for US case statistics and NNDSS notifiable diseases.
3. **Curated disease profiles** (seeded manually + AI-enriched) for the 12 reference diseases.
4. **Progressive enhancement** — maps, AI, scrapers added after core read path works.

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                        │
│   Web (React/Vite)  ·  Mobile browsers  ·  Future: Public API consumers     │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │ HTTPS / REST v1
┌──────────────────────────────────▼──────────────────────────────────────────┐
│                         API GATEWAY (FastAPI)                               │
│   JWT Auth · RBAC · Rate Limiting · Versioning · OpenAPI                    │
└───────┬──────────────────┬──────────────────┬───────────────────────────────┘
        │                  │                  │
┌───────▼──────┐  ┌────────▼────────┐  ┌──────▼──────────────────────────────┐
│  Services    │  │  AI Module      │  │  Analytics / Early Warning Engine   │
│  Layer       │  │  (Summaries,    │  │  (Trend detection, risk scoring)    │
│              │  │   10YL gen)     │  │                                     │
└───────┬──────┘  └────────┬────────┘  └──────┬──────────────────────────────┘
        │                  │                  │
┌───────▼──────────────────▼──────────────────▼─────────────────────────────┐
│                         REPOSITORY LAYER                                    │
│   PostgreSQL (SQLAlchemy 2.x + Alembic) · Redis (cache, rate limits, jobs) │
└───────┬─────────────────────────────────────────────────────────────────────┘
        │
┌───────▼─────────────────────────────────────────────────────────────────────┐
│                         DATA PIPELINE                                       │
│  Collectors → Validators → ETL Workers → Classifiers → Geo Mapper          │
│  (Celery + Redis broker · APScheduler for cron)                            │
└───────┬─────────────────────────────────────────────────────────────────────┘
        │
┌───────▼─────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL SOURCES                                    │
│  WHO OData · CDC SODA · ECDC RSS · OWID CSV · HealthMap RSS · Gov APIs     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  OBSERVABILITY: Prometheus · Grafana · Structured JSON logs · Sentry        │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key architectural decisions

| Decision | Choice | Rationale |
|---|---|---|
| Backend pattern | Clean Architecture + Repository + DI | Testability, separation of concerns |
| Async jobs | Celery + Redis | Reliable scheduled ETL, retries |
| ORM | SQLAlchemy 2.x async | Mature PostgreSQL support |
| Migrations | Alembic | Industry standard for FastAPI |
| Frontend state | TanStack Query + Zustand | Server cache + minimal client state |
| Maps | MapLibre GL + react-map-gl | Open-source, no Google billing |
| Charts | Recharts | Lightweight, React-native |
| AI provider | OpenAI API (configurable) | Summarization + 10YL generation |

---

## 3. Repository Structure

```
disease_tracker/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── core/                 # config, security, deps, logging
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── routes/       # diseases, outbreaks, alerts, maps, auth
│   │   │       └── schemas/      # Pydantic request/response models
│   │   ├── domain/               # entities, enums (RiskLevel, DiseaseType)
│   │   ├── repositories/       # DB access (one per aggregate)
│   │   ├── services/             # business logic
│   │   ├── ai/                   # summarization, 10YL, risk prediction
│   │   └── analytics/            # trend detection, early warning
│   ├── collectors/               # API clients, RSS parsers
│   ├── scrapers/                 # Playwright, BS4, Scrapy spiders
│   ├── etl/
│   │   ├── pipeline.py
│   │   ├── validators/
│   │   ├── normalizers/
│   │   ├── deduplicators/
│   │   └── classifiers/
│   ├── workers/                  # Celery tasks
│   ├── alembic/                  # migrations
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── fixtures/
│   ├── pyproject.toml
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/                # Home, DiseaseExplorer, OutbreakTracker, etc.
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   ├── maps/
│   │   │   ├── charts/
│   │   │   ├── disease/          # 10YL sections, CTAs
│   │   │   └── ui/               # shadcn-style primitives
│   │   ├── hooks/
│   │   ├── services/             # API client
│   │   ├── stores/
│   │   └── types/
│   ├── e2e/                      # Playwright tests
│   ├── package.json
│   └── Dockerfile
├── infra/
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   ├── prometheus/
│   ├── grafana/
│   └── nginx/
├── docs/
│   ├── architecture.md
│   ├── api.md
│   ├── data-sources.md           # validation report (Step 1 output)
│   ├── deployment/
│   │   ├── aws.md
│   │   ├── azure.md
│   │   ├── gcp.md
│   │   └── digitalocean.md
│   └── runbooks/
├── scripts/
│   ├── seed_diseases.py
│   └── validate_sources.py
├── IMPLEMENTATION_PLAN.md          # this file
├── master_design_prompt.txt
└── README.md
```

---

## 4. Phase Roadmap & Timeline

| Phase | Duration | Focus | Exit criteria |
|---|---|---|---|
| **P0 — Foundation** | Weeks 1–2 | Repo scaffold, Docker, DB schema, CI | `docker compose up` runs API + DB + frontend shell |
| **P1 — Data Core** | Weeks 3–5 | Source validation, WHO/CDC collectors, ETL v1 | Outbreaks ingested and queryable via API |
| **P2 — Backend API** | Weeks 6–8 | Full REST API, auth, disease profiles, alerts | OpenAPI docs complete, 70%+ test coverage |
| **P3 — Frontend MVP** | Weeks 9–11 | All 9 pages, dashboard, 10YL disease pages | Responsive, dark mode, a11y pass |
| **P4 — Intelligence** | Weeks 12–14 | Maps, early warning, AI summaries, vaccination | Risk alerts auto-generated, maps live |
| **P5 — Production** | Weeks 15–18 | Scrapers, observability, E2E, cloud deploy guides | 90% backend coverage, monitoring live |
| **P6 — Polish** | Weeks 19–20 | Performance, content QA, documentation | Production-ready release v1.0 |

---

## 5. Step 1 — Product Discovery & Data Source Report

**Deliverable:** `docs/data-sources.md` (living document, updated by validation job)

### Existing platforms analyzed

| Platform | What it offers | Gap we fill |
|---|---|---|
| WHO DON | Global outbreak bulletins | No child-friendly UX, no unified dashboard |
| CDC WONDER / data.cdc.gov | US surveillance datasets | US-centric, technical |
| ECDC | EU epidemiological data | Regional, PDF-heavy |
| HealthMap | Aggregated alerts | No education layer |
| GISAID | Viral genomics | Restricted access, researcher-focused |
| Our World in Data | Clean CSV trends | No real-time alerts |
| Johns Hopkins CSSE (archived) | Historical COVID | Deprecated; use OWID instead |

### Primary data sources (recommended tier list)

#### Tier 1 — API-first (build first)

| Source | Endpoint / Access | Update freq | Reliability | Coverage | License / Restrictions |
|---|---|---|---|---|---|
| **WHO Disease Outbreak News** | `GET https://www.who.int/api/news/diseaseoutbreaknews` (OData v4) | Event-driven | **95** | Global | Public; WHO terms |
| **CDC Open Data (SODA)** | `https://data.cdc.gov/api/v3/views/{id}/query.json` | Daily–weekly | **90** | US (+ some global) | Public domain (US Gov) |
| **Our World in Data** | GitHub CSV (e.g. COVID, flu) | Daily | **88** | Global | CC BY |
| **WHO RSS** | `https://www.who.int/rss-feeds` | Daily | **85** | Global | Public |

#### Tier 2 — RSS / structured feeds

| Source | Access | Update freq | Reliability | Notes |
|---|---|---|---|---|
| **ECDC Threat Reports** | RSS at ecdc.europa.eu | Weekly | **82** | EU focus |
| **CDC Travel Health Notices** | RSS | As needed | **85** | Travel-oriented |
| **ProMED-mail** | RSS (if available) | Daily | **80** | Early signals; verify ToS |
| **HealthMap** | RSS/API (limited) | Daily | **75** | Supplementary |

#### Tier 3 — Scraping candidates (only if API unavailable)

| Source | Method | Reliability | Risk |
|---|---|---|---|
| PAHO Epidemiological Alerts | Scrapy + BS4 | **70** | Portal changes frequently |
| National MOH bulletins | Per-country scrapers | **60–75** | High maintenance |
| CDC GIS dashboards | Playwright | **65** | Not a stable API contract |

#### Tier 4 — Reference / static enrichment

| Source | Use |
|---|---|
| WHO Fact Sheets | Disease profile seed content |
| CDC Disease Index | Symptoms, prevention (US) |
| UNICEF Immunization | Vaccination schedules |
| World Bank Health Stats API | Contextual indicators |

### Rejected / deprioritized sources

- **GISAID** — registration required, restricted redistribution
- **Unofficial COVID APIs** — unmaintained post-pandemic
- **Social media scraping** — legal/ethical risk, low signal-to-noise
- **Dashboard JSON proxies** (CDC ArcGIS, ECDC PDFs) — not stable API contracts

---

## 6. Step 2 — Data Source Validation

**Deliverable:** Automated validation job + `data_sources` table populated

### Validation pipeline (`scripts/validate_sources.py`)

For each registered source, run daily:

```
1. HEAD/GET health check (HTTP 200, response time < 10s)
2. Schema fingerprint (hash of field names / RSS structure)
3. Freshness check (latest record date within expected window)
4. Sample record quality (required fields present)
5. Compute scores → upsert data_sources row
```

### Scoring model

| Metric | Weight | Calculation |
|---|---|---|
| Reliability Score (0–100) | — | Weighted composite below |
| Uptime (30-day) | 30% | Successful checks / total checks |
| Freshness | 25% | 100 if within SLA, decays linearly |
| Schema stability | 20% | 100 if unchanged, 0 if breaking change |
| Data completeness | 15% | % non-null required fields in sample |
| Legal clarity | 10% | Manual score (public domain = 100) |

### `data_sources` table fields

```sql
id, name, source_type (api|rss|csv|scraper), base_url,
reliability_score, update_frequency, completeness_score,
last_validated_at, last_successful_fetch_at, is_active,
access_restrictions, license, validation_metadata (JSONB)
```

### Auto-disable rule

If `reliability_score < 50` for 7 consecutive days → set `is_active = false`, emit ops alert.

---

## 7. Step 3 — Data Collection Layer

**Deliverable:** `backend/collectors/` with pluggable collector interface

### Collector interface

```python
class BaseCollector(ABC):
    source_id: UUID
    async def fetch(self) -> RawPayload: ...
    async def health_check(self) -> bool: ...
```

### Collectors to implement (priority order)

| # | Collector | Type | Schedule |
|---|---|---|---|
| 1 | `WHODONCollector` | OData API | Every 2 hours |
| 2 | `WHOOutbreaksCollector` | OData API | Every 2 hours |
| 3 | `CDCSODACollector` | REST (NNDSS, COVID datasets) | Every 6 hours |
| 4 | `OWIDCSVCollector` | CSV download | Daily |
| 5 | `ECDRSSCollector` | RSS | Every 4 hours |
| 6 | `CDCTravelRSSCollector` | RSS | Every 6 hours |
| 7 | `WorldBankHealthCollector` | REST API | Weekly |

### Collector features

- Exponential backoff retries (max 5)
- Request logging with correlation ID
- Raw payload stored in `raw_ingestions` table (JSONB, partitioned by month)
- Idempotency via `(source_id, external_id, content_hash)`

---

## 8. Step 4 — Scraping Framework

**Deliverable:** `backend/scrapers/` with ethical scraping infrastructure

### Framework components

| Component | Technology | Purpose |
|---|---|---|
| Scheduler | Celery Beat | Cron-based scrape jobs |
| robots.txt checker | `urllib.robotparser` + cache | Compliance gate |
| Rate limiter | Redis token bucket | Default 1 req/2s per domain |
| Retry | Tenacity | 3 retries, jitter |
| Proxy support | Env-configured HTTP proxy | Optional, for geo-restricted sources |
| Monitoring | Prometheus counters | `scrape_success_total`, `scrape_failure_total` |

### Scraper implementations (Phase 5)

| Spider | Tool | Target |
|---|---|---|
| `paho_alerts` | Scrapy | PAHO epidemiological bulletins |
| `who_factsheets` | BeautifulSoup | WHO disease fact sheets (enrichment) |
| `cdc_disease_pages` | Playwright | JS-rendered CDC disease info |

### Ethical rules (hard-coded)

1. Check robots.txt before every domain — abort if disallowed
2. Identify via `User-Agent: DiseaseWatchBot/1.0 (+https://ourdomain.com/bot)`
3. Never scrape login-gated or paywalled content
4. Respect `Crawl-delay` directive
5. Store only publicly available data

---

## 9. Step 5 — ETL Pipeline

**Deliverable:** `backend/etl/pipeline.py` — staged, logged, replayable

### Pipeline stages

```
Raw Source
  → [1] Validation      — schema check, required fields
  → [2] Cleaning        — strip HTML, normalize dates, fix encodings
  → [3] Normalization   — map to canonical disease/geo/outbreak models
  → [4] Deduplication   — fuzzy match on (disease, country, date, title)
  → [5] Classification  — NLP/keyword → disease_id, outbreak type
  → [6] Geo Mapping     — country ISO-3166, geocode city if present
  → [7] Storage         — upsert outbreaks, cases, articles
```

### Logging

Every stage writes to `etl_runs` + `etl_stage_logs`:

```json
{
  "run_id": "uuid",
  "source_id": "uuid",
  "stage": "deduplication",
  "records_in": 42,
  "records_out": 38,
  "errors": [],
  "duration_ms": 1200
}
```

### Deduplication strategy

- Exact match: `(source_id, external_id)`
- Fuzzy match: Levenshtein on title + same disease + same country + date ± 3 days
- Merge strategy: highest reliability source wins; combine metadata

### Disease classification

1. Rule-based keyword map (fast path): "mpox" → Monkeypox, "dengue" → Dengue
2. Fallback: LLM classification with constrained disease enum
3. Unknown → queue for manual review (`classification_review` table)

---

## 10. Step 6 — Disease Intelligence Engine

**Deliverable:** Curated disease profiles for 12+ diseases with full metadata

### Reference diseases (seed data)

COVID-19, Dengue, Malaria, Measles, Tuberculosis, Cholera, Ebola, Nipah, H1N1, Monkeypox, Polio, + extensible catalog

### `diseases` entity

| Field | Type | Example |
|---|---|---|
| name | string | COVID-19 |
| slug | string | covid-19 |
| type | enum | VIRAL |
| pathogen | string | SARS-CoV-2 |
| first_discovered | date | 2019-12-01 |
| transmission_methods | JSONB[] | airborne, droplet |
| symptoms | JSONB[] | {name, severity, icon} |
| risk_groups | JSONB[] | elderly, immunocompromised |
| prevention_methods | JSONB[] | {action, priority} |
| treatments | JSONB[] | supportive care, antivirals |
| mortality_rate | decimal | 0.003 |
| historical_outbreaks | relation | → outbreaks table |

### 10YL content (separate table `disease_education`)

One row per disease, per section:

- `what_is_it`, `how_spreads`, `symptoms`, `stay_safe`, `vaccine_info`, `why_care`, `what_to_do_now`, `benefits_of_prevention`

Content pipeline:

1. Seed from WHO/CDC fact sheets (manual curation)
2. AI rewrite to 10YL reading level (Flesch-Kincaid grade ≤ 5)
3. Human review flag before publish

---

## 11. Step 7 — Vaccination Intelligence Module

**Deliverable:** `vaccines` + `disease_vaccines` + `vaccine_availability` tables

### Per-vaccine fields

| Field | Example (COVID-19) |
|---|---|
| name | mRNA COVID-19 vaccine |
| disease_id | → COVID-19 |
| available | true |
| doses_required | 2 |
| age_recommendation | 6 months+ |
| booster_required | true |
| booster_interval | 12 months |
| effectiveness | ~95% (original strain) |
| side_effects | JSONB (mild: sore arm, fatigue) |
| who_recommendation | text |
| country_availability | → vaccine_availability (country_id, available, notes) |

### Data sources

- WHO immunization fact sheets
- CDC vaccine schedules
- UNICEF vaccine market data (where public)

---

## 12. Step 8 — Early Warning System

**Deliverable:** `backend/analytics/early_warning.py` + `alerts` + `risk_scores` tables

### Detection algorithms

| Signal | Method | Threshold |
|---|---|---|
| Rising case trends | 7-day vs 30-day moving average ratio | > 1.5× → Medium, > 2.5× → High |
| Unusual clusters | Z-score on case count per region | Z > 2 → Medium, Z > 3 → High |
| Rapid geographic spread | New countries affected in 14 days | ≥ 3 new → High |
| Mortality spike | Death/case ratio vs historical baseline | > 2× baseline → Critical |

### Risk levels

| Level | Color | Action |
|---|---|---|
| Low | Green | Informational only |
| Medium | Yellow | Increased monitoring |
| High | Orange | Public alert + 10YL guidance |
| Critical | Red | Push notification + prominent banner |

### Alert entity

```sql
alerts (id, disease_id, region_id, risk_level, title, message_10yl,
        recommended_actions JSONB, created_at, expires_at, is_active)
```

### Scheduling

Run analytics engine every 6 hours after ETL completes. Emit alerts idempotently (no duplicate active alerts for same disease+region).

---

## 13. Step 9 — Geographic Intelligence

**Deliverable:** Map API endpoints + frontend map components

### Geo hierarchy

```
countries (ISO-3166-1 alpha-2)
  └── regions / states (ISO-3166-2 where available)
       └── cities (GeoNames ID, lat/lng)
```

### Map features

| Feature | Implementation |
|---|---|
| Heatmaps | MapLibre heatmap layer from case density |
| Spread maps | Animated arc layer (country → country over time) |
| Risk maps | Choropleth by `risk_scores` per country |
| Timeline playback | Slider controlling `reported_at` filter |

### API endpoints

```
GET /api/v1/maps/heatmap?disease_id=&date=
GET /api/v1/maps/spread?disease_id=&from=&to=
GET /api/v1/maps/risk?date=
GET /api/v1/geo/countries?affected=true
GET /api/v1/geo/countries/{code}/timeline?disease_id=
```

### Geo data bootstrap

- Natural Earth country boundaries (GeoJSON)
- GeoNames for city geocoding (free tier, cached locally)

---

## 14. Step 10 — Database Design

**Deliverable:** Alembic migrations for all tables below

### Entity-Relationship Overview

```
users ──────────────< audit_logs
countries ──< regions ──< cities
diseases ──< disease_education (10YL)
diseases ──< disease_vaccines >── vaccines
diseases ──< outbreaks ──< cases
                              ├── deaths
                              └── recoveries
diseases ──< alerts
countries ──< risk_scores
data_sources ──< scraping_jobs
data_sources ──< raw_ingestions
articles (linked to outbreaks, diseases)
```

### Core tables (abbreviated DDL)

```sql
-- Users & auth
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'viewer',  -- viewer, editor, admin, researcher
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Geography
CREATE TABLE countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    iso_code CHAR(2) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    continent VARCHAR(50),
    population BIGINT,
    geom GEOGRAPHY(MULTIPOLYGON, 4326)
);

CREATE TABLE regions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id UUID REFERENCES countries(id),
    iso_code VARCHAR(10),
    name VARCHAR(255) NOT NULL
);

CREATE TABLE cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    region_id UUID REFERENCES regions(id),
    name VARCHAR(255) NOT NULL,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6)
);

-- Disease catalog
CREATE TABLE diseases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    disease_type VARCHAR(50),       -- viral, bacterial, fungal, parasitic
    pathogen VARCHAR(255),
    first_discovered DATE,
    transmission_methods JSONB DEFAULT '[]',
    symptoms JSONB DEFAULT '[]',
    risk_groups JSONB DEFAULT '[]',
    prevention_methods JSONB DEFAULT '[]',
    treatments JSONB DEFAULT '[]',
    mortality_rate DECIMAL(8,6),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE disease_education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    disease_id UUID REFERENCES diseases(id) UNIQUE,
    what_is_it TEXT,
    how_spreads TEXT,
    symptoms TEXT,
    stay_safe TEXT,
    vaccine_info TEXT,
    why_care TEXT,
    what_to_do_now TEXT,
    benefits_of_prevention JSONB DEFAULT '[]',
    reading_level_grade DECIMAL(3,1),
    reviewed BOOLEAN DEFAULT false
);

-- Outbreaks & metrics
CREATE TABLE outbreaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    disease_id UUID REFERENCES diseases(id),
    country_id UUID REFERENCES countries(id),
    region_id UUID REFERENCES regions(id),
    city_id UUID REFERENCES cities(id),
    source_id UUID REFERENCES data_sources(id),
    external_id VARCHAR(255),
    title VARCHAR(500),
    status VARCHAR(50) DEFAULT 'active',  -- active, contained, resolved
    started_at DATE,
    reported_at TIMESTAMPTZ,
    summary TEXT,
    source_url TEXT,
    UNIQUE(source_id, external_id)
);

CREATE TABLE cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outbreak_id UUID REFERENCES outbreaks(id),
    reported_date DATE NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    case_type VARCHAR(50) DEFAULT 'confirmed'  -- confirmed, suspected, probable
);

CREATE TABLE deaths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outbreak_id UUID REFERENCES outbreaks(id),
    reported_date DATE NOT NULL,
    count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE recoveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outbreak_id UUID REFERENCES outbreaks(id),
    reported_date DATE NOT NULL,
    count INTEGER NOT NULL DEFAULT 0
);

-- Vaccines
CREATE TABLE vaccines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    doses_required INTEGER DEFAULT 1,
    age_recommendation VARCHAR(100),
    booster_required BOOLEAN DEFAULT false,
    booster_interval_months INTEGER,
    effectiveness VARCHAR(100),
    side_effects JSONB DEFAULT '[]',
    who_recommendation TEXT
);

CREATE TABLE disease_vaccines (
    disease_id UUID REFERENCES diseases(id),
    vaccine_id UUID REFERENCES vaccines(id),
    PRIMARY KEY (disease_id, vaccine_id)
);

CREATE TABLE vaccine_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vaccine_id UUID REFERENCES vaccines(id),
    country_id UUID REFERENCES countries(id),
    is_available BOOLEAN DEFAULT false,
    notes TEXT,
    UNIQUE(vaccine_id, country_id)
);

-- Alerts & risk
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    disease_id UUID REFERENCES diseases(id),
    country_id UUID REFERENCES countries(id),
    risk_level VARCHAR(20) NOT NULL,  -- low, medium, high, critical
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    message_10yl TEXT,
    recommended_actions JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ
);

CREATE TABLE risk_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    disease_id UUID REFERENCES diseases(id),
    country_id UUID REFERENCES countries(id),
    score DECIMAL(5,2) NOT NULL,       -- 0-100
    risk_level VARCHAR(20) NOT NULL,
    factors JSONB DEFAULT '{}',
    calculated_at TIMESTAMPTZ DEFAULT now()
);

-- Data pipeline
CREATE TABLE data_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    source_type VARCHAR(50) NOT NULL,
    base_url TEXT,
    reliability_score DECIMAL(5,2),
    update_frequency VARCHAR(50),
    completeness_score DECIMAL(5,2),
    last_validated_at TIMESTAMPTZ,
    last_successful_fetch_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    access_restrictions TEXT,
    license VARCHAR(100),
    validation_metadata JSONB DEFAULT '{}'
);

CREATE TABLE scraping_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES data_sources(id),
    status VARCHAR(50) DEFAULT 'pending',
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    records_fetched INTEGER DEFAULT 0,
    error_message TEXT
);

CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES data_sources(id),
    outbreak_id UUID REFERENCES outbreaks(id),
    disease_id UUID REFERENCES diseases(id),
    title VARCHAR(500) NOT NULL,
    summary TEXT,
    summary_10yl TEXT,
    url TEXT,
    published_at TIMESTAMPTZ,
    content_hash VARCHAR(64) UNIQUE
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_outbreaks_disease_country ON outbreaks(disease_id, country_id);
CREATE INDEX idx_cases_outbreak_date ON cases(outbreak_id, reported_date);
CREATE INDEX idx_alerts_active ON alerts(is_active, risk_level);
CREATE INDEX idx_risk_scores_latest ON risk_scores(disease_id, country_id, calculated_at DESC);
```

### Migration strategy

- Initial migration: all tables above
- Seed migration: 12 diseases + countries (ISO list) + data sources
- Use Alembic autogenerate with manual review

---

## 15. Step 11 — Backend Architecture

**Deliverable:** FastAPI app with Clean Architecture

### Layer responsibilities

| Layer | Responsibility | Example |
|---|---|---|
| `api/v1/routes` | HTTP handling, input validation | `GET /diseases/{slug}` |
| `services` | Business logic, orchestration | `DiseaseService.get_with_education()` |
| `repositories` | DB queries only | `DiseaseRepository.find_by_slug()` |
| `domain` | Pure entities, no framework deps | `Disease`, `RiskLevel` enum |
| `core/deps` | DI wiring | `get_db`, `get_current_user` |

### API surface (v1)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register |
| POST | `/auth/login` | Public | JWT token |
| GET | `/diseases` | Public | List diseases |
| GET | `/diseases/{slug}` | Public | Disease detail + 10YL |
| GET | `/outbreaks` | Public | Filterable outbreak list |
| GET | `/outbreaks/{id}` | Public | Outbreak detail |
| GET | `/alerts` | Public | Active alerts |
| GET | `/alerts/active` | Public | High/Critical only |
| GET | `/vaccines` | Public | Vaccine catalog |
| GET | `/vaccines/by-disease/{slug}` | Public | Disease vaccines |
| GET | `/maps/heatmap` | Public | GeoJSON heatmap data |
| GET | `/maps/risk` | Public | Risk choropleth data |
| GET | `/news` | Public | Article feed |
| GET | `/stats/global` | Public | Dashboard aggregates |
| GET | `/stats/trends` | Public | Time-series data |
| POST | `/admin/sources/validate` | Admin | Trigger validation |
| POST | `/admin/etl/run` | Admin | Trigger ETL |
| GET | `/health` | Public | Health check |
| GET | `/metrics` | Internal | Prometheus |

### Security

| Feature | Implementation |
|---|---|
| JWT Auth | `python-jose`, 30-min access + 7-day refresh |
| RBAC | Roles: `viewer`, `editor`, `admin`, `researcher` |
| Rate limiting | `slowapi` — 100 req/min public, 1000 req/min authenticated |
| API versioning | URL prefix `/api/v1` |
| CORS | Configurable allowed origins |

### Key dependencies

```
fastapi, uvicorn, sqlalchemy[asyncio], asyncpg, alembic,
pydantic-settings, python-jose, passlib, bcrypt, slowapi,
httpx, feedparser, celery, redis, prometheus-fastapi-instrumentator,
structlog, tenacity, openai
```

---

## 16. Step 12 — Frontend Architecture

**Deliverable:** Vite + React + TypeScript + Tailwind SPA

### Tech choices

| Concern | Choice |
|---|---|
| Routing | React Router v7 |
| Data fetching | TanStack Query |
| Forms | React Hook Form + Zod |
| UI components | shadcn/ui (Radix + Tailwind) |
| Icons | Lucide React |
| Dark mode | Tailwind `dark:` + system preference |
| i18n (future) | react-i18next scaffold |

### Pages

| Page | Route | Key components |
|---|---|---|
| **Home** | `/` | Global stats cards, active alerts banner, featured diseases |
| **Disease Explorer** | `/diseases` | Searchable grid, filter by type/transmission |
| **Disease Details** | `/diseases/:slug` | 10YL sections, symptoms icons, vaccination, CTA |
| **Outbreak Tracker** | `/outbreaks` | Filterable table, status badges, trend sparklines |
| **Vaccination Center** | `/vaccines` | Vaccine finder, schedule info, availability by country |
| **Alerts** | `/alerts` | Risk-level grouped alerts, dismiss/acknowledge |
| **Maps** | `/maps` | Heatmap, spread, risk layers, timeline slider |
| **News** | `/news` | Article feed with 10YL summaries |
| **About** | `/about` | Data sources, methodology, disclaimers |

### Accessibility requirements

- WCAG 2.1 AA compliance
- Semantic HTML, ARIA labels on interactive elements
- Keyboard navigation for all pages
- Color contrast ≥ 4.5:1 (test both light/dark)
- `prefers-reduced-motion` respected

### Responsive breakpoints

Mobile-first: `sm(640)` → `md(768)` → `lg(1024)` → `xl(1280)`

---

## 17. Step 13 — Dashboard Components

### Global statistics cards (Home + Dashboard)

| Card | Data source | Icon |
|---|---|---|
| Total Active Cases | `SUM(cases)` where outbreak.status = active | Activity |
| Countries Affected | `COUNT(DISTINCT country_id)` active outbreaks | Globe |
| Vaccines Available | `COUNT(vaccines)` where available | Syringe |
| Active Alerts | `COUNT(alerts)` where is_active | Bell |

### Charts

| Chart | Library | Data |
|---|---|---|
| Infection curve | Recharts AreaChart | cases over time per disease |
| Trend comparison | Recharts LineChart | 7-day MA vs 30-day MA |
| Vaccination trends | Recharts BarChart | doses over time (where data exists) |
| Recovery rate | Recharts PieChart | recovered / (recovered + active + deaths) |

### Map components

| Component | Description |
|---|---|
| `HeatmapLayer` | Case density overlay |
| `SpreadArcLayer` | Animated spread between countries |
| `RiskChoropleth` | Country fill by risk level |
| `TimelineControl` | Date range slider for playback |

---

## 18. Step 14 — AI Features

**Deliverable:** `backend/app/ai/` module

### AI capabilities

| Feature | Input | Output | Model |
|---|---|---|---|
| Disease summarization | WHO/CDC fact sheet text | 200-word summary | GPT-4o-mini |
| Outbreak summarization | DON article HTML | 3-sentence summary | GPT-4o-mini |
| 10YL content generation | Medical text | Grade-5 reading level | GPT-4o with system prompt |
| Risk prediction | Historical case time-series | Risk score + explanation | Statistical + LLM explanation |
| Trend detection | Case counts (14/30/90 day) | Trend label (rising/stable/declining) | Statistical (no LLM needed) |
| News summarization | RSS article content | Title + 10YL summary | GPT-4o-mini |
| Public awareness content | Disease profile | Social-shareable tips | GPT-4o-mini |

### 10YL generation system prompt (template)

```
You are a friendly health teacher explaining to a 10-year-old.
Rules:
- Use short sentences (max 15 words).
- No medical jargon. If you must use a medical word, explain it simply.
- Use positive, calm tone. Never use fear-based language.
- Include actionable steps the child can take.
- Reading level: grade 4–5 (Flesch-Kincaid).
```

### Cost controls

- Cache AI outputs by content hash (Redis, 7-day TTL)
- Batch processing during ETL (not on-demand for every request)
- Rate limit AI endpoints: 10 req/min per user

---

## 19. Step 15–18 — 10YL Content & UX Framework

Every disease detail page follows this **fixed template**:

### Page structure

```
┌─────────────────────────────────────────────┐
│  Hero: Disease name + friendly illustration │
├─────────────────────────────────────────────┤
│  🦠 What is it?                             │
│  🔄 How does it spread?                     │
│  🤒 What are the symptoms? (with icons)     │
│  🛡️ How can I stay safe?                   │
│  💉 Is there a vaccine?                     │
│  ❤️ Why should I care?                      │
├─────────────────────────────────────────────┤
│  ✅ What should I do now? (checklist CTA)   │
├─────────────────────────────────────────────┤
│  🌟 Benefits of Prevention                  │
│    • Stay healthy                           │
│    • Protect family                         │
│    • Protect community                      │
│    • Reduce healthcare costs                │
│    • Avoid severe illness                   │
├─────────────────────────────────────────────┤
│  ### Stay Safe Today                        │
│    • Vaccination reminder                   │
│    • Hygiene reminder                       │
│    • Symptom checker link                   │
│    • Nearby health resources                │
└─────────────────────────────────────────────┘
```

### Communication rules (enforced in content review + AI prompts)

**Always:** simple language, short sentences, visual explanations, positive tone, action-oriented guidance

**Never:** medical jargon without explanation, fear-based messaging, unexplained technical terms

### Reusable frontend components

- `<TenYLSection title icon children />`
- `<SymptomIcon name severity />`
- `<ActionChecklist items />`
- `<StaySafeCTA />`
- `<BenefitsGrid />`

---

## 20. Step 19 — Observability

### Stack

| Tool | Purpose |
|---|---|
| **Prometheus** | Metrics collection |
| **Grafana** | Dashboards (ETL, API, scrapers) |
| **structlog** | JSON structured logging |
| **Sentry** | Error tracking (optional, env-configured) |
| **FastAPI `/health`** | Liveness + readiness (DB, Redis, Celery) |

### Key metrics

```
# API
http_requests_total{method, endpoint, status}
http_request_duration_seconds{endpoint}

# ETL
etl_records_processed_total{source, stage}
etl_run_duration_seconds{source}
etl_errors_total{source, stage}

# Scrapers
scrape_success_total{spider}
scrape_failure_total{spider, reason}

# Business
active_outbreaks_total
active_alerts_total{risk_level}
data_source_reliability{source}
```

### Grafana dashboards

1. **Platform Overview** — request rate, error rate, latency p95
2. **Data Pipeline** — ETL throughput, source freshness, failure rates
3. **Public Health** — active outbreaks, alerts by level, countries affected

---

## 21. Step 20 — Testing Requirements

### Coverage targets

| Layer | Target | Tool |
|---|---|---|
| Backend unit | 90%+ | pytest + pytest-cov |
| Backend integration | All API routes | pytest + httpx AsyncClient + test DB |
| ETL pipeline | All stages | pytest with fixtures |
| Frontend unit | Key components | Vitest + Testing Library |
| E2E | Critical user flows | Playwright |

### Critical E2E flows (Playwright)

1. Home page loads with stats cards
2. Browse diseases → view COVID-19 detail → all 10YL sections render
3. Outbreak tracker filters by country
4. Alerts page shows risk-level badges
5. Map page renders heatmap layer
6. Dark mode toggle persists
7. Login → admin ETL trigger (admin role)

### CI pipeline (GitHub Actions)

```yaml
jobs:
  backend-test:    pytest --cov=app --cov-fail-under=90
  frontend-test:   vitest run
  e2e-test:        playwright test (against docker compose)
  lint:            ruff, mypy, eslint
  build:           docker build backend + frontend
```

---

## 22. Step 21 — Deployment

### Docker Compose (local dev)

```yaml
services:
  db:          postgres:16
  redis:       redis:7
  backend:     FastAPI (uvicorn)
  worker:      Celery worker
  scheduler:   Celery beat
  frontend:    Vite dev / nginx prod
  prometheus:  prometheus
  grafana:     grafana
```

### Production Docker Compose

- Nginx reverse proxy (TLS termination)
- Backend: 2+ replicas behind load balancer
- Worker: 2+ Celery workers
- PostgreSQL with volume persistence + daily backup
- Redis with persistence

### Cloud deployment guides (`docs/deployment/`)

| Provider | Recommended services |
|---|---|
| **AWS** | ECS Fargate + RDS PostgreSQL + ElastiCache Redis + ALB + Route53 |
| **Azure** | Container Apps + Azure Database for PostgreSQL + Azure Cache for Redis |
| **GCP** | Cloud Run + Cloud SQL + Memorystore + Cloud Load Balancing |
| **DigitalOcean** | App Platform + Managed PostgreSQL + Managed Redis |

### Environment variables

```
DATABASE_URL, REDIS_URL, SECRET_KEY, OPENAI_API_KEY,
CORS_ORIGINS, SENTRY_DSN, ENVIRONMENT (dev/staging/prod)
```

---

## 23. Step 22 — Deliverables Checklist

| # | Deliverable | Location | Phase |
|---|---|---|---|
| 1 | System architecture | `docs/architecture.md` | P0 |
| 2 | Database schema | `backend/alembic/versions/` | P0 |
| 3 | Backend code | `backend/` | P1–P2 |
| 4 | Frontend code | `frontend/` | P3 |
| 5 | Scraping pipelines | `backend/scrapers/` | P5 |
| 6 | ETL pipelines | `backend/etl/` | P1 |
| 7 | API documentation | Auto-generated OpenAPI at `/docs` | P2 |
| 8 | Deployment documentation | `docs/deployment/` | P5 |
| 9 | Testing suite | `backend/tests/`, `frontend/e2e/` | P2–P5 |
| 10 | Monitoring stack | `infra/prometheus/`, `infra/grafana/` | P5 |
| 11 | Data-source validation report | `docs/data-sources.md` | P1 |
| 12 | Production-ready repo | Full monorepo | P6 |

---

## 24. Assumptions, Trade-offs & Risks

### Assumptions

1. Public health data from WHO/CDC/OWID is sufficient for v1; no proprietary clinical data needed.
2. OpenAI API available for AI features; graceful degradation if key not set.
3. Single-region deployment initially; multi-region is v2.
4. English-only content for v1; i18n scaffolded but not populated.

### Trade-offs

| Decision | Trade-off |
|---|---|
| WHO as primary source | Less granular than country-level APIs, but globally consistent |
| LLM for 10YL content | Fast to generate, but requires human review for medical accuracy |
| PostgreSQL over TimescaleDB | Simpler ops; may need TimescaleDB extension for v2 time-series perf |
| MapLibre over Google Maps | Free, but fewer geocoding features |
| Celery over ARQ/Huey | Heavier infra (Redis broker), but battle-tested for ETL |

### Risks & mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| WHO API schema change | ETL breaks | Schema fingerprinting + alerts; raw payload archive for replay |
| AI hallucination in medical content | User harm | Human review flag; disclaimer on every page; cite sources |
| Scraper ToS violations | Legal | robots.txt gate; prefer APIs; legal review before new scrapers |
| Stale data perception | Trust loss | Show "last updated" timestamps prominently |
| Scope creep (22 requirements) | Delay | Strict phase gates; MVP = P0–P3 |

---

## Execution Order (Agent Workflow)

When implementation begins, follow this exact sequence:

```
Week 1–2:   Research → Validate sources → Design architecture → Create schema
Week 3–5:   Build collectors → Build ETL → Seed diseases → Verify data in DB
Week 6–8:   Build backend API → Auth → Tests
Week 9–11:  Build frontend pages → 10YL components → Dashboard
Week 12–14: Build maps → Early warning → AI modules → Vaccination
Week 15–18: Build scrapers → Observability → E2E tests → Deploy guides
Week 19–20: Test → Document → Production hardening
```

At each step: document decisions, assumptions, and trade-offs in commit messages and `docs/`.

---

*Plan version: 1.0 · Created: 2026-06-01 · Status: Ready for implementation*
