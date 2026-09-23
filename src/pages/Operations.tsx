import React, { useState } from 'react';
import { SystemHealthSummary, ServiceHealthMetric } from '../types/health';
import { HealthCard } from '../components/operations/HealthCard';
import { StatusChip } from '../components/operations/StatusChip';
import { Server, Activity, Database, RefreshCw, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface OperationsProps {
  systemHealth: SystemHealthSummary | null;
  onRefreshHealth: () => void;
}

export const Operations: React.FC<OperationsProps> = ({
  systemHealth,
  onRefreshHealth,
}) => {
  const [pingingService, setPingingService] = useState<string | null>(null);
  const [pingResults, setPingResults] = useState<Record<string, string>>({});

  const handlePing = async (name: string) => {
    setPingingService(name);
    await new Promise((res) => setTimeout(res, 400));
    setPingResults((prev) => ({
      ...prev,
      [name]: `200 OK · ${Math.round(20 + Math.random() * 35)}ms latency`,
    }));
    setPingingService(null);
  };

  if (!systemHealth) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-900">
        <div>
          <div className="flex items-center space-x-2">
            <Server className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">
              Cloud Infrastructure Operations & Telemetry
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Azure Functions · Cosmos DB Multi-Region NoSQL · Application Insights
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <StatusChip
            status={systemHealth.overallStatus}
            label={`System Status: ${systemHealth.overallStatus}`}
          />
          <button
            onClick={onRefreshHealth}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 font-mono">
          <span className="text-xs text-slate-400 block font-sans">Healthy Services</span>
          <div className="mt-1 flex items-baseline space-x-1">
            <span className="text-2xl font-extrabold text-emerald-400 tabular-nums">
              {systemHealth.healthyCount}
            </span>
            <span className="text-xs text-slate-500">/ {systemHealth.totalServices}</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">100% Operational Target</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 font-mono">
          <span className="text-xs text-slate-400 block font-sans">Mean Roundtrip Latency</span>
          <div className="mt-1 flex items-baseline space-x-1">
            <span className="text-2xl font-extrabold text-white tabular-nums">
              {systemHealth.averageLatencyMs}
            </span>
            <span className="text-xs text-slate-400">ms</span>
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block">SLA Target &lt; 150ms</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 font-mono">
          <span className="text-xs text-slate-400 block font-sans">24h System Error Rate</span>
          <div className="mt-1 flex items-baseline space-x-1">
            <span className="text-2xl font-extrabold text-white tabular-nums">
              {systemHealth.errorRate24h}
            </span>
            <span className="text-xs text-slate-400">%</span>
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block">Within 99.9% SLO</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 font-mono">
          <span className="text-xs text-slate-400 block font-sans">Telemetry Stream</span>
          <div className="mt-1 flex items-center space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-bold text-white">Live Ingestion</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block truncate">
            Last deploy: {systemHealth.lastDeploymentTimestamp}
          </span>
        </div>
      </div>

      {/* Probe feedback banner if active */}
      {Object.keys(pingResults).length > 0 && (
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Latest Probe Result:</span>
          <span className="text-cyan-400">
            {Object.entries(pingResults).slice(-1)[0][0]}: {Object.entries(pingResults).slice(-1)[0][1]}
          </span>
        </div>
      )}

      {/* Services Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-200">
          Individual Microservice Health & Circuit Status
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {systemHealth.services.map((service) => (
            <HealthCard
              key={service.name}
              service={service}
              onPing={handlePing}
              isPinging={pingingService === service.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
