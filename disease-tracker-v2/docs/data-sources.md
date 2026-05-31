# Data Source Validation Report

> Living document — updated by `python scripts/validate_sources.py`

## Tier 1 — API-first (Primary)

| Source | Endpoint | Reliability | Update | Coverage | License |
|---|---|---|---|---|---|
| WHO Disease Outbreak News | `https://www.who.int/api/news/diseaseoutbreaknews` | **95** | Event-driven | Global | Public (WHO terms) |
| CDC Open Data (SODA) | `https://data.cdc.gov/api/v3/views/{id}/query.json` | **90** | Daily–weekly | US | Public domain |
| Our World in Data | GitHub CSV | **88** | Daily | Global | CC BY |

## Tier 2 — RSS Feeds

| Source | Reliability | Notes |
|---|---|---|
| ECDC Threat Reports | **82** | EU focus |
| CDC Travel Health Notices | **85** | Travel-oriented |

## Rejected Sources

- GISAID — restricted redistribution
- Dashboard JSON proxies — unstable API contracts
- Social media — legal/ethical risk

## Validation Scoring

| Metric | Weight |
|---|---|
| Uptime (30-day) | 30% |
| Freshness | 25% |
| Schema stability | 20% |
| Data completeness | 15% |
| Legal clarity | 10% |

Auto-disable if reliability < 50 for 7 consecutive days.
