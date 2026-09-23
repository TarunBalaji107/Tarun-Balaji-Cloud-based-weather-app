import React from 'react';
import { CurrentWeatherData, FavoriteCityItem, WeatherIntelligenceInsight } from '../types/weather';
import { ForecastResponseData } from '../types/forecast';
import { SearchBar } from '../components/weather/SearchBar';
import { CurrentWeather } from '../components/weather/CurrentWeather';
import { AIInsightCard } from '../components/weather/AIInsightCard';
import { WeatherMetrics } from '../components/weather/WeatherMetrics';
import { ForecastList } from '../components/weather/ForecastList';
import { TemperatureChart } from '../components/analytics/TemperatureChart';
import { Loading } from '../components/common/Loading';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { MapPin, RefreshCw } from 'lucide-react';

interface DashboardProps {
  weather: CurrentWeatherData | null;
  forecast: ForecastResponseData | null;
  insight: WeatherIntelligenceInsight | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onSelectCity: (name: string, country: string, countryCode: string, lat: number, lon: number) => void;
  tempUnit: 'celsius' | 'fahrenheit';
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  weather,
  forecast,
  insight,
  loading,
  error,
  onRefresh,
  onSelectCity,
  tempUnit,
  isFavorite,
  onToggleFavorite,
}) => {
  const quickNodes = [
    { name: 'New York', country: 'United States', countryCode: 'US', lat: 40.7128, lon: -74.006 },
    { name: 'London', country: 'United Kingdom', countryCode: 'GB', lat: 51.5074, lon: -0.1278 },
    { name: 'Tokyo', country: 'Japan', countryCode: 'JP', lat: 35.6762, lon: 139.6503 },
    { name: 'Frankfurt', country: 'Germany', countryCode: 'DE', lat: 50.1109, lon: 8.6821 },
    { name: 'Singapore', country: 'Singapore', countryCode: 'SG', lat: 1.3521, lon: 103.8198 },
    { name: 'Sydney', country: 'Australia', countryCode: 'AU', lat: -33.8688, lon: 151.2093 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Search & Quick Node Selector */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-2 border-b border-slate-900">
        <SearchBar
          onSelectCity={onSelectCity}
          currentCity={weather?.city}
        />

        {/* Quick Selection Buttons */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 lg:pb-0">
          <span className="text-xs text-slate-500 font-mono shrink-0 mr-1">
            Global Hubs:
          </span>
          {quickNodes.map((n) => {
            const isCurrent = weather?.city.toLowerCase() === n.name.toLowerCase();
            return (
              <button
                key={n.name}
                onClick={() => onSelectCity(n.name, n.country, n.countryCode, n.lat, n.lon)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors border ${
                  isCurrent
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {n.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading state */}
      {loading && !weather && (
        <Loading message="Ingesting multi-source satellite and radar telemetry..." />
      )}

      {/* Error state */}
      {error && (
        <ErrorMessage
          title="Telemetry Fetch Issue"
          message={error}
          onRetry={onRefresh}
        />
      )}

      {/* Weather Content */}
      {weather && (
        <div className="space-y-6">
          {/* Main Weather Card */}
          <CurrentWeather
            weather={weather}
            tempUnit={tempUnit}
            isFavorite={isFavorite}
            onToggleFavorite={onToggleFavorite}
          />

          {/* AI Weather Intelligence Risk Synthesis */}
          {insight && (
            <AIInsightCard insight={insight} />
          )}

          {/* Detailed Synoptic Metrics Grid */}
          <WeatherMetrics weather={weather} />

          {/* Forecast Section (7-Day + 24-Hour) */}
          {forecast && (
            <ForecastList
              forecast={forecast}
              tempUnit={tempUnit}
            />
          )}

          {/* Thermal Trajectory Chart */}
          {forecast && (
            <TemperatureChart
              daily={forecast.daily}
              hourly={forecast.hourly}
              tempUnit={tempUnit}
            />
          )}
        </div>
      )}
    </div>
  );
};
