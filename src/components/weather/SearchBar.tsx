import React, { useEffect, useRef, useState } from 'react';
import { Search, MapPin, X, Loader2 } from 'lucide-react';
import { searchCities, DEFAULT_CITIES } from '../../services/weatherApi';
import { CitySearchResult } from '../../types/weather';

interface SearchBarProps {
  onSelectCity: (name: string, country: string, countryCode: string, lat: number, lon: number) => void;
  currentCity?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSelectCity, currentCity }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CitySearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const hits = await searchCities(query);
        setResults(hits);
      } catch (e) {
        console.error('Search error:', e);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelect = (item: CitySearchResult) => {
    onSelectCity(
      item.name,
      item.country || '',
      item.country_code || 'US',
      item.latitude,
      item.longitude
    );
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search world weather node (e.g. Zurich, Singapore, Seattle)..."
          className="w-full pl-10 pr-9 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-sans"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden divide-y divide-slate-800">
          {results.length > 0 ? (
            <div className="max-h-64 overflow-y-auto">
              <div className="px-3 py-1.5 text-[11px] font-mono text-slate-500 bg-slate-950/60 uppercase">
                Search Results
              </div>
              {results.map((item) => (
                <button
                  key={`${item.id}-${item.latitude}-${item.longitude}`}
                  onClick={() => handleSelect(item)}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-slate-800/80 flex items-center justify-between text-sm transition-colors group"
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <MapPin className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 shrink-0" />
                    <span className="font-medium text-slate-200 group-hover:text-white truncate">
                      {item.name}
                    </span>
                    <span className="text-xs text-slate-400 truncate">
                      {item.admin1 ? `${item.admin1}, ` : ''}{item.country}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-500 shrink-0 ml-2">
                    {item.latitude.toFixed(1)}°, {item.longitude.toFixed(1)}°
                  </span>
                </button>
              ))}
            </div>
          ) : query.length >= 2 && !loading ? (
            <div className="p-4 text-center text-xs text-slate-400">
              No matching meteorological stations found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="p-2">
              <div className="px-2 py-1 text-[11px] font-mono text-slate-500 uppercase">
                Global Key Logistics Nodes
              </div>
              <div className="grid grid-cols-2 gap-1 mt-1">
                {DEFAULT_CITIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelect(c)}
                    className="flex items-center space-x-2 px-2.5 py-1.5 rounded hover:bg-slate-800/60 text-xs text-slate-300 text-left"
                  >
                    <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="truncate">{c.name}, {c.country_code}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
