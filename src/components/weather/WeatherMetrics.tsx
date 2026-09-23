import React from 'react';
import {
  Droplets,
  Gauge,
  Sun,
  Wind,
  Eye,
  Thermometer,
  Cloud,
  CloudRain,
  Compass,
} from 'lucide-react';
import { CurrentWeatherData } from '../../types/weather';

interface WeatherMetricsProps {
  weather: CurrentWeatherData;
}

export const WeatherMetrics: React.FC<WeatherMetricsProps> = ({ weather }) => {
  const getWindDirectionLabel = (deg: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(deg / 22.5) % 16;
    return directions[index];
  };

  const getUvLevel = (uv: number) => {
    if (uv >= 11) return { label: 'Extreme', color: 'text-purple-400' };
    if (uv >= 8) return { label: 'Very High', color: 'text-rose-400' };
    if (uv >= 6) return { label: 'High', color: 'text-amber-400' };
    if (uv >= 3) return { label: 'Moderate', color: 'text-amber-300' };
    return { label: 'Low', color: 'text-emerald-400' };
  };

  const uvInfo = getUvLevel(weather.uvIndex);

  const metrics = [
    {
      title: 'Barometric Pressure',
      value: `${weather.pressure}`,
      unit: 'hPa',
      subtext: weather.pressure > 1013 ? 'High pressure ridge' : 'Low pressure depression',
      icon: Gauge,
      iconColor: 'text-cyan-400',
    },
    {
      title: 'Relative Humidity',
      value: `${weather.humidity}`,
      unit: '%',
      subtext: `Dew point: ${weather.dewPoint}°C`,
      icon: Droplets,
      iconColor: 'text-sky-400',
    },
    {
      title: 'Solar UV Index',
      value: `${weather.uvIndex}`,
      unit: 'Index',
      subtext: `${uvInfo.label} exposure risk`,
      icon: Sun,
      iconColor: 'text-amber-400',
    },
    {
      title: 'Wind & Gusts',
      value: `${weather.windSpeed}`,
      unit: 'km/h',
      subtext: `${getWindDirectionLabel(weather.windDirection)} (${weather.windDirection}°) · Gusts ${weather.windGusts || weather.windSpeed + 8} km/h`,
      icon: Wind,
      iconColor: 'text-teal-400',
    },
    {
      title: 'Optical Visibility',
      value: `${weather.visibility}`,
      unit: 'km',
      subtext: weather.visibility >= 10 ? 'Optimal horizon clarity' : 'Atmospheric haze present',
      icon: Eye,
      iconColor: 'text-blue-400',
    },
    {
      title: 'Cloud Cover',
      value: `${weather.cloudCover}`,
      unit: '%',
      subtext: weather.cloudCover < 30 ? 'Scattered/Clear' : weather.cloudCover < 70 ? 'Broken overcast' : 'Complete overcast',
      icon: Cloud,
      iconColor: 'text-slate-400',
    },
    {
      title: 'Precipitation Accumulation',
      value: `${weather.precipitation}`,
      unit: 'mm',
      subtext: weather.rain > 0 ? `${weather.rain} mm liquid rain` : 'No current precipitation',
      icon: CloudRain,
      iconColor: 'text-cyan-300',
    },
    {
      title: 'Dew Point Equilibrium',
      value: `${weather.dewPoint}`,
      unit: '°C',
      subtext: weather.dewPoint > 18 ? 'Tropical humidity' : 'Comfortable condensation',
      icon: Thermometer,
      iconColor: 'text-indigo-400',
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-300">
        Synoptic Atmospheric Metrics
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.title}
              className="border border-slate-800 bg-slate-900/60 rounded-xl p-4 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{m.title}</span>
                <Icon className={`w-4 h-4 ${m.iconColor}`} />
              </div>

              <div className="mt-3 flex items-baseline space-x-1.5 font-mono">
                <span className="text-2xl font-bold text-white tabular-nums">
                  {m.value}
                </span>
                <span className="text-xs text-slate-400 font-sans">
                  {m.unit}
                </span>
              </div>

              <span className="text-[11px] text-slate-400 mt-2 truncate font-mono">
                {m.subtext}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
