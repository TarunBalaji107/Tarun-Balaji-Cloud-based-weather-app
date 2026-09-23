import React, { useState } from 'react';
import { Settings as SettingsIcon, Server, Database, GitBranch, Cpu, Code2, ShieldCheck, FileCode } from 'lucide-react';

interface SettingsProps {
  tempUnit: 'celsius' | 'fahrenheit';
  onToggleUnit: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ tempUnit, onToggleUnit }) => {
  const [selectedDoc, setSelectedDoc] = useState<'architecture' | 'api' | 'deployment' | 'runbook'>('architecture');

  const architectureDocs = {
    architecture: {
      title: 'Cloud Architecture & Topology',
      subtitle: 'Azure Functions + Cosmos DB + Azure OpenAI + Azure DevOps',
      content: `### High-Level Topology
1. **Frontend Presentation**: React 19 + TypeScript SPA styled with Tailwind CSS, hosting real-time satellite telemetry, synoptic charts, and operational consoles.
2. **Compute Tier**: Serverless Azure Functions (Isolated Worker Model, .NET 8 / C#) executing \`CurrentWeatherFunction\`, \`ForecastFunction\`, \`FavoriteCitiesFunction\`, \`AlertsFunction\`, \`AIInsightsFunction\`, and \`HealthFunction\`.
3. **Data Tier**: Azure Cosmos DB NoSQL account configured with multi-region replication (East US 2 primary, West US 2 replica). Partition keys routed by \`/cityCode\` for sub-10ms point reads.
4. **AI Intelligence Engine**: Azure OpenAI GPT-4o proxy generating domain-specific risk mitigation for Aviation, Logistics, Agriculture, and Cloud Datacenter power envelopes.
5. **Observability**: Azure Application Insights streaming live structured telemetry, circuit breaker metrics, and latency percentiles (P50, P95, P99).`,
    },
    api: {
      title: 'REST API Contract & Schema Invariants',
      subtitle: 'OpenAPI 3.1 & WMO Compliant Specifications',
      content: `### Key Endpoints
- **GET /api/weather/current**: Returns current temperature, barometric pressure, relative humidity, UV index, wind vectors, and air quality index (AQI).
- **GET /api/weather/forecast**: Delivers 7-day daily aggregates and 24-hour synoptic hourly projections.
- **GET /api/favorites**: Synchronizes monitored stations with Cosmos DB.
- **POST /api/favorites**: Registers new atmospheric observation station.
- **GET /api/weather/alerts**: Fetches active meteorologist bulletins and triggers threshold evaluations.
- **POST /api/weather/insights**: Runs AI synthesis across weather vectors to produce sector operational impacts.
- **GET /api/health**: Deep health probe reporting individual service latencies and circuit breaker states.`,
    },
    deployment: {
      title: 'Infrastructure as Code (IaC) & Deployment Guide',
      subtitle: 'Declarative Bicep Modules & Azure DevOps Multi-Stage Pipelines',
      content: `### Infrastructure as Code (Bicep)
- \`infrastructure/bicep/main.bicep\`: Orchestrates modular deployment across resource groups.
- \`infrastructure/bicep/cosmosdb.bicep\`: Provisions NoSQL Cosmos account with throughput autoscale.
- \`infrastructure/bicep/functionapp.bicep\`: Creates serverless Function App on consumption plan with staging slot.
- \`infrastructure/bicep/applicationinsights.bicep\`: Configures Log Analytics workspace.
- \`pipelines/azure-pipelines.yml\`: Multi-stage pipeline automating Build -> Dev Deploy -> Automated Smoke Gate -> QA Deploy -> Approval Gate -> Production Swap.`,
    },
    runbook: {
      title: 'Operations Runbook & Incident Response',
      subtitle: 'SOPs for High Weather Volatility and Cloud Resiliency',
      content: `### Operational Procedures
1. **Severe Weather Escalation**: When ambient winds exceed 65 km/h or flash flood rainfall exceeds 30 mm/h, the AlertsFunction fires automated webhooks into Azure DevOps incident boards.
2. **Datacenter Workload Rebalancing**: If regional ambient heat exceeds 38°C, operations engineers trigger geo-traffic routing to move compute to cooler alternate regions.
3. **Cosmos DB Throttling (429 mitigation)**: Cosmos DB autoscale scales between 400 RU/s and 4,000 RU/s automatically based on active burst traffic.
4. **Circuit Breaker Failover**: If external weather APIs experience degraded response times (>500ms), circuit breaker trips to half-open, serving cached satellite telemetry.`,
    },
  };

  const activeDoc = architectureDocs[selectedDoc];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-900">
        <div>
          <div className="flex items-center space-x-2">
            <SettingsIcon className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">
              Platform Architecture & Configuration
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            System Design Specifications · Azure Topology · Runbooks
          </p>
        </div>
      </div>

      {/* Preferences Grid */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white">
          System Preferences & Measurement Standard
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-t border-slate-800/80">
          <div>
            <span className="text-xs font-semibold text-slate-200 block">
              Temperature Unit Standard
            </span>
            <span className="text-xs text-slate-400">
              Toggle between Celsius (°C) and Fahrenheit (°F) across all synoptic cards and telemetry charts.
            </span>
          </div>

          <button
            onClick={onToggleUnit}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg text-xs font-mono font-bold transition-colors shrink-0"
          >
            Current Standard: {tempUnit === 'celsius' ? 'Celsius (°C)' : 'Fahrenheit (°F)'}
          </button>
        </div>
      </div>

      {/* Architecture Documentation Explorer */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Platform Documentation & Engineering Specifications
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Aligned with Enterprise Cloud Weather Intelligence Architecture
            </p>
          </div>

          {/* Doc Tabs */}
          <div className="flex items-center space-x-1 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setSelectedDoc('architecture')}
              className={`px-3 py-1 font-medium rounded-md transition-colors ${
                selectedDoc === 'architecture' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Architecture
            </button>
            <button
              onClick={() => setSelectedDoc('api')}
              className={`px-3 py-1 font-medium rounded-md transition-colors ${
                selectedDoc === 'api' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              API Contract
            </button>
            <button
              onClick={() => setSelectedDoc('deployment')}
              className={`px-3 py-1 font-medium rounded-md transition-colors ${
                selectedDoc === 'deployment' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Deployment & IaC
            </button>
            <button
              onClick={() => setSelectedDoc('runbook')}
              className={`px-3 py-1 font-medium rounded-md transition-colors ${
                selectedDoc === 'runbook' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Runbook
            </button>
          </div>
        </div>

        {/* Selected Doc Viewer */}
        <div className="p-5 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-3 font-mono text-xs">
          <div>
            <h4 className="text-sm font-bold text-cyan-300 font-sans">{activeDoc.title}</h4>
            <p className="text-slate-400 text-xs mt-0.5">{activeDoc.subtitle}</p>
          </div>
          <div className="border-t border-slate-800/80 pt-3 text-slate-300 whitespace-pre-wrap leading-relaxed font-sans text-xs">
            {activeDoc.content}
          </div>
        </div>
      </div>
    </div>
  );
};
