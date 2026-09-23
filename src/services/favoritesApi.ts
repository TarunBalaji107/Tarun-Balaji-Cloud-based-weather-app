import { FavoriteCityItem } from '../types/weather';

const STORAGE_KEY = 'weather_platform_favorite_cities';

const INITIAL_FAVORITES: FavoriteCityItem[] = [
  {
    id: 'fav-nyc',
    name: 'New York',
    country: 'United States',
    latitude: 40.7128,
    longitude: -74.006,
    addedAt: '2026-09-20T10:00:00Z',
    temp: 21,
    condition: 'Partly cloudy',
    weatherCode: 2,
    tempTrend: 'stable',
  },
  {
    id: 'fav-lon',
    name: 'London',
    country: 'United Kingdom',
    latitude: 51.5074,
    longitude: -0.1278,
    addedAt: '2026-09-21T14:30:00Z',
    temp: 16,
    condition: 'Light drizzle',
    weatherCode: 51,
    tempTrend: 'falling',
  },
  {
    id: 'fav-tok',
    name: 'Tokyo',
    country: 'Japan',
    latitude: 35.6762,
    longitude: 139.6503,
    addedAt: '2026-09-22T08:15:00Z',
    temp: 26,
    condition: 'Mainly clear',
    weatherCode: 1,
    tempTrend: 'rising',
  },
  {
    id: 'fav-par',
    name: 'Paris',
    country: 'France',
    latitude: 48.8566,
    longitude: 2.3522,
    addedAt: '2026-09-22T19:00:00Z',
    temp: 19,
    condition: 'Clear sky',
    weatherCode: 0,
    tempTrend: 'stable',
  },
];

export function getStoredFavorites(): FavoriteCityItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FAVORITES));
      return INITIAL_FAVORITES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_FAVORITES;
  }
}

export function saveFavorites(items: FavoriteCityItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to write favorites to localStorage:', e);
  }
}

export async function addFavoriteCity(
  name: string,
  country: string,
  latitude: number,
  longitude: number
): Promise<FavoriteCityItem[]> {
  const current = getStoredFavorites();
  const exists = current.some(
    (item) => item.name.toLowerCase() === name.toLowerCase() && item.country.toLowerCase() === country.toLowerCase()
  );
  if (exists) return current;

  const newItem: FavoriteCityItem = {
    id: `fav-${Date.now()}`,
    name,
    country,
    latitude,
    longitude,
    addedAt: new Date().toISOString(),
    temp: 20,
    condition: 'Clear sky',
    weatherCode: 0,
    tempTrend: 'stable',
  };

  const updated = [newItem, ...current];
  saveFavorites(updated);
  return updated;
}

export async function removeFavoriteCity(id: string): Promise<FavoriteCityItem[]> {
  const current = getStoredFavorites();
  const updated = current.filter((item) => item.id !== id);
  saveFavorites(updated);
  return updated;
}
