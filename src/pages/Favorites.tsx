import React, { useState } from 'react';
import { FavoriteCityItem } from '../types/weather';
import { Bookmark, MapPin, Trash2, ExternalLink, Plus, Thermometer, Wind } from 'lucide-react';
import { SearchBar } from '../components/weather/SearchBar';

interface FavoritesProps {
  favorites: FavoriteCityItem[];
  onRemoveFavorite: (id: string) => void;
  onAddFavorite: (name: string, country: string, lat: number, lon: number) => void;
  onSelectCity: (name: string, country: string, countryCode: string, lat: number, lon: number) => void;
  tempUnit: 'celsius' | 'fahrenheit';
}

export const Favorites: React.FC<FavoritesProps> = ({
  favorites,
  onRemoveFavorite,
  onAddFavorite,
  onSelectCity,
  tempUnit,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);

  const displayTemp = (tempC?: number) => {
    if (tempC === undefined) return '--';
    if (tempUnit === 'fahrenheit') {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return tempC;
  };

  const unitLabel = tempUnit === 'celsius' ? '°C' : '°F';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-900">
        <div>
          <div className="flex items-center space-x-2">
            <Bookmark className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">
              Monitored Meteorological Nodes
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            {favorites.length} Node{favorites.length === 1 ? '' : 's'} registered in Cosmos DB persistence tier
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-2 px-3.5 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-lg text-xs font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Station</span>
        </button>
      </div>

      {/* Modal / Search Bar Drawer */}
      {showAddModal && (
        <div className="p-4 bg-slate-900/90 border border-slate-700 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">
              Search and Pin Location to Monitored Registry
            </span>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
          <SearchBar
            onSelectCity={(name, country, countryCode, lat, lon) => {
              onAddFavorite(name, country, lat, lon);
              setShowAddModal(false);
            }}
          />
        </div>
      )}

      {/* Grid of Favorites */}
      {favorites.length === 0 ? (
        <div className="border border-dashed border-slate-800 rounded-xl p-12 text-center space-y-3">
          <Bookmark className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">
            No Monitored Stations Registered
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Use the search bar or the button above to pin atmospheric observation stations to your live dashboard.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-lg text-xs font-medium"
          >
            Pin First Station
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((city) => (
            <div
              key={city.id}
              className="border border-slate-800 bg-slate-900/60 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2.5">
                    <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-base font-bold text-white leading-tight">
                        {city.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-sans mt-0.5">
                        {city.country}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveFavorite(city.id)}
                    title="Remove station from monitored nodes"
                    className="p-1.5 rounded-md text-slate-500 hover:text-rose-400 hover:bg-slate-800/80 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-5 flex items-baseline justify-between font-mono">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-extrabold text-white tabular-nums">
                      {displayTemp(city.temp)}
                    </span>
                    <span className="text-sm text-slate-400 font-mono">
                      {unitLabel}
                    </span>
                  </div>
                  <span className="text-xs text-slate-300 capitalize font-sans">
                    {city.condition || 'Clear sky'}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Lat: {city.latitude.toFixed(2)}°</span>
                  <span aria-hidden="true">·</span>
                  <span>Lon: {city.longitude.toFixed(2)}°</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-cyan-400 capitalize">{city.tempTrend || 'stable'}</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => onSelectCity(city.name, city.country, 'US', city.latitude, city.longitude)}
                  className="w-full flex items-center justify-center space-x-1.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-xs font-medium text-slate-200 hover:text-white transition-colors border border-slate-700/60"
                >
                  <span>Open Full Synoptic Dashboard</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
