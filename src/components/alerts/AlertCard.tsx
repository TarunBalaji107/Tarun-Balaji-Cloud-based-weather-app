import React from 'react';
import { AlertTriangle, Clock, MapPin, ChevronRight, ShieldCheck } from 'lucide-react';
import { WeatherAlert } from '../../types/alert';

interface AlertCardProps {
  alert: WeatherAlert;
  onAcknowledge?: (id: string) => void;
  acknowledged?: boolean;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  onAcknowledge,
  acknowledged = false,
}) => {
  const getSeverityStyle = (sev: WeatherAlert['severity']) => {
    switch (sev) {
      case 'critical':
        return {
          border: 'border-rose-700/80',
          bg: 'bg-rose-950/30',
          iconColor: 'text-rose-400',
          badgeText: 'text-rose-400',
          tag: 'CRITICAL WARNING',
        };
      case 'severe':
        return {
          border: 'border-rose-800/60',
          bg: 'bg-rose-950/20',
          iconColor: 'text-rose-400',
          badgeText: 'text-rose-400',
          tag: 'SEVERE WARNING',
        };
      case 'moderate':
        return {
          border: 'border-amber-800/60',
          bg: 'bg-amber-950/20',
          iconColor: 'text-amber-400',
          badgeText: 'text-amber-300',
          tag: 'MODERATE WATCH',
        };
      default:
        return {
          border: 'border-sky-800/60',
          bg: 'bg-sky-950/20',
          iconColor: 'text-sky-400',
          badgeText: 'text-sky-300',
          tag: 'ADVISORY NOTICE',
        };
    }
  };

  const style = getSeverityStyle(alert.severity);

  return (
    <div
      className={`border rounded-xl p-5 ${style.border} ${style.bg} transition-all ${
        acknowledged ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
            <AlertTriangle className={`w-5 h-5 ${style.iconColor}`} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className={`font-semibold ${style.badgeText}`}>{style.tag}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">{alert.event}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">Urgency: {alert.urgency}</span>
            </div>

            <h3 className="text-base font-semibold text-white mt-1">
              {alert.headline}
            </h3>

            <div className="flex items-center space-x-1.5 text-xs text-slate-400 mt-1 font-mono">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{alert.areaDesc}</span>
            </div>
          </div>
        </div>

        {onAcknowledge && (
          <button
            onClick={() => onAcknowledge(alert.id)}
            disabled={acknowledged}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border shrink-0 transition-colors ${
              acknowledged
                ? 'bg-slate-900 border-slate-800 text-slate-500 cursor-default'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
            }`}
          >
            {acknowledged ? (
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Acknowledged
              </span>
            ) : (
              'Acknowledge'
            )}
          </button>
        )}
      </div>

      {/* Instruction block */}
      <div className="mt-4 p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs text-slate-300 font-sans leading-relaxed">
        <span className="font-semibold text-slate-200 block mb-1">
          Operational Directives:
        </span>
        {alert.instruction}
      </div>

      {/* Footer metadata */}
      <div className="mt-3 pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 gap-2">
        <div className="flex items-center space-x-2">
          <span>Source: {alert.source}</span>
          <span aria-hidden="true">·</span>
          <span>Expires: {new Date(alert.expires).toLocaleDateString()} {new Date(alert.expires).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        {alert.metrics && (
          <div className="flex items-center space-x-3 text-slate-400 font-semibold">
            {alert.metrics.expectedWindGustsKmh && (
              <span>Gusts: {alert.metrics.expectedWindGustsKmh} km/h</span>
            )}
            {alert.metrics.expectedRainfallMm && (
              <span>Rainfall: {alert.metrics.expectedRainfallMm} mm</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
