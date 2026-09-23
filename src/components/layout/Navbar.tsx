import React from 'react';
import { RefreshCw, Cloud, Activity } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  tempUnit: 'celsius' | 'fahrenheit';
  onToggleUnit: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  tempUnit,
  onToggleUnit,
  onRefresh,
  isRefreshing,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'operations', label: 'Operations' },
    { id: 'release', label: 'Release Center' },
    { id: 'settings', label: 'Architecture' },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single Brand Wordmark */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Cloud className="w-4 h-4" />
          </div>
          <button
            onClick={() => onSelectTab('dashboard')}
            className="text-base sm:text-lg font-bold tracking-tight text-white hover:text-cyan-300 transition-colors text-left"
          >
            Cloud Weather Intelligence
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`transition-colors whitespace-nowrap py-1 ${
                  isActive
                    ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center space-x-3">
          <ThemeToggle tempUnit={tempUnit} onToggleUnit={onToggleUnit} />

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh telemetry stream"
              className="p-1.5 rounded-md border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          )}

          <button
            onClick={() => onSelectTab('operations')}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-md text-xs font-medium text-cyan-300 transition-colors"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Telemetry</span>
          </button>
        </div>
      </div>
    </header>
  );
};
