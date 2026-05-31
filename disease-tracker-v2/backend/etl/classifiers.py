"""Keyword-based disease classification for ingested titles and summaries."""

import re
from typing import NamedTuple


class ClassificationResult(NamedTuple):
    disease_slug: str | None
    confidence: float
    matched_keyword: str | None


DISEASE_KEYWORDS: dict[str, list[str]] = {
    "covid-19": [
        "covid",
        "covid-19",
        "coronavirus",
        "sars-cov-2",
        "sars cov",
    ],
    "dengue": ["dengue", "breakbone"],
    "malaria": ["malaria", "plasmodium", "anopheles"],
    "measles": ["measles", "rubeola"],
    "tuberculosis": ["tuberculosis", "tb ", " tb,", "mycobacterium"],
    "cholera": ["cholera", "vibrio cholerae"],
    "ebola": ["ebola", "ebolavirus"],
    "nipah": ["nipah"],
    "h1n1": ["h1n1", "swine flu", "influenza a(h1n1)", "influenza a (h1n1)"],
    "monkeypox": ["monkeypox", "mpox"],
    "polio": ["polio", "poliomyelitis", "poliovirus"],
}


def classify_text(text: str) -> ClassificationResult:
    """Return the best-matching disease slug for free text, or None."""
    normalized = re.sub(r"\s+", " ", text.lower()).strip()
    if not normalized:
        return ClassificationResult(None, 0.0, None)

    best_slug: str | None = None
    best_score = 0.0
    best_keyword: str | None = None

    for slug, keywords in DISEASE_KEYWORDS.items():
        for keyword in keywords:
            pattern = re.escape(keyword.lower())
            if re.search(rf"\b{pattern}\b", normalized) or keyword.lower() in normalized:
                score = len(keyword) / max(len(normalized), 1) + (0.5 if slug in normalized else 0)
                if score > best_score:
                    best_score = score
                    best_slug = slug
                    best_keyword = keyword

    confidence = min(1.0, best_score * 2) if best_slug else 0.0
    return ClassificationResult(best_slug, confidence, best_keyword)
