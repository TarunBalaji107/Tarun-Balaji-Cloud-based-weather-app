export type ComponentHealthStatus = 'Healthy' | 'Degraded' | 'Unhealthy';

export interface ServiceHealthMetric {
  name: string;
  type: 'AzureFunction' | 'CosmosDB' | 'ApplicationInsights' | 'OpenAI' | 'ExternalWeatherAPI' | 'EventGrid';
  status: ComponentHealthStatus;
  latencyMs: number;
  uptimePercent: number;
  lastChecked: string;
  region: string;
  details: {
    endpoint?: string;
    requestCount24h?: number;
    errorRatePercent?: number;
    consumedRUs?: number;
    activeConnections?: number;
    circuitBreakerState?: 'Closed' | 'Half-Open' | 'Open';
  };
}

export interface SystemHealthSummary {
  overallStatus: ComponentHealthStatus;
  healthyCount: number;
  totalServices: number;
  averageLatencyMs: number;
  errorRate24h: number;
  lastDeploymentTimestamp: string;
  services: ServiceHealthMetric[];
}

export interface EnvironmentReleaseInfo {
  environment: 'Dev' | 'QA' | 'Prod';
  version: string;
  commitHash: string;
  deployedAt: string;
  qualityScore: number; // 0-100
  smokeTestPassRate: number; // 0-100
  totalTests: number;
  passedTests: number;
  failedTests: number;
  latencyAvgMs: number;
  status: 'Healthy' | 'Warning' | 'Deploying' | 'Failed';
  releaseLead: string;
  pipelineRunId: string;
}
