export type AlertSeverity = 'critical' | 'severe' | 'moderate' | 'minor';

export interface WeatherAlert {
  id: string;
  headline: string;
  event: string;
  severity: AlertSeverity;
  urgency: 'Immediate' | 'Expected' | 'Future' | 'Past';
  areaDesc: string;
  instruction: string;
  effective: string;
  expires: string;
  source: string;
  affectedCoordinates?: {
    lat: number;
    lon: number;
    radiusKm: number;
  };
  metrics?: {
    expectedWindGustsKmh?: number;
    expectedRainfallMm?: number;
    expectedTempExtremeC?: number;
  };
}

export interface AlertThresholdRule {
  id: string;
  name: string;
  metric: 'temperature_max' | 'temperature_min' | 'wind_speed' | 'precipitation' | 'uv_index';
  condition: 'gt' | 'lt';
  value: number;
  unit: string;
  enabled: boolean;
  notifyTarget: 'email' | 'webhook' | 'sms' | 'devops_event';
}
