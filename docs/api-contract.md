# REST API Contract & Schema Invariants

All endpoints accept and produce `application/json` with UTF-8 encoding.

## Endpoints

### 1. `GET /api/weather/current`
Query parameters:
- `city` (string, optional): Target city name (e.g. `London`).
- `lat` (float, optional): Latitude coordinate.
- `lon` (float, optional): Longitude coordinate.
- `countryCode` (string, optional): ISO-3166 code.

Sample Response:
```json
{
  "city": "London",
  "country": "United Kingdom",
  "coordinates": { "lat": 51.5074, "lon": -0.1278 },
  "temperature": 16.4,
  "apparentTemperature": 15.8,
  "weatherCode": 1,
  "weatherDescription": "Mainly clear",
  "humidity": 68,
  "windSpeed": 14.2,
  "pressure": 1018.4,
  "uvIndex": 4.2,
  "visibility": 10.0,
  "cloudCover": 25,
  "isDay": true,
  "lastUpdated": "14:20:00 UTC",
  "airQuality": {
    "aqi": 34,
    "status": "Good"
  }
}
```

### 2. `GET /api/weather/forecast`
Delivers 7-day daily models and 24-hour synoptic hourly vectors.

### 3. `GET /api/favorites` & `POST /api/favorites`
Cosmos DB persistence endpoints for monitored observation nodes.

### 4. `GET /api/health`
Aggregated health probe returning latency and circuit breaker status.
