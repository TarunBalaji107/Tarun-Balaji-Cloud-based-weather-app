export type AppRoute =
  | 'dashboard'
  | 'favorites'
  | 'analytics'
  | 'alerts'
  | 'operations'
  | 'release'
  | 'settings';

export interface RouteConfig {
  id: AppRoute;
  label: string;
  path: string;
  description: string;
}

export const APP_ROUTES: RouteConfig[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    description: 'Main synoptic weather telemetry, AI intelligence risk card, and 7-day forecast',
  },
  {
    id: 'favorites',
    label: 'Favorites',
    path: '/favorites',
    description: 'Monitored observation stations registered in Cosmos DB',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    path: '/analytics',
    description: 'Thermal dispersion profiles, rainfall distribution, and comparative matrix',
  },
  {
    id: 'alerts',
    label: 'Alerts',
    path: '/alerts',
    description: 'Severe weather advisories, storm warnings, and threshold notification rules',
  },
  {
    id: 'operations',
    label: 'Operations',
    path: '/operations',
    description: 'Cloud infrastructure telemetry, Azure Functions health, and circuit breakers',
  },
  {
    id: 'release',
    label: 'Release Center',
    path: '/release',
    description: 'Azure DevOps CI/CD pipeline deployment gates, quality index, and smoke tests',
  },
  {
    id: 'settings',
    label: 'Architecture',
    path: '/settings',
    description: 'System specifications, unit settings, and cloud runbooks',
  },
];
