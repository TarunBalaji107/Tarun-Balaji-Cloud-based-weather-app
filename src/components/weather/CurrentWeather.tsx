import React from 'react';
import {
  Bookmark,
  BookmarkCheck,
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Wind,
  Compass,
  Clock,
  MapPin,
} from 'lucide-react';
import { CurrentWeatherData } from '../../types/weather';

interface CurrentWeatherProps {
  weather: CurrentWeatherData;
  tempUnit: 'celsius' | 'fahrenheit';
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  weather,
  tempUnit,
  isFavorite,
  onToggleFavorite,
}) => {
  const displayTemp = (tempC: number) => {
    if (tempUnit === 'fahrenheit') {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return tempC;
  };

  const getWeatherIcon = (iconName: string) => {
    switch (iconName) {
      case 'cloud-sun':
        return <CloudSun className="w-12 h-12 text-amber-300" />;
      case 'cloud':
        return <Cloud className="w-12 h-12 text-slate-300" />;
      case 'cloud-rain':
      case 'cloud-drizzle':
        return <CloudRain className="w-12 h-12 text-cyan-400" />;
      case 'snowflake':
      case 'cloud-snow':
        return <CloudSnow className="w-12 h-12 text-sky-200" />;
      case 'cloud-lightning':
        return <CloudLightning className="w-12 h-12 text-amber-400" />;
      case 'cloud-fog':
        return <CloudFog className="w-12 h-12 text-slate-400" />;
      default:
        return <Sun className="w-12 h-12 text-amber-400" />;
    }
  };

  const unitLabel = tempUnit === 'celsius' ? '°C' : '°F';

  return (
    <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-6 sm:p-8 backdrop-blur relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Location & Actions */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {weather.city}
            </h1>
            <span className="text-lg text-slate-400 font-normal">
              {weather.country}
            </span>
          </div>

          {/* Zero-Pill Metadata Line */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-2 font-mono">
            <span>{weather.coordinates.lat.toFixed(3)}°N</span>
            <span aria-hidden="true">·</span>
            <span>{weather.coordinates.lon.toFixed(3)}°E</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              Telemetry: {weather.lastUpdated}
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-400">{weather.isDay ? 'Daytime Cycle' : 'Nighttime Cycle'}</span>
          </div>
        </div>

        {/* Favorite Bookmark Button */}
        <button
          onClick={onToggleFavorite}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            isFavorite
              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          {isFavorite ? (
            <>
              <BookmarkCheck className="w-4 h-4 text-cyan-400" />
              <span>Monitored</span>
            </>
          ) : (
            <>
              <Bookmark className="w-4 h-4" />
              <span>Pin Station</span>
            </>
          )}
        </button>
      </div>

      {/* Hero Temperature & Condition */}
      <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-6">
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 shrink-0">
            {getWeatherIcon(weather.weatherIcon)}
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-5xl sm:text-6xl font-extrabold text-white font-mono tabular-nums tracking-tighter">
                {displayTemp(weather.temperature)}
              </span>
              <span className="text-2xl sm:text-3xl text-slate-400 font-mono">
                {unitLabel}
              </span>
            </div>
            <p className="text-base sm:text-lg font-medium text-slate-200 mt-1 capitalize">
              {weather.weatherDescription}
            </p>
          </div>
        </div>

        {/* Secondary Snapshot Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t sm:border-t-0 sm:border-l border-slate-800 pt-4 sm:pt-0 sm:pl-8">
          <div>
            <span className="text-xs text-slate-400 block">Feels Like</span>
            <span className="text-base font-semibold font-mono tabular-nums text-slate-200">
              {displayTemp(weather.apparentTemperature)}{unitLabel}
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400 block">Wind Velocity</span>
            <div className="flex items-center space-x-1">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-base font-semibold font-mono tabular-nums text-slate-200">
                {weather.windSpeed} km/h
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-400 block">Air Quality</span>
            {weather.airQuality ? (
              <span className="text-base font-semibold font-mono tabular-nums text-emerald-400">
                AQI {weather.airQuality.aqi} · {weather.airQuality.status}
              </span>
            ) : (
              <span className="text-sm font-mono text-slate-400">Nominal</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
