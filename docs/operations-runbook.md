# Operations Runbook: Standard Operating Procedures

## Incident Response Matrix

### 1. High External API Latency (> 500ms)
- **Symptom**: Function App logs show upstream delays from satellite ingestion feeds.
- **Action**: Verify that Polly Circuit Breaker is active. The system automatically serves cached synoptic data with the `stale-revalidate` header.

### 2. Severe Storm Surge Telemetry
- **Symptom**: Wind gusts > 90 km/h or rainfall > 40 mm/hr detected.
- **Action**: Alert thresholds notify Azure DevOps pipeline webhooks. Operations team triggers automated Datacenter HVAC airflow throttles.

### 3. Cosmos DB Rate Limiting (HTTP 429)
- **Symptom**: Cosmos DB reports consumed RUs hitting max limit.
- **Action**: Autoscale settings automatically increase RUs to 4,000 RU/s. If persistent, increase container autoscale maximum in `infrastructure/bicep/cosmosdb.bicep`.
