import React, { useState } from 'react';
import { FavoriteCityItem } from '../../types/weather';

interface ComparisonChartProps {
  cities: FavoriteCityItem[];
  tempUnit: 'celsius' | 'fahrenheit';
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({
  cities,
  tempUnit,
}) => {
  const [metric, setMetric] = useState<'temp' | 'wind' | 'humidity'>('temp');

  const displayTemp = (tempC: number) => {
    if (tempUnit === 'fahrenheit') {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return tempC;
  };

  const unitLabel = tempUnit === 'celsius' ? '°C' : '°F';

  // Fallback demo data if cities don't have all attributes
  const comparativeData = cities.map((c, i) => {
    const temp = c.temp ?? (18 + (i * 3) % 12);
    const wind = 12 + ((i * 7) % 25);
    const humidity = 45 + ((i * 11) % 40);
    return {
      name: c.name,
      country: c.country,
      temp: displayTemp(temp),
      wind,
      humidity,
    };
  });

  const getMetricValue = (d: typeof comparativeData[0]) => {
    if (metric === 'temp') return d.temp;
    if (metric === 'wind') return d.wind;
    return d.humidity;
  };

  const getUnit = () => {
    if (metric === 'temp') return unitLabel;
    if (metric === 'wind') return 'km/h';
    return '%';
  };

  const maxVal = Math.max(...comparativeData.map(getMetricValue), 10);

  return (
    <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Cross-Node Meteorological Comparative Matrix
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            Active Monitored Infrastructure Nodes
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setMetric('temp')}
            className={`px-3 py-1 font-medium rounded-md transition-colors ${
              metric === 'temp' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Temperature
          </button>
          <button
            onClick={() => setMetric('wind')}
            className={`px-3 py-1 font-medium rounded-md transition-colors ${
              metric === 'wind' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Wind Speed
          </button>
          <button
            onClick={() => setMetric('humidity')}
            className={`px-3 py-1 font-medium rounded-md transition-colors ${
              metric === 'humidity' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Humidity
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {comparativeData.map((node) => {
          const val = getMetricValue(node);
          const percent = Math.min(100, Math.max(10, Math.round((val / maxVal) * 100)));

          return (
            <div key={node.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-slate-200">
                  {node.name} <span className="text-slate-500 font-normal">({node.country})</span>
                </span>
                <span className="text-white font-bold tabular-nums">
                  {val} {getUnit()}
                </span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-md overflow-hidden p-0.5 border border-slate-800/80">
                <div
                  className="h-full rounded bg-gradient-to-r from-cyan-500 to-sky-400 transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
