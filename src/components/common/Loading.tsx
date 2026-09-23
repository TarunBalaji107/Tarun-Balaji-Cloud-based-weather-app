import React from 'react';

interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Ingesting atmospheric telemetry...',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 space-y-3">
      <div
        className={`${sizeClasses[size]} border-slate-700 border-t-cyan-400 rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {message && (
        <p className="text-xs text-slate-400 font-mono tracking-wide">{message}</p>
      )}
    </div>
  );
};
