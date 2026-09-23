import React from 'react';
import { Server, Database, Activity, Cpu, Globe, Zap } from 'lucide-react';
import { ServiceHealthMetric } from '../../types/health';
import { StatusChip } from './StatusChip';

interface HealthCardProps {
  service: ServiceHealthMetric;
  onPing?: (name: string) => void;
  isPinging?: boolean;
}

export const HealthCard: React.FC<HealthCardProps> = ({ service, onPing, isPinging }) => {
  const getServiceIcon = (type: ServiceHealthMetric['type']) => {
    switch (type) {
      case 'CosmosDB':
        return <Database className="w-5 h-5 text-indigo-400" />;
      case 'ApplicationInsights':
        return <Activity className="w-5 h-5 text-emerald-400" />;
      case 'OpenAI':
        return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'ExternalWeatherAPI':
        return <Globe className="w-5 h-5 text-sky-400" />;
      default:
        return <Server className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              {getServiceIcon(service.type)}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white leading-tight">
                {service.name}
              </h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {service.region}
              </p>
            </div>
          </div>
          <StatusChip status={service.status} />
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[11px]">Roundtrip Latency</span>
            <span className="text-sm font-bold text-white tabular-nums">
              {service.latencyMs} ms
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">24h Availability</span>
            <span className="text-sm font-bold text-emerald-400 tabular-nums">
              {service.uptimePercent}%
            </span>
          </div>

          {service.details.errorRatePercent !== undefined && (
            <div>
              <span className="text-slate-400 block text-[11px]">Error Rate</span>
              <span className="text-slate-300 tabular-nums">
                {service.details.errorRatePercent.toFixed(2)}%
              </span>
            </div>
          )}

          {service.details.circuitBreakerState && (
            <div>
              <span className="text-slate-400 block text-[11px]">Circuit Breaker</span>
              <span className="text-emerald-400">
                {service.details.circuitBreakerState}
              </span>
            </div>
          )}

          {service.details.consumedRUs !== undefined && (
            <div>
              <span className="text-slate-400 block text-[11px]">Allocated RU/s</span>
              <span className="text-slate-300 tabular-nums">
                {service.details.consumedRUs} RU/s
              </span>
            </div>
          )}

          {service.details.requestCount24h !== undefined && (
            <div>
              <span className="text-slate-400 block text-[11px]">24h Throughput</span>
              <span className="text-slate-300 tabular-nums">
                {(service.details.requestCount24h / 1000).toFixed(1)}k req
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer endpoint & Ping action */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <span className="truncate max-w-[180px]">
          {service.details.endpoint || 'Internal VNet Service'}
        </span>
        {onPing && (
          <button
            onClick={() => onPing(service.name)}
            disabled={isPinging}
            className="text-xs text-cyan-400 hover:text-cyan-300 disabled:opacity-50 transition-colors"
          >
            {isPinging ? 'Pinging...' : 'Send Probe'}
          </button>
        )}
      </div>
    </div>
  );
};
