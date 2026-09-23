import React from 'react';
import { Sparkles, ShieldAlert, Cpu, Plane, Truck, Wheat, Zap } from 'lucide-react';
import { WeatherIntelligenceInsight } from '../../types/weather';

interface AIInsightCardProps {
  insight: WeatherIntelligenceInsight;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({ insight }) => {
  const getSectorIcon = (sector: string) => {
    switch (sector) {
      case 'Aviation':
        return <Plane className="w-3.5 h-3.5" />;
      case 'Logistics':
        return <Truck className="w-3.5 h-3.5" />;
      case 'Cloud Infrastructure':
        return <Cpu className="w-3.5 h-3.5" />;
      case 'Agriculture':
        return <Wheat className="w-3.5 h-3.5" />;
      case 'Energy Grid':
        return <Zap className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  const getSeverityStyle = (sev: WeatherIntelligenceInsight['severity']) => {
    switch (sev) {
      case 'critical':
        return {
          border: 'border-rose-800/80',
          bg: 'bg-rose-950/20',
          badgeText: 'text-rose-400',
          label: 'Critical Hazard Impact',
        };
      case 'high':
        return {
          border: 'border-amber-800/80',
          bg: 'bg-amber-950/20',
          badgeText: 'text-amber-400',
          label: 'Elevated Operational Warning',
        };
      case 'moderate':
        return {
          border: 'border-sky-800/80',
          bg: 'bg-sky-950/20',
          badgeText: 'text-sky-300',
          label: 'Moderate Operational Advisory',
        };
      default:
        return {
          border: 'border-emerald-800/60',
          bg: 'bg-emerald-950/20',
          badgeText: 'text-emerald-400',
          label: 'Nominal Operational State',
        };
    }
  };

  const style = getSeverityStyle(insight.severity);

  return (
    <div className={`border rounded-xl p-5 sm:p-6 ${style.border} ${style.bg} relative`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-700/60 text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              {insight.title}
            </h3>
            {/* Zero-Pill Metadata */}
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mt-0.5">
              <span>{insight.model}</span>
              <span aria-hidden="true">·</span>
              <span>Confidence: {insight.confidenceScore}%</span>
              <span aria-hidden="true">·</span>
              <span className={style.badgeText}>{style.label}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>Synthesized: {insight.generatedAt}</span>
        </div>
      </div>

      {/* Summary Narrative */}
      <div className="mt-4">
        <p className="text-sm text-slate-200 leading-relaxed font-sans">
          {insight.summary}
        </p>
      </div>

      {/* Affected Operational Sectors */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-mono text-[11px] uppercase mr-1">
          Affected Sectors:
        </span>
        {insight.affectedSectors.map((sector) => (
          <span
            key={sector}
            className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-700/60 text-slate-300 font-medium"
          >
            {getSectorIcon(sector)}
            <span>{sector}</span>
          </span>
        ))}
      </div>

      {/* Actionable Recommendations */}
      <div className="mt-5 space-y-2">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block font-mono">
          Operational Directives & Mitigation
        </span>
        <div className="space-y-1.5">
          {insight.recommendations.map((rec, index) => (
            <div
              key={index}
              className="flex items-start space-x-2.5 text-xs text-slate-300 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800"
            >
              <span className="font-mono text-cyan-400 shrink-0 font-semibold">
                0{index + 1}.
              </span>
              <span className="leading-relaxed">{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
