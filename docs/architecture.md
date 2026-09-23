# Cloud Weather Intelligence Platform: Architecture & Technical Blueprint

## 1. System Vision
The Cloud Weather Intelligence Platform provides sub-second synoptic meteorological telemetry, predictive hazard scoring, and operational risk mitigation for mission-critical industries including Aviation, Maritime Logistics, Cloud Datacenter Cooling, and Regional Power Grids.

## 2. Component Topology

```
┌──────────────────────────────────────────────────────────────┐
│                  Global Satellite Feed                       │
│                (Open-Meteo / WMO Ingestion)                  │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│       Azure Function App (.NET 8 Isolated Worker)            │
│   ┌───────────────────────┬───────────────────────────────┐  │
│   │ CurrentWeatherFunction│ ForecastFunction              │  │
│   ├───────────────────────┼───────────────────────────────┤  │
│   │ FavoriteCitiesFunction│ AlertsFunction                │  │
│   ├───────────────────────┼───────────────────────────────┤  │
│   │ AIInsightsFunction    │ HealthFunction                │  │
│   └───────────────────────┴───────────────────────────────┘  │
└───┬───────────────────────────┬───────────────────────────┬──┘
    │                           │                           │
    ▼                           ▼                           ▼
┌──────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ Azure Cosmos │       │ Azure OpenAI    │       │ Application     │
│ DB (NoSQL)   │       │ (GPT-4o Proxy)  │       │ Insights APM    │
└──────────────┘       └─────────────────┘       └─────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│           React 19 Frontend Presentation Layer               │
│        (Tailwind CSS · Synoptic Grid · Release Center)       │
└──────────────────────────────────────────────────────────────┘
```

## 3. Azure Cosmos DB Multi-Region Design
- **Partition Key**: `/partitionKey` set to the ISO-3166 2-letter Country Code in uppercase (e.g. `US`, `GB`, `JP`).
- **Throughput**: Autoscale tier between 400 RU/s and 4,000 RU/s.
- **Consistency**: Session consistency, guaranteeing monotonic read operations for each client session.

## 4. Azure OpenAI Weather Hazard Modeling
- Model: `gpt-4o` hosted in East US.
- Focus: Translating raw meteorological vectors (shear, saturation, convective energy, barometric drops) into high-confidence sector directives.
