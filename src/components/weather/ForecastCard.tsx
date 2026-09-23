import React from 'react';
import { CloudRain, Sun, Cloud, CloudSun, CloudSnow, CloudLightning, Wind } from 'lucide-react';
import { DailyForecastItem } from '../../types/forecast';

interface ForecastCardProps {
  item: DailyForecastItem;
  tempUnit: 'celsius' | 'fahrenheit';
  isFirst?: boolean;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ item, tempUnit, isFirst }) => {
  const displayTemp = (tempC: number) => {
    if (tempUnit === 'fahrenheit') {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return tempC;
  };

  const getConditionIcon = (code: number) => {
    if (code >= 95) return <CloudLightning className="w-5 h-5 text-amber-400" />;
    if (code >= 71) return <CloudSnow className="w-5 h-5 text-sky-200" />;
    if (code >= 51) return <CloudRain className="w-5 h-5 text-cyan-400" />;
    if (code >= 3) return <Cloud className="w-5 h-5 text-slate-300" />;
    if (code >= 1) return <CloudSun className="w-5 h-5 text-amber-300" />;
    return <Sun className="w-5 h-5 text-amber-400" />;
  };

  const unitLabel = tempUnit === 'celsius' ? '°C' : '°F';

  return (
    <div
      className={`border rounded-xl p-4 transition-all ${
        isFirst
          ? 'border-cyan-500/40 bg-cyan-950/20'
          : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-semibold text-white block">
            {item.dayOfWeek}
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {item.date.split('-').slice(1).join('/')}
          </span>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-800/80">
          {getConditionIcon(item.weatherCode)}
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between font-mono">
        <span className="text-lg font-bold text-white tabular-nums">
          {displayTemp(item.maxTemp)}{unitLabel}
        </span>
        <span className="text-xs text-slate-400 tabular-nums">
          {displayTemp(item.minTemp)}{unitLabel}
        </span>
      </div>

      <p className="text-xs text-slate-300 truncate mt-1">
        {item.weatherDescription}
      </p>

      {/* Metrics Row */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
        <span className="flex items-center gap-1">
          <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
          <span className="tabular-nums">{item.precipitationProbability}%</span>
        </span>
        <span className="flex items-center gap-1">
          <Wind className="w-3.5 h-3.5 text-slate-500" />
          <span className="tabular-nums">{item.maxWindSpeed} km/h</span>
        </span>
      </div>
    </div>
  );
};
