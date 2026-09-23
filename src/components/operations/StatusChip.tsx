import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { ComponentHealthStatus } from '../../types/health';

interface StatusChipProps {
  status: ComponentHealthStatus | 'Warning' | 'Deploying' | 'Failed';
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  label,
  size = 'md',
}) => {
  const getDetails = () => {
    switch (status) {
      case 'Healthy':
        return {
          icon: CheckCircle2,
          textColor: 'text-emerald-400',
          dotColor: 'bg-emerald-400',
          text: label || 'Healthy',
        };
      case 'Degraded':
      case 'Warning':
        return {
          icon: AlertTriangle,
          textColor: 'text-amber-400',
          dotColor: 'bg-amber-400',
          text: label || 'Degraded',
        };
      case 'Deploying':
        return {
          icon: Clock,
          textColor: 'text-cyan-400',
          dotColor: 'bg-cyan-400',
          text: label || 'Deploying',
        };
      case 'Unhealthy':
      case 'Failed':
      default:
        return {
          icon: XCircle,
          textColor: 'text-rose-400',
          dotColor: 'bg-rose-400',
          text: label || 'Unhealthy',
        };
    }
  };

  const details = getDetails();
  const Icon = details.icon;

  return (
    <span className={`inline-flex items-center space-x-1.5 font-mono font-medium ${details.textColor} ${size === 'sm' ? 'text-[11px]' : 'text-xs'}`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{details.text}</span>
    </span>
  );
};
