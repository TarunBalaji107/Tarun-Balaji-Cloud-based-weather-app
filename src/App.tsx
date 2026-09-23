/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Favorites } from './pages/Favorites';
import { Analytics } from './pages/Analytics';
import { Alerts } from './pages/Alerts';
import { Operations } from './pages/Operations';
import { ReleaseCenter } from './pages/ReleaseCenter';
import { Settings } from './pages/Settings';
import { useWeather } from './hooks/useWeather';
import { useForecast } from './hooks/useForecast';
import { useFavorites } from './hooks/useFavorites';
import { useAlerts } from './hooks/useAlerts';
import { fetchSystemHealth, fetchEnvironmentReleases } from './services/healthApi';
import { SystemHealthSummary, EnvironmentReleaseInfo } from './types/health';
import { AppRoute } from './router/routes';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppRoute>('dashboard');
  const [tempUnit, setTempUnit] = useState<'celsius' | 'fahrenheit'>('celsius');
  const [systemHealth, setSystemHealth] = useState<SystemHealthSummary | null>(null);
  const [releases, setReleases] = useState<EnvironmentReleaseInfo[]>([]);

  // Weather Hook
  const {
    weather,
    insight,
    loading: weatherLoading,
    error: weatherError,
    activeLocation,
    loadWeather,
    refresh: refreshWeather,
  } = useWeather('New York', 'United States', 'US', 40.7128, -74.0060);

  // Forecast Hook
  const {
    forecast,
    loading: forecastLoading,
    error: forecastError,
    reload: reloadForecast,
  } = useForecast(
    activeLocation.city,
    activeLocation.country,
    activeLocation.lat,
    activeLocation.lon
  );

  // Favorites Hook
  const {
    favorites,
    addCity,
    removeCity,
    isFavorite,
  } = useFavorites();

  // Alerts Hook
  const {
    alerts,
    rules,
    toggleRule,
    updateRuleValue,
    refreshAlerts,
  } = useAlerts(activeLocation.city);

  // Health and Releases
  useEffect(() => {
    fetchSystemHealth().then(setSystemHealth).catch(console.error);
    fetchEnvironmentReleases().then(setReleases).catch(console.error);
  }, []);

  const handleSelectCity = (
    name: string,
    country: string,
    countryCode: string,
    lat: number,
    lon: number
  ) => {
    loadWeather(name, country, countryCode, lat, lon);
  };

  const handleToggleFavorite = () => {
    if (!weather) return;
    if (isFavorite(weather.city, weather.country)) {
      const match = favorites.find(
        (f) => f.name.toLowerCase() === weather.city.toLowerCase()
      );
      if (match) removeCity(match.id);
    } else {
      addCity(weather.city, weather.country, weather.coordinates.lat, weather.coordinates.lon);
    }
  };

  const handleToggleUnit = () => {
    setTempUnit((prev) => (prev === 'celsius' ? 'fahrenheit' : 'celsius'));
  };

  const handleGlobalRefresh = () => {
    refreshWeather();
    reloadForecast();
    refreshAlerts();
    fetchSystemHealth().then(setSystemHealth).catch(console.error);
  };

  return (
    <AppLayout
      activeTab={activeTab}
      onSelectTab={(tabId) => setActiveTab(tabId as AppRoute)}
      favorites={favorites}
      onSelectCity={(name, country, lat, lon) => {
        handleSelectCity(name, country, 'US', lat, lon);
        setActiveTab('dashboard');
      }}
      currentCityName={weather?.city}
      tempUnit={tempUnit}
      onToggleUnit={handleToggleUnit}
      onRefresh={handleGlobalRefresh}
      isRefreshing={weatherLoading || forecastLoading}
    >
      {activeTab === 'dashboard' && (
        <Dashboard
          weather={weather}
          forecast={forecast}
          insight={insight}
          loading={weatherLoading}
          error={weatherError || forecastError}
          onRefresh={handleGlobalRefresh}
          onSelectCity={handleSelectCity}
          tempUnit={tempUnit}
          isFavorite={weather ? isFavorite(weather.city, weather.country) : false}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {activeTab === 'favorites' && (
        <Favorites
          favorites={favorites}
          onRemoveFavorite={removeCity}
          onAddFavorite={(name, country, lat, lon) => addCity(name, country, lat, lon)}
          onSelectCity={(name, country, code, lat, lon) => {
            handleSelectCity(name, country, code, lat, lon);
            setActiveTab('dashboard');
          }}
          tempUnit={tempUnit}
        />
      )}

      {activeTab === 'analytics' && (
        <Analytics
          forecast={forecast}
          favorites={favorites}
          tempUnit={tempUnit}
          activeCityName={weather?.city || 'Selected Station'}
        />
      )}

      {activeTab === 'alerts' && (
        <Alerts
          alerts={alerts}
          rules={rules}
          onToggleRule={toggleRule}
          onUpdateRuleValue={updateRuleValue}
          cityName={weather?.city || 'All Monitored Regions'}
        />
      )}

      {activeTab === 'operations' && (
        <Operations
          systemHealth={systemHealth}
          onRefreshHealth={() => fetchSystemHealth().then(setSystemHealth)}
        />
      )}

      {activeTab === 'release' && (
        <ReleaseCenter releases={releases} />
      )}

      {activeTab === 'settings' && (
        <Settings
          tempUnit={tempUnit}
          onToggleUnit={handleToggleUnit}
        />
      )}
    </AppLayout>
  );
}
