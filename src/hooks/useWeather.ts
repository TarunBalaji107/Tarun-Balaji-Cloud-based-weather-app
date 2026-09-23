import { useCallback, useEffect, useState } from 'react';
import { generateWeatherInsight } from '../services/aiApi';
import { fetchCurrentWeather } from '../services/weatherApi';
import { CurrentWeatherData, WeatherIntelligenceInsight } from '../types/weather';

export function useWeather(
  initialCity = 'New York',
  initialCountry = 'United States',
  initialCountryCode = 'US',
  initialLat = 40.7128,
  initialLon = -74.0060
) {
  const [weather, setWeather] = useState<CurrentWeatherData | null>(null);
  const [insight, setInsight] = useState<WeatherIntelligenceInsight | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeLocation, setActiveLocation] = useState({
    city: initialCity,
    country: initialCountry,
    countryCode: initialCountryCode,
    lat: initialLat,
    lon: initialLon,
  });

  const loadWeather = useCallback(async (
    city: string,
    country: string,
    countryCode: string,
    lat: number,
    lon: number
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCurrentWeather(city, country, countryCode, lat, lon);
      setWeather(data);
      const aiInsight = await generateWeatherInsight(data, data.temperature + 4, data.temperature - 5);
      setInsight(aiInsight);
      setActiveLocation({ city, country, countryCode, lat, lon });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to retrieve atmospheric intelligence';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeather(
      initialCity,
      initialCountry,
      initialCountryCode,
      initialLat,
      initialLon
    );
  }, [loadWeather, initialCity, initialCountry, initialCountryCode, initialLat, initialLon]);

  const refresh = useCallback(() => {
    return loadWeather(
      activeLocation.city,
      activeLocation.country,
      activeLocation.countryCode,
      activeLocation.lat,
      activeLocation.lon
    );
  }, [loadWeather, activeLocation]);

  return {
    weather,
    insight,
    loading,
    error,
    activeLocation,
    loadWeather,
    refresh,
  };
}
