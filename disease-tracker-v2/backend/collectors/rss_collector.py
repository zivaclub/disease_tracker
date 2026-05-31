"""Generic RSS feed collector for ECDC, CDC, and similar sources."""

from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from typing import Any

import feedparser
import httpx
import structlog

from app.core.config import settings
from collectors.base import BaseCollector, CollectorRecord

logger = structlog.get_logger(__name__)


class RssCollector(BaseCollector):
    """Fetches and parses RSS/Atom feeds via feedparser."""

    def __init__(self, source_id: str, source_name: str, feed_url: str) -> None:
        super().__init__(source_id, source_name)
        self.feed_url = feed_url

    def _headers(self) -> dict[str, str]:
        return {"User-Agent": settings.user_agent, "Accept": "application/rss+xml, application/xml, */*"}

    def _parse_entry_date(self, entry: Any) -> datetime | None:
        for attr in ("published_parsed", "updated_parsed"):
            parsed = getattr(entry, attr, None)
            if parsed:
                try:
                    return datetime(*parsed[:6], tzinfo=timezone.utc)
                except (TypeError, ValueError):
                    pass
        for attr in ("published", "updated"):
            raw = getattr(entry, attr, None)
            if raw:
                try:
                    return parsedate_to_datetime(raw)
                except (TypeError, ValueError):
                    pass
        return None

    def _entry_id(self, entry: Any, index: int) -> str:
        return str(getattr(entry, "id", None) or getattr(entry, "link", None) or f"{self.source_id}-{index}")

    async def fetch(self, *, limit: int = 50) -> list[CollectorRecord]:
        async with httpx.AsyncClient() as client:
            response = await client.get(self.feed_url, headers=self._headers(), timeout=30.0)
            response.raise_for_status()
            content = response.text

        parsed = feedparser.parse(content)
        records: list[CollectorRecord] = []
        for index, entry in enumerate(parsed.entries[:limit]):
            title = str(getattr(entry, "title", "") or "Untitled")
            summary = str(
                getattr(entry, "summary", None)
                or getattr(entry, "description", None)
                or ""
            )
            link = str(getattr(entry, "link", "") or self.feed_url)
            records.append(
                CollectorRecord(
                    external_id=self._entry_id(entry, index),
                    title=title,
                    summary=summary[:2000],
                    url=link,
                    published_at=self._parse_entry_date(entry),
                    raw=dict(entry) if hasattr(entry, "keys") else {"title": title, "link": link},
                )
            )
        logger.info("rss_fetched", source_id=self.source_id, count=len(records))
        return records

    async def health_check(self) -> dict[str, Any]:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.head(
                    self.feed_url,
                    headers=self._headers(),
                    timeout=15.0,
                    follow_redirects=True,
                )
            ok = response.status_code < 400
            return {
                "source_id": self.source_id,
                "healthy": ok,
                "status_code": response.status_code,
                "feed_url": self.feed_url,
                "checked_at": datetime.now(timezone.utc).isoformat(),
            }
        except Exception as exc:
            logger.warning("rss_health_failed", source_id=self.source_id, error=str(exc))
            return {
                "source_id": self.source_id,
                "healthy": False,
                "error": str(exc),
                "feed_url": self.feed_url,
                "checked_at": datetime.now(timezone.utc).isoformat(),
            }
