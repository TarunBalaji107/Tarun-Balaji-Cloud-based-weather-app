import { EnvironmentReleaseInfo, ServiceHealthMetric, SystemHealthSummary } from '../types/health';

export const INITIAL_SERVICES_HEALTH: ServiceHealthMetric[] = [
  {
    name: 'CurrentWeatherFunction (Azure Function App)',
    type: 'AzureFunction',
    status: 'Healthy',
    latencyMs: 38,
    uptimePercent: 99.98,
    lastChecked: 'Just now',
    region: 'East US 2',
    details: {
      endpoint: '/api/weather/current',
      requestCount24h: 184200,
      errorRatePercent: 0.02,
      circuitBreakerState: 'Closed',
    },
  },
  {
    name: 'ForecastFunction (Azure Function App)',
    type: 'AzureFunction',
    status: 'Healthy',
    latencyMs: 44,
    uptimePercent: 99.95,
    lastChecked: 'Just now',
    region: 'East US 2',
    details: {
      endpoint: '/api/weather/forecast',
      requestCount24h: 142100,
      errorRatePercent: 0.04,
      circuitBreakerState: 'Closed',
    },
  },
  {
    name: 'FavoriteCitiesFunction (Azure Function App)',
    type: 'AzureFunction',
    status: 'Healthy',
    latencyMs: 29,
    uptimePercent: 99.99,
    lastChecked: 'Just now',
    region: 'East US 2',
    details: {
      endpoint: '/api/favorites',
      requestCount24h: 68900,
      errorRatePercent: 0.01,
      circuitBreakerState: 'Closed',
    },
  },
  {
    name: 'AlertsFunction (Azure Function App)',
    type: 'AzureFunction',
    status: 'Healthy',
    latencyMs: 31,
    uptimePercent: 99.97,
    lastChecked: 'Just now',
    region: 'East US 2',
    details: {
      endpoint: '/api/weather/alerts',
      requestCount24h: 91500,
      errorRatePercent: 0.03,
      circuitBreakerState: 'Closed',
    },
  },
  {
    name: 'AIInsightsFunction (Azure OpenAI Proxy)',
    type: 'OpenAI',
    status: 'Healthy',
    latencyMs: 182,
    uptimePercent: 99.89,
    lastChecked: 'Just now',
    region: 'East US',
    details: {
      endpoint: '/api/weather/insights',
      requestCount24h: 42300,
      errorRatePercent: 0.12,
      circuitBreakerState: 'Closed',
    },
  },
  {
    name: 'Cosmos DB NoSQL Database',
    type: 'CosmosDB',
    status: 'Healthy',
    latencyMs: 12,
    uptimePercent: 99.999,
    lastChecked: 'Just now',
    region: 'East US 2 (Multi-Master Failover: West US 2)',
    details: {
      consumedRUs: 420,
      activeConnections: 32,
      errorRatePercent: 0.00,
      circuitBreakerState: 'Closed',
    },
  },
  {
    name: 'Application Insights Telemetry Workspace',
    type: 'ApplicationInsights',
    status: 'Healthy',
    latencyMs: 18,
    uptimePercent: 99.99,
    lastChecked: 'Just now',
    region: 'East US 2',
    details: {
      endpoint: 'dc.applicationinsights.azure.com',
      requestCount24h: 1250000,
      errorRatePercent: 0.00,
    },
  },
  {
    name: 'Open-Meteo & ECMWF Satellite Ingestion Gateway',
    type: 'ExternalWeatherAPI',
    status: 'Healthy',
    latencyMs: 76,
    uptimePercent: 99.94,
    lastChecked: 'Just now',
    region: 'Global Edge Anycast',
    details: {
      endpoint: 'api.open-meteo.com',
      requestCount24h: 310000,
      errorRatePercent: 0.05,
      circuitBreakerState: 'Closed',
    },
  },
];

export const MOCK_RELEASES: EnvironmentReleaseInfo[] = [
  {
    environment: 'Prod',
    version: 'v2.4.1',
    commitHash: 'a9c8e14',
    deployedAt: '2026-09-22 14:15 UTC',
    qualityScore: 98,
    smokeTestPassRate: 100,
    totalTests: 42,
    passedTests: 42,
    failedTests: 0,
    latencyAvgMs: 42,
    status: 'Healthy',
    releaseLead: 'Cloud Release Pipeline',
    pipelineRunId: '#20260922.4',
  },
  {
    environment: 'QA',
    version: 'v2.5.0-rc2',
    commitHash: 'b4f71a9',
    deployedAt: '2026-09-23 01:40 UTC',
    qualityScore: 95,
    smokeTestPassRate: 97.6,
    totalTests: 42,
    passedTests: 41,
    failedTests: 1,
    latencyAvgMs: 49,
    status: 'Healthy',
    releaseLead: 'DevOps Automated Gate',
    pipelineRunId: '#20260923.1',
  },
  {
    environment: 'Dev',
    version: 'v2.5.1-alpha',
    commitHash: 'e398d20',
    deployedAt: '2026-09-23 03:10 UTC',
    qualityScore: 92,
    smokeTestPassRate: 95.2,
    totalTests: 42,
    passedTests: 40,
    failedTests: 2,
    latencyAvgMs: 54,
    status: 'Warning',
    releaseLead: 'CI GitHub Runner',
    pipelineRunId: '#20260923.3',
  },
];

export async function fetchSystemHealth(): Promise<SystemHealthSummary> {
  const services = INITIAL_SERVICES_HEALTH;
  const healthyCount = services.filter((s) => s.status === 'Healthy').length;
  const avgLatency = Math.round(
    services.reduce((acc, s) => acc + s.latencyMs, 0) / services.length
  );

  return {
    overallStatus: healthyCount === services.length ? 'Healthy' : 'Degraded',
    healthyCount,
    totalServices: services.length,
    averageLatencyMs: avgLatency,
    errorRate24h: 0.03,
    lastDeploymentTimestamp: '2026-09-22 14:15 UTC',
    services,
  };
}

export async function fetchEnvironmentReleases(): Promise<EnvironmentReleaseInfo[]> {
  return MOCK_RELEASES;
}
