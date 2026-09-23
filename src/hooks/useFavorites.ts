import { useCallback, useEffect, useState } from 'react';
import { addFavoriteCity, getStoredFavorites, removeFavoriteCity } from '../services/favoritesApi';
import { FavoriteCityItem } from '../types/weather';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteCityItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setFavorites(getStoredFavorites());
    setLoading(false);
  }, []);

  const addCity = useCallback(async (
    name: string,
    country: string,
    latitude: number,
    longitude: number
  ) => {
    const updated = await addFavoriteCity(name, country, latitude, longitude);
    setFavorites(updated);
  }, []);

  const removeCity = useCallback(async (id: string) => {
    const updated = await removeFavoriteCity(id);
    setFavorites(updated);
  }, []);

  const isFavorite = useCallback(
    (name: string, country?: string) => {
      return favorites.some(
        (f) =>
          f.name.toLowerCase() === name.toLowerCase() &&
          (!country || f.country.toLowerCase() === country.toLowerCase())
      );
    },
    [favorites]
  );

  return {
    favorites,
    loading,
    addCity,
    removeCity,
    isFavorite,
  };
}
