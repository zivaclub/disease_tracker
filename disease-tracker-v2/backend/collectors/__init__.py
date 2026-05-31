"""Data collectors for external health sources."""

from collectors.base import BaseCollector, CollectorRecord
from collectors.rss_collector import RssCollector
from collectors.who_don import WhoDonCollector

__all__ = ["BaseCollector", "CollectorRecord", "RssCollector", "WhoDonCollector"]
