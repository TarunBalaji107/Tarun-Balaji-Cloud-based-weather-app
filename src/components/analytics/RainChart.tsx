import React, { useState } from 'react';
import { DailyForecastItem } from '../../types/forecast';
import { CloudRain } from 'lucide-react';

interface RainChartProps {
  daily: DailyForecastItem[];
}

export const RainChart: React.FC<RainChartProps> = ({ daily }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxProb = 100;
  const maxRain = Math.max(...daily.map((d) => d.precipitationSum), 5);

  return (
    <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <CloudRain className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">
              Precipitation Probability & Accumulation
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            7-Day Hydrological Dispersion Profile
          </p>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        {daily.map((item, idx) => {
          const prob = item.precipitationProbability;
          const sumMm = item.precipitationSum;
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={item.date}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isHovered ? 'bg-slate-800/80' : 'hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1 font-mono">
                <span className="font-semibold text-slate-200 w-16">
                  {item.dayOfWeek}
                </span>
                <span className="text-slate-400 truncate flex-1 mx-2">
                  {item.weatherDescription}
                </span>
                <div className="flex items-center space-x-3 shrink-0">
                  <span className="text-cyan-400 font-semibold tabular-nums">
                    {prob}% prob
                  </span>
                  <span className="text-slate-400 tabular-nums w-14 text-right">
                    {sumMm} mm
                  </span>
                </div>
              </div>

              {/* Stacked Visual Bar */}
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden flex">
                <div
                  className="bg-cyan-500 rounded-full transition-all duration-300"
                  style={{ width: `${prob}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
