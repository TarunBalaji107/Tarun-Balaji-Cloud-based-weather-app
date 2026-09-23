import React from 'react';
import {
  LayoutDashboard,
  Bookmark,
  BarChart3,
  AlertTriangle,
  Server,
  GitBranch,
  Settings,
  MapPin,
} from 'lucide-react';
import { FavoriteCityItem } from '../../types/weather';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  favorites: FavoriteCityItem[];
  onSelectCity: (name: string, country: string, lat: number, lon: number) => void;
  currentCityName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  favorites,
  onSelectCity,
  currentCityName,
}) => {
  const mainNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'favorites', label: 'Saved Cities', icon: Bookmark },
    { id: 'analytics', label: 'Analytics & Trends', icon: BarChart3 },
    { id: 'alerts', label: 'Severe Alerts', icon: AlertTriangle },
    { id: 'operations', label: 'Cloud Operations', icon: Server },
    { id: 'release', label: 'Release Center', icon: GitBranch },
    { id: 'settings', label: 'Architecture & Docs', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        {/* Navigation items */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">
            Navigation
          </p>
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Monitored Regions */}
        <div className="space-y-2 pt-4 border-t border-slate-900">
          <div className="flex items-center justify-between px-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Monitored Nodes
            </span>
            <span className="text-xs font-mono text-slate-500">{favorites.length}</span>
          </div>

          <div className="space-y-1">
            {favorites.slice(0, 5).map((city) => {
              const isSelected = currentCityName?.toLowerCase() === city.name.toLowerCase();
              return (
                <button
                  key={city.id}
                  onClick={() => onSelectCity(city.name, city.country, city.latitude, city.longitude)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs transition-colors ${
                    isSelected
                      ? 'bg-slate-800/80 text-white font-medium border border-slate-700/60'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{city.name}</span>
                  </div>
                  {city.temp !== undefined && (
                    <span className="font-mono text-slate-300 ml-2">{city.temp}°</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cloud region marker */}
      <div className="mt-auto p-4 border-t border-slate-900 text-xs text-slate-400">
        <div className="flex items-center justify-between font-mono">
          <span>Azure Region:</span>
          <span className="text-slate-300">East US 2</span>
        </div>
        <div className="flex items-center justify-between font-mono mt-1">
          <span>Telemetry Stream:</span>
          <span className="text-emerald-400">Active</span>
        </div>
      </div>
    </aside>
  );
};
