from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any


@dataclass
class CollectorRecord:
    """Normalized raw record from any collector."""

    external_id: str
    title: str
    summary: str
    url: str
    published_at: datetime | None
    country: str | None = None
    region: str | None = None
    raw: dict[str, Any] = field(default_factory=dict)


class BaseCollector(ABC):
    """Abstract base for health data collectors."""

    source_id: str
    source_name: str

    def __init__(self, source_id: str, source_name: str) -> None:
        self.source_id = source_id
        self.source_name = source_name

    @abstractmethod
    async def fetch(self, *, limit: int = 50) -> list[CollectorRecord]:
        """Fetch and normalize records from the upstream source."""

    @abstractmethod
    async def health_check(self) -> dict[str, Any]:
        """Verify connectivity and return status metadata."""
