# Cloud Weather Intelligence Platform

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Quality Gate](https://img.shields.io/badge/quality%20score-98%2F100-brightgreen.svg)]()
[![Azure Functions](https://img.shields.io/badge/Azure%20Functions-Isolated%20Worker%20.NET%208-blue.svg)]()
[![Cosmos DB](https://img.shields.io/badge/Cosmos%20DB-Multi--Master%20NoSQL-informational.svg)]()
[![Azure DevOps](https://img.shields.io/badge/CI%2FCD-Azure%20Pipelines-blueviolet.svg)]()

Production-ready, enterprise-grade cloud weather intelligence and telemetry platform. Built with React 19, serverless Azure Functions (.NET 8 isolated worker), Cosmos DB NoSQL multi-region replication, Azure OpenAI weather hazard modeling, Application Insights observability, and automated Azure DevOps release pipelines with cross-environment smoke test verification.

---

## 🏛️ System Architecture

```
[ Real-Time Satellite & Ingestion Gateways ]
                    │
                    ▼
[ Azure Function App (Isolated Worker .NET 8) ]
   ├── CurrentWeatherFunction (/api/weather/current)
   ├── ForecastFunction (/api/weather/forecast)
   ├── FavoriteCitiesFunction (/api/favorites)
   ├── AlertsFunction (/api/weather/alerts)
   ├── AIInsightsFunction (/api/weather/insights)
   └── HealthFunction (/api/health)
        │                 │                  │
        ▼                 ▼                  ▼
[ Azure Cosmos DB ]  [ Azure OpenAI ]  [ Application Insights ]
 (Multi-Region NoSQL)  (Risk Modeling)     (Telemetry & APM)
        │
        ▼
[ React 19 + TypeScript Presentation Layer ]
  (Synoptic Weather · AI Insights · Alerts · Cloud Ops · Release Center)
```

---

## 📁 Repository Structure

- `frontend/`: React 19, Tailwind CSS, synoptic weather telemetry dashboard, responsive SVG charts, operations telemetry, and release quality gates.
- `backend/`: C# .NET 8 isolated worker Azure Functions, domain models, Cosmos DB repositories, and Azure OpenAI proxy services.
- `infrastructure/`: Declarative Azure Bicep templates for zero-downtime infrastructure provisioning.
- `pipelines/`: Azure DevOps YAML multi-stage pipelines with automated smoke testing gates and quality reporting.
- `tests/`: Smoke tests, API contract tests, Cypress E2E tests, and automated Python telemetry reporting.
- `docs/`: Comprehensive architecture specifications, API contracts, deployment instructions, monitoring guides, and operational runbooks.
- `reports/`: Release history and cross-environment execution dashboards.

---

## 🚀 Quick Start

### 1. Frontend Development
```bash
npm install
npm run dev
```

### 2. Backend Azure Functions
```bash
cd backend
func start
```

### 3. Automated Smoke Tests
```bash
./tests/smoke/api-contract-tests.sh --env=dev
```

---

## 📜 License
MIT License. See [LICENSE](LICENSE) for details.
