import React, { useState } from 'react';
import { ForecastResponseData } from '../../types/forecast';
import { ForecastCard } from './ForecastCard';
import { Calendar, Clock, Sun, CloudRain } from 'lucide-react';

interface ForecastListProps {
  forecast: ForecastResponseData;
  tempUnit: 'celsius' | 'fahrenheit';
}

export const ForecastList: React.FC<ForecastListProps> = ({ forecast, tempUnit }) => {
  const [viewMode, setViewMode] = useState<'daily' | 'hourly'>('daily');

  const displayTemp = (tempC: number) => {
    if (tempUnit === 'fahrenheit') {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return tempC;
  };

  const unitLabel = tempUnit === 'celsius' ? '°C' : '°F';

  return (
    <div className="space-y-4">
      {/* Header and Toggle Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {viewMode === 'daily' ? (
            <Calendar className="w-4 h-4 text-cyan-400" />
          ) : (
            <Clock className="w-4 h-4 text-cyan-400" />
          )}
          <h2 className="text-base font-semibold text-white">
            {viewMode === 'daily' ? '7-Day Global Numerical Forecast' : '24-Hour Synoptic Hourly Projection'}
          </h2>
        </div>

        {/* Segmented Control */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setViewMode('daily')}
            className={`px-3 py-1 font-medium rounded-md transition-colors ${
              viewMode === 'daily'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            7-Day
          </button>
          <button
            onClick={() => setViewMode('hourly')}
            className={`px-3 py-1 font-medium rounded-md transition-colors ${
              viewMode === 'hourly'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            24-Hour
          </button>
        </div>
      </div>

      {/* Daily View Grid */}
      {viewMode === 'daily' ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {forecast.daily.map((item, index) => (
            <ForecastCard
              key={item.date}
              item={item}
              tempUnit={tempUnit}
              isFirst={index === 0}
            />
          ))}
        </div>
      ) : (
        /* Hourly Horizontal Scroll */
        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex space-x-3 min-w-max">
            {forecast.hourly.map((h, i) => (
              <div
                key={`${h.time}-${i}`}
                className="w-24 border border-slate-800 bg-slate-900/60 rounded-xl p-3 flex flex-col items-center justify-between text-center shrink-0 hover:border-slate-700 transition-colors"
              >
                <span className="text-xs font-mono text-slate-400">{h.time}</span>
                <div className="my-2 p-1.5 rounded-lg bg-slate-800/80">
                  {h.precipitation > 0 || h.weatherCode >= 51 ? (
                    <CloudRain className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-400" />
                  )}
                </div>
                <span className="text-sm font-bold font-mono text-white tabular-nums">
                  {displayTemp(h.temperature)}{unitLabel}
                </span>
                <span className="text-[11px] font-mono text-cyan-400 mt-1">
                  {h.precipitationProbability}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
