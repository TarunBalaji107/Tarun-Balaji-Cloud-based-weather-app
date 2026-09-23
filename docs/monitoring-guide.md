# Observability & Monitoring Guide

## Application Insights Telemetry
The application exports real-time metrics to Azure Application Insights:
- **Requests**: Function invocation volume and duration percentiles (P50, P95, P99).
- **Dependencies**: Cosmos DB roundtrips and Azure OpenAI completion tokens.
- **Failures**: HTTP 5xx responses and circuit breaker trips.

## Key SLOs
- **Availability**: 99.9% uptime over rolling 30-day window.
- **P95 Latency**: < 150 ms for `/api/weather/current`.
- **Cosmos DB 429 Throttle Rate**: < 0.01% of requests.
