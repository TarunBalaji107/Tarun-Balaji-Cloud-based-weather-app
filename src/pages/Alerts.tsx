import React, { useState } from 'react';
import { AlertThresholdRule, WeatherAlert } from '../types/alert';
import { AlertCard } from '../components/alerts/AlertCard';
import { AlertTriangle, Bell, Sliders, CheckCircle2, ShieldAlert } from 'lucide-react';

interface AlertsProps {
  alerts: WeatherAlert[];
  rules: AlertThresholdRule[];
  onToggleRule: (id: string) => void;
  onUpdateRuleValue: (id: string, value: number) => void;
  cityName: string;
}

export const Alerts: React.FC<AlertsProps> = ({
  alerts,
  rules,
  onToggleRule,
  onUpdateRuleValue,
  cityName,
}) => {
  const [acknowledgedIds, setAcknowledgedIds] = useState<string[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const handleAcknowledge = (id: string) => {
    if (!acknowledgedIds.includes(id)) {
      setAcknowledgedIds([...acknowledgedIds, id]);
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filterSeverity === 'all') return true;
    return a.severity === filterSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-900">
        <div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold text-white">
              Severe Weather Alert & Hazard Ingestion Center
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            {alerts.length} Active System Bulletins · Automated Threshold Evaluation Engine
          </p>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
          {['all', 'critical', 'severe', 'moderate', 'minor'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1 font-medium capitalize rounded-md transition-colors ${
                filterSeverity === sev
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Active Bulletins Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
          <span>Active Severe Advisories & Bulletins</span>
          <span className="text-xs font-mono text-slate-500">({filteredAlerts.length})</span>
        </h2>

        {filteredAlerts.length === 0 ? (
          <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-8 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-medium text-slate-200">
              No Active Weather Hazards Detected
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              All monitored atmospheric indicators for {cityName} remain within nominal operational boundaries.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onAcknowledge={handleAcknowledge}
                acknowledged={acknowledgedIds.includes(alert.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Threshold Rules Configuration */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">
              Automated Operations Alert Thresholds
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Rules trigger Azure DevOps webhooks & incident channels
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={rule.enabled}
                  onChange={() => onToggleRule(rule.id)}
                  className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500 w-4 h-4 cursor-pointer"
                />
                <div>
                  <span className={`font-semibold ${rule.enabled ? 'text-white' : 'text-slate-500'}`}>
                    {rule.name}
                  </span>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Trigger Target: <span className="text-cyan-400">{rule.notifyTarget}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 pl-7 sm:pl-0">
                <span className="font-mono text-slate-400">Trigger when value {rule.condition === 'gt' ? '>' : '<'}</span>
                <input
                  type="number"
                  value={rule.value}
                  onChange={(e) => onUpdateRuleValue(rule.id, Number(e.target.value))}
                  disabled={!rule.enabled}
                  className="w-16 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-center font-mono text-white disabled:opacity-40"
                />
                <span className="font-mono text-slate-400">{rule.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
