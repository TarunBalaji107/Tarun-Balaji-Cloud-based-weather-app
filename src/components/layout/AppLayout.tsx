import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { FavoriteCityItem } from '../../types/weather';

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  favorites: FavoriteCityItem[];
  onSelectCity: (name: string, country: string, lat: number, lon: number) => void;
  currentCityName?: string;
  tempUnit: 'celsius' | 'fahrenheit';
  onToggleUnit: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  activeTab,
  onSelectTab,
  favorites,
  onSelectCity,
  currentCityName,
  tempUnit,
  onToggleUnit,
  onRefresh,
  isRefreshing,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        tempUnit={tempUnit}
        onToggleUnit={onToggleUnit}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            activeTab={activeTab}
            onSelectTab={onSelectTab}
            favorites={favorites}
            onSelectCity={onSelectCity}
            currentCityName={currentCityName}
          />
        </div>

        {/* Mobile Sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden flex"
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className="w-72 bg-slate-950 h-full p-4 border-r border-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar
                activeTab={activeTab}
                onSelectTab={(tab) => {
                  onSelectTab(tab);
                  setSidebarOpen(false);
                }}
                favorites={favorites}
                onSelectCity={(n, c, lat, lon) => {
                  onSelectCity(n, c, lat, lon);
                  setSidebarOpen(false);
                }}
                currentCityName={currentCityName}
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};
