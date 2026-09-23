import { useCallback, useEffect, useState } from 'react';
import { evaluateThresholds, fetchActiveAlerts, INITIAL_ALERT_RULES } from '../services/alertsApi';
import { AlertThresholdRule, WeatherAlert } from '../types/alert';

export function useAlerts(cityName?: string) {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [rules, setRules] = useState<AlertThresholdRule[]>(INITIAL_ALERT_RULES);
  const [loading, setLoading] = useState<boolean>(true);

  const loadAlerts = useCallback(async (c?: string) => {
    setLoading(true);
    try {
      const data = await fetchActiveAlerts(c);
      setAlerts(data);
    } catch (e) {
      console.error('Failed to load alerts:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAlerts(cityName);
  }, [cityName, loadAlerts]);

  const toggleRule = useCallback((id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  }, []);

  const updateRuleValue = useCallback((id: string, value: number) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, value } : r))
    );
  }, []);

  const checkTriggered = useCallback(
    (temp: number, wind: number, rain: number, uv: number) => {
      return evaluateThresholds(temp, wind, rain, uv, rules);
    },
    [rules]
  );

  return {
    alerts,
    rules,
    loading,
    toggleRule,
    updateRuleValue,
    checkTriggered,
    refreshAlerts: () => loadAlerts(cityName),
  };
}
