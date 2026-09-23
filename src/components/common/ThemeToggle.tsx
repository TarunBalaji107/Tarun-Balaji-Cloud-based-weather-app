import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  isDark?: boolean;
  onToggleTheme?: () => void;
  tempUnit: 'celsius' | 'fahrenheit';
  onToggleUnit: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  isDark = true,
  onToggleTheme,
  tempUnit,
  onToggleUnit,
}) => {
  return (
    <div className="flex items-center space-x-2">
      {/* Unit switch */}
      <button
        onClick={onToggleUnit}
        title="Toggle Temperature Unit (°C / °F)"
        className="px-2.5 py-1 text-xs font-mono font-medium rounded-md border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
      >
        {tempUnit === 'celsius' ? '°C' : '°F'}
      </button>

      {/* Theme toggle */}
      {onToggleTheme && (
        <button
          onClick={onToggleTheme}
          title="Toggle Display Mode"
          className="p-1.5 rounded-md border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-300" />}
        </button>
      )}
    </div>
  );
};
