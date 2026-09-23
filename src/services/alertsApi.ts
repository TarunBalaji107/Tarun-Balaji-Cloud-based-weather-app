import { AlertSeverity, AlertThresholdRule, WeatherAlert } from '../types/alert';

export const INITIAL_ALERT_RULES: AlertThresholdRule[] = [
  {
    id: 'rule-high-temp',
    name: 'Critical Heat Wave Advisory',
    metric: 'temperature_max',
    condition: 'gt',
    value: 38,
    unit: '°C',
    enabled: true,
    notifyTarget: 'devops_event',
  },
  {
    id: 'rule-gale-wind',
    name: 'Gale Force Wind Alert (>65 km/h)',
    metric: 'wind_speed',
    condition: 'gt',
    value: 65,
    unit: 'km/h',
    enabled: true,
    notifyTarget: 'webhook',
  },
  {
    id: 'rule-torrential-rain',
    name: 'Flash Flood Rain Warning (>30 mm/h)',
    metric: 'precipitation',
    condition: 'gt',
    value: 30,
    unit: 'mm',
    enabled: true,
    notifyTarget: 'email',
  },
  {
    id: 'rule-freeze',
    name: 'Black Ice & Freeze Warning (<0°C)',
    metric: 'temperature_min',
    condition: 'lt',
    value: 0,
    unit: '°C',
    enabled: false,
    notifyTarget: 'sms',
  },
  {
    id: 'rule-extreme-uv',
    name: 'Extreme Solar Radiation (UV > 10)',
    metric: 'uv_index',
    condition: 'gt',
    value: 10,
    unit: 'index',
    enabled: true,
    notifyTarget: 'devops_event',
  },
];

export const MOCK_GLOBAL_ALERTS: WeatherAlert[] = [
  {
    id: 'alt-001',
    headline: 'Severe Thunderstorm Warning & Flash Flood Watch',
    event: 'Severe Convective System',
    severity: 'severe',
    urgency: 'Immediate',
    areaDesc: 'Central Mid-Atlantic Corridor (NY, PA, NJ, DE)',
    instruction: 'Move to interior room on lowest floor. Avoid low-lying roadways and power lines. Cloud datacenter cooling chillers on auxiliary standby.',
    effective: '2026-09-23T08:00:00Z',
    expires: '2026-09-23T20:00:00Z',
    source: 'National Weather Intelligence Center',
    metrics: {
      expectedWindGustsKmh: 85,
      expectedRainfallMm: 45,
    },
  },
  {
    id: 'alt-002',
    headline: 'High Wind and Aviation Shear Advisory',
    event: 'Jet Stream Turbulence & Wind Shear',
    severity: 'moderate',
    urgency: 'Expected',
    areaDesc: 'Greater London & English Channel Airspace',
    instruction: 'Ground handling equipment must be tethered. Expect landing slot delays and regional rail speed restrictions.',
    effective: '2026-09-23T11:00:00Z',
    expires: '2026-09-24T04:00:00Z',
    source: 'Met Office Aviation Hazard Unit',
    metrics: {
      expectedWindGustsKmh: 72,
    },
  },
  {
    id: 'alt-003',
    headline: 'Elevated Heat Index & Grid Stress Watch',
    event: 'Thermal Inversion',
    severity: 'moderate',
    urgency: 'Expected',
    areaDesc: 'Tokyo Bay Industrial & Datacenter Belt',
    instruction: 'Implement dynamic workload shifting to alternative Azure regions (East Asia / Australia East) if ambient server inlet temperatures exceed 27°C.',
    effective: '2026-09-23T04:00:00Z',
    expires: '2026-09-24T12:00:00Z',
    source: 'JMA Operational Advisory',
    metrics: {
      expectedTempExtremeC: 36,
    },
  },
  {
    id: 'alt-004',
    headline: 'Coastal Squall and Maritime Safety Notice',
    event: 'Maritime Squall Line',
    severity: 'minor',
    urgency: 'Future',
    areaDesc: 'Sydney Maritime Outer Basin',
    instruction: 'Small craft should remain in port. Crane operations at port terminals should reduce lifting envelope.',
    effective: '2026-09-24T02:00:00Z',
    expires: '2026-09-24T18:00:00Z',
    source: 'Bureau of Meteorology Marine Ops',
  },
];

export async function fetchActiveAlerts(city?: string): Promise<WeatherAlert[]> {
  // If specific city requested, we can filter or return customized alerts
  if (!city) return MOCK_GLOBAL_ALERTS;
  const filtered = MOCK_GLOBAL_ALERTS.filter(
    (a) => a.areaDesc.toLowerCase().includes(city.toLowerCase()) || a.headline.toLowerCase().includes(city.toLowerCase())
  );
  return filtered.length > 0 ? filtered : MOCK_GLOBAL_ALERTS.slice(0, 2);
}

export function evaluateThresholds(
  currentTemp: number,
  windSpeed: number,
  precipitation: number,
  uvIndex: number,
  rules: AlertThresholdRule[]
): { rule: AlertThresholdRule; triggered: boolean; value: number }[] {
  return rules.map((rule) => {
    let triggered = false;
    let actualValue = 0;
    if (rule.metric === 'temperature_max') {
      actualValue = currentTemp;
      triggered = rule.condition === 'gt' ? currentTemp > rule.value : currentTemp < rule.value;
    } else if (rule.metric === 'temperature_min') {
      actualValue = currentTemp;
      triggered = rule.condition === 'lt' ? currentTemp < rule.value : currentTemp > rule.value;
    } else if (rule.metric === 'wind_speed') {
      actualValue = windSpeed;
      triggered = rule.condition === 'gt' ? windSpeed > rule.value : windSpeed < rule.value;
    } else if (rule.metric === 'precipitation') {
      actualValue = precipitation;
      triggered = rule.condition === 'gt' ? precipitation > rule.value : precipitation < rule.value;
    } else if (rule.metric === 'uv_index') {
      actualValue = uvIndex;
      triggered = rule.condition === 'gt' ? uvIndex > rule.value : uvIndex < rule.value;
    }
    return { rule, triggered: rule.enabled && triggered, value: actualValue };
  });
}
