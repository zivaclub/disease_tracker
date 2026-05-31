"""WHO Disease Outbreak News OData collector."""

from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from typing import Any

import httpx
import structlog
from tenacity import retry, stop_after_attempt, wait_exponential

from app.core.config import settings
from collectors.base import BaseCollector, CollectorRecord

logger = structlog.get_logger(__name__)


class WhoDonCollector(BaseCollector):
    """Fetches disease outbreak news from the WHO OData API."""

    def __init__(self, source_id: str = "who-don", source_name: str = "WHO Disease Outbreak News") -> None:
        super().__init__(source_id, source_name)
        self.api_url = settings.who_don_api_url

    def _headers(self) -> dict[str, str]:
        return {
            "User-Agent": settings.user_agent,
            "Accept": "application/json",
        }

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    async def _get_page(self, client: httpx.AsyncClient, top: int) -> dict[str, Any]:
        params = {
            "$top": top,
            "$orderby": "PublicationDate desc",
        }
        response = await client.get(self.api_url, params=params, headers=self._headers(), timeout=30.0)
        response.raise_for_status()
        return response.json()

    def _parse_date(self, value: str | None) -> datetime | None:
        if not value:
            return None
        try:
            if value.endswith("Z"):
                return datetime.fromisoformat(value.replace("Z", "+00:00"))
            return datetime.fromisoformat(value)
        except ValueError:
            try:
                return parsedate_to_datetime(value)
            except (TypeError, ValueError):
                return None

    def _extract_country(self, item: dict[str, Any]) -> str | None:
        for key in ("Countries", "Country", "Location", "AffectedCountries"):
            val = item.get(key)
            if isinstance(val, str) and val.strip():
                return val.strip()
            if isinstance(val, list) and val:
                first = val[0]
                if isinstance(first, str):
                    return first
                if isinstance(first, dict):
                    return first.get("Name") or first.get("name")
        return None

    def _normalize_item(self, item: dict[str, Any]) -> CollectorRecord:
        external_id = str(
            item.get("Id")
            or item.get("ID")
            or item.get("id")
            or item.get("ItemDefaultUrl")
            or item.get("Title", "")[:80]
        )
        title = str(item.get("Title") or item.get("title") or "Untitled WHO DON")
        summary = str(
            item.get("Overview")
            or item.get("Summary")
            or item.get("Description")
            or item.get("overview")
            or ""
        )
        url = str(
            item.get("ItemDefaultUrl")
            or item.get("Url")
            or item.get("Link")
            or f"https://www.who.int/emergencies/disease-outbreak-news"
        )
        if url and not url.startswith("http"):
            url = f"https://www.who.int{url}"

        pub = self._parse_date(
            str(item.get("PublicationDate") or item.get("Date") or item.get("Created") or "")
        )

        return CollectorRecord(
            external_id=external_id,
            title=title,
            summary=summary[:2000],
            url=url,
            published_at=pub,
            country=self._extract_country(item),
            raw=item,
        )

    async def fetch(self, *, limit: int = 50) -> list[CollectorRecord]:
        async with httpx.AsyncClient() as client:
            payload = await self._get_page(client, top=limit)
        items = payload.get("value") or payload.get("items") or []
        records = [self._normalize_item(item) for item in items if isinstance(item, dict)]
        logger.info("who_don_fetched", count=len(records), source_id=self.source_id)
        return records

    async def health_check(self) -> dict[str, Any]:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    self.api_url,
                    params={"$top": 1},
                    headers=self._headers(),
                    timeout=15.0,
                )
            ok = response.status_code == 200
            return {
                "source_id": self.source_id,
                "healthy": ok,
                "status_code": response.status_code,
                "checked_at": datetime.now(timezone.utc).isoformat(),
            }
        except Exception as exc:
            logger.warning("who_don_health_failed", error=str(exc))
            return {
                "source_id": self.source_id,
                "healthy": False,
                "error": str(exc),
                "checked_at": datetime.now(timezone.utc).isoformat(),
            }
