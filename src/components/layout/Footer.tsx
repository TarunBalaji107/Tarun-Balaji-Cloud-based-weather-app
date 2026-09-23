import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-300">Cloud Weather Intelligence Platform</span>
          <span>·</span>
          <span>Azure Functions & Cosmos DB Architecture</span>
        </div>
        <div className="flex items-center space-x-6 text-slate-400 font-mono">
          <span>WMO Compliant</span>
          <span>·</span>
          <span>ECMWF / Open-Meteo Telemetry</span>
          <span>·</span>
          <span>ISO 27001 Data Pipeline</span>
        </div>
      </div>
    </footer>
  );
};
