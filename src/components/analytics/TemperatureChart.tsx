import React, { useState } from 'react';
import { DailyForecastItem, HourlyForecastItem } from '../../types/forecast';

interface TemperatureChartProps {
  daily: DailyForecastItem[];
  hourly?: HourlyForecastItem[];
  tempUnit: 'celsius' | 'fahrenheit';
}

export const TemperatureChart: React.FC<TemperatureChartProps> = ({
  daily,
  hourly = [],
  tempUnit,
}) => {
  const [mode, setMode] = useState<'daily' | 'hourly'>('daily');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const displayTemp = (tempC: number) => {
    if (tempUnit === 'fahrenheit') {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return tempC;
  };

  const unitLabel = tempUnit === 'celsius' ? '°C' : '°F';

  // Extract data series
  const dataPoints = mode === 'daily'
    ? daily.map((d) => ({
        label: d.dayOfWeek,
        date: d.date,
        high: displayTemp(d.maxTemp),
        low: displayTemp(d.minTemp),
      }))
    : hourly.slice(0, 16).map((h) => ({
        label: h.time,
        date: h.time,
        high: displayTemp(h.temperature),
        low: displayTemp(h.apparentTemperature),
      }));

  if (dataPoints.length === 0) return null;

  const allTemps = dataPoints.flatMap((d) => [d.high, d.low]);
  const minVal = Math.min(...allTemps) - 2;
  const maxVal = Math.max(...allTemps) + 2;
  const range = maxVal - minVal || 1;

  const chartHeight = 180;
  const chartWidth = 560;
  const paddingX = 40;
  const paddingY = 25;

  const getX = (index: number) => {
    return paddingX + (index / (dataPoints.length - 1 || 1)) * (chartWidth - paddingX * 2);
  };

  const getY = (val: number) => {
    return chartHeight - paddingY - ((val - minVal) / range) * (chartHeight - paddingY * 2);
  };

  // Generate SVG path for high temperatures
  const highPoints = dataPoints.map((d, i) => `${getX(i)},${getY(d.high)}`).join(' ');
  const lowPoints = dataPoints.map((d, i) => `${getX(i)},${getY(d.low)}`).join(' ');

  return (
    <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Atmospheric Thermal Trajectory
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            High vs Low Temperature Variance ({unitLabel})
          </p>
        </div>

        <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setMode('daily')}
            className={`px-2.5 py-1 font-medium rounded-md transition-colors ${
              mode === 'daily' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Daily Range
          </button>
          <button
            onClick={() => setMode('hourly')}
            className={`px-2.5 py-1 font-medium rounded-md transition-colors ${
              mode === 'hourly' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hourly Synoptic
          </button>
        </div>
      </div>

      {/* SVG Line Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-48 select-none"
        >
          {/* Subtle horizontal grid lines */}
          {[0, 0.33, 0.66, 1].map((ratio) => {
            const y = chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
            const val = Math.round(minVal + ratio * range);
            return (
              <g key={ratio}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX}
                  y2={y}
                  stroke="#334155"
                  strokeDasharray="3 3"
                  strokeWidth="0.75"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-slate-500 font-mono text-[10px]"
                >
                  {val}°
                </text>
              </g>
            );
          })}

          {/* High temperature line */}
          <polyline
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
            points={highPoints}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Low temperature line */}
          <polyline
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeDasharray={mode === 'daily' ? 'none' : '4 3'}
            points={lowPoints}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points & Interactive Tooltips */}
          {dataPoints.map((d, i) => {
            const x = getX(i);
            const yHigh = getY(d.high);
            const yLow = getY(d.low);
            const isHovered = hoveredIdx === i;

            return (
              <g
                key={i}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                {/* Indicator Line on Hover */}
                {isHovered && (
                  <line
                    x1={x}
                    y1={paddingY}
                    x2={x}
                    y2={chartHeight - paddingY}
                    stroke="#64748b"
                    strokeWidth="1"
                  />
                )}

                {/* High Circle */}
                <circle
                  cx={x}
                  cy={yHigh}
                  r={isHovered ? 5 : 3.5}
                  fill="#f59e0b"
                  stroke="#0f172a"
                  strokeWidth="2"
                />

                {/* Low Circle */}
                <circle
                  cx={x}
                  cy={yLow}
                  r={isHovered ? 4.5 : 3}
                  fill="#38bdf8"
                  stroke="#0f172a"
                  strokeWidth="2"
                />

                {/* Bottom X-axis label */}
                <text
                  x={x}
                  y={chartHeight - 6}
                  textAnchor="middle"
                  className={`text-[10px] font-mono ${
                    isHovered ? 'fill-white font-semibold' : 'fill-slate-400'
                  }`}
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 mt-3 text-xs font-mono text-slate-400">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>{mode === 'daily' ? 'Max Temp' : 'Ambient Temp'}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <span>{mode === 'daily' ? 'Min Temp' : 'Apparent Temp'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
