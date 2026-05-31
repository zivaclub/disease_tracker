"""AI services for 10YL explanations and risk prediction."""

from __future__ import annotations

import json
from typing import Any

import httpx
import structlog

from app.core.config import settings
from app.domain.models import Alert, Disease, Outbreak

logger = structlog.get_logger(__name__)


def _mock_explain_10yl(disease: Disease, outbreak: Outbreak) -> str:
    edu = disease.education
    how_spreads = (edu.how_spreads if edu else None) or "It can spread when people are close together."
    return f"""### 🌟 Hello Little Epidemiologist! Here is the situation briefing in {outbreak.country}:

**What is happening?**
Right now, in **{outbreak.city or outbreak.country}**, some people have caught a bug called **{disease.name}**. There are currently **{outbreak.cases}** active cases being tracked by friendly local healthcare workers.

**How does it move?**
{how_spreads}

**How can you stay safe and be a super helper?**
1. **🧼 Bubbles are best!** Scrub your hands for at least twenty seconds after playing.
2. **🍎 Wash before crunching!** Keep fruits rinsed and crisp.
3. **💤 Rest up!** Sleep gives your body's white blood cells the energy they need to protect you.

Don't worry! Doctors, nurses, and researchers are working around the clock to stop the spread. You are safe!"""


def _mock_risk(country: str, outbreaks: list[Outbreak]) -> dict[str, Any]:
    has = len(outbreaks) > 0
    level = "Medium" if has else "Low"
    explanation = (
        f"There is an active outbreak of {outbreaks[0].disease_name} being monitored in {country}."
        if has
        else f"The playground situation in {country} looks standard. No severe emerging outbreaks registered near schools."
    )
    steps = (
        [
            "Avoid standing water where insects like to breed.",
            "Wear sleeves when playing outside in woodlands.",
            "Get plenty of sleep so your immune shield stays strong!",
        ]
        if has
        else [
            "Scrub your hands with soapy bubbles after playing tag.",
            "Stay hydrated and drink clean water.",
            "Stay home and rest if your forehead feels warm.",
        ]
    )
    return {"riskLevel": level, "explanation": explanation, "actionSteps": steps}


async def explain_outbreak(
    disease: Disease,
    outbreak: Outbreak,
    custom_prompt: str | None = None,
) -> dict[str, Any]:
    prompt = f"""
You are a friendly pediatrician explaining to a 10-year-old child.
Explain the outbreak in {outbreak.country}, {outbreak.region}:
Disease: {disease.name} ({disease.disease_type})
Location: {outbreak.city}, {outbreak.country}
Cases: {outbreak.cases}, Deaths: {outbreak.deaths}
What it is: "{disease.education.what_is_it if disease.education else disease.name}"
How it spreads: "{disease.education.how_spreads if disease.education else 'Contact with sick people'}"
Question: "{custom_prompt or 'Explain simply and how kids can stay safe.'}"
Use short sentences, positive tone, no jargon, include emoji where helpful.
"""
    if settings.gemini_api_key and settings.gemini_api_key != "MY_GEMINI_API_KEY":
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                resp = await client.post(
                    f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={settings.gemini_api_key}",
                    json={"contents": [{"parts": [{"text": prompt}]}]},
                )
                resp.raise_for_status()
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return {"summary": text, "isSimulated": False}
        except Exception as exc:
            logger.warning("gemini_explain_failed", error=str(exc))
            return {
                "summary": _mock_explain_10yl(disease, outbreak),
                "isSimulated": True,
                "error": "AI provider unavailable; using verified handbook explanation.",
            }
    return {"summary": _mock_explain_10yl(disease, outbreak), "isSimulated": True}


async def predict_risk(
    country: str,
    age: int,
    habits: str | None,
    outbreaks: list[Outbreak],
    alerts: list[Alert],
) -> dict[str, Any]:
    prompt = f"""
You are a friendly public health assistant for a 10-year-old aged {age} in {country}.
Habits: {habits or "Standard outdoor play"}
Active outbreaks: {len(outbreaks)} — {[o.disease_name for o in outbreaks]}
Alerts: {[a.title for a in alerts]}
Return JSON only: {{"riskLevel":"Low"|"Medium"|"High","explanation":"...","actionSteps":["...","...","..."]}}
Positive tone, no fear tactics.
"""
    if settings.gemini_api_key and settings.gemini_api_key != "MY_GEMINI_API_KEY":
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                resp = await client.post(
                    f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={settings.gemini_api_key}",
                    json={
                        "contents": [{"parts": [{"text": prompt}]}],
                        "generationConfig": {"responseMimeType": "application/json"},
                    },
                )
                resp.raise_for_status()
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return json.loads(text)
        except Exception as exc:
            logger.warning("gemini_risk_failed", error=str(exc))
    return _mock_risk(country, outbreaks)
