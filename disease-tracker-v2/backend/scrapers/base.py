"""Ethical scraping utilities — robots.txt compliance and rate limiting."""

from __future__ import annotations

import asyncio
from urllib.parse import urlparse
from urllib.robotparser import RobotFileParser

import httpx
import structlog

from app.core.config import settings

logger = structlog.get_logger(__name__)

_robots_cache: dict[str, RobotFileParser] = {}


async def check_robots_allowed(url: str, path: str = "/") -> bool:
    """Return True if our bot is allowed to fetch the given URL path."""
    parsed = urlparse(url)
    base = f"{parsed.scheme}://{parsed.netloc}"
    if base not in _robots_cache:
        rp = RobotFileParser()
        robots_url = f"{base}/robots.txt"
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(robots_url, headers={"User-Agent": settings.user_agent})
            if resp.status_code == 200:
                rp.parse(resp.text.splitlines())
            else:
                rp.parse([])
        except Exception as exc:
            logger.warning("robots_fetch_failed", url=robots_url, error=str(exc))
            rp.parse([])
        _robots_cache[base] = rp
    return _robots_cache[base].can_fetch(settings.user_agent, path)


async def rate_limited_fetch(url: str, *, delay_seconds: float = 2.0) -> httpx.Response:
    """Fetch a URL with standard rate limiting and user-agent."""
    if not await check_robots_allowed(url):
        raise PermissionError(f"robots.txt disallows fetching {url}")
    await asyncio.sleep(delay_seconds)
    async with httpx.AsyncClient(timeout=30.0) as client:
        return await client.get(url, headers={"User-Agent": settings.user_agent})
