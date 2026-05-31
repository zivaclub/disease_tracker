"""Country name to approximate coordinates for map visualization."""

COUNTRY_COORDINATES: dict[str, tuple[float, float]] = {
    "india": (20.5937, 78.9629),
    "uganda": (1.3733, 32.2903),
    "nigeria": (9.0820, 8.6753),
    "democratic republic of the congo": (-4.0383, 21.7587),
    "drc": (-4.0383, 21.7587),
    "brazil": (-14.2350, -51.9253),
    "argentina": (-38.4161, -63.6167),
    "united states": (37.0902, -95.7129),
    "usa": (37.0902, -95.7129),
    "united kingdom": (55.3781, -3.4360),
    "france": (46.2276, 2.2137),
    "germany": (51.1657, 10.4515),
    "china": (35.8617, 104.1954),
    "pakistan": (30.3753, 69.3451),
    "bangladesh": (23.6850, 90.3563),
    "indonesia": (-0.7893, 113.9213),
    "philippines": (12.8797, 121.7740),
    "thailand": (15.8700, 100.9925),
    "vietnam": (14.0583, 108.2772),
    "mexico": (23.6345, -102.5528),
    "peru": (-9.1900, -75.0152),
    "ethiopia": (9.1450, 40.4897),
    "kenya": (-0.0236, 37.9062),
    "south africa": (-30.5595, 22.9375),
    "australia": (-25.2744, 133.7751),
    "canada": (56.1304, -106.3468),
    "spain": (40.4637, -3.7492),
    "italy": (41.8719, 12.5674),
    "japan": (36.2048, 138.2529),
    "global": (0.0, 0.0),
    "multiple countries": (0.0, 0.0),
}


def resolve_coordinates(country: str | None) -> tuple[float, float]:
    if not country:
        return (0.0, 0.0)
    key = country.strip().lower()
    if key in COUNTRY_COORDINATES:
        return COUNTRY_COORDINATES[key]
    for name, coords in COUNTRY_COORDINATES.items():
        if name in key or key in name:
            return coords
    return (0.0, 0.0)
