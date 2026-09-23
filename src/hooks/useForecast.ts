import { useCallback, useEffect, useState } from 'react';
import { fetchForecastData } from '../services/forecastApi';
import { ForecastResponseData } from '../types/forecast';

export function useForecast(city: string, country: string, lat: number, lon: number) {
  const [forecast, setForecast] = useState<ForecastResponseData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadForecast = useCallback(async (
    c: string,
    cntry: string,
    latitude: number,
    longitude: number
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchForecastData(c, cntry, latitude, longitude);
      setForecast(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to retrieve forecast data';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (lat && lon) {
      loadForecast(city, country, lat, lon);
    }
  }, [city, country, lat, lon, loadForecast]);

  return {
    forecast,
    loading,
    error,
    reload: () => loadForecast(city, country, lat, lon),
  };
}
