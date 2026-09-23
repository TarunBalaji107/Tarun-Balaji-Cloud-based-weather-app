import { CitySearchResult, CurrentWeatherData } from '../types/weather';

export const WMO_WEATHER_CODES: Record<number, { description: string; icon: string }> = {
  0: { description: 'Clear sky', icon: 'sun' },
  1: { description: 'Mainly clear', icon: 'sun' },
  2: { description: 'Partly cloudy', icon: 'cloud-sun' },
  3: { description: 'Overcast', icon: 'cloud' },
  45: { description: 'Fog', icon: 'cloud-fog' },
  48: { description: 'Depositing rime fog', icon: 'cloud-fog' },
  51: { description: 'Light drizzle', icon: 'cloud-drizzle' },
  53: { description: 'Moderate drizzle', icon: 'cloud-drizzle' },
  55: { description: 'Dense drizzle', icon: 'cloud-drizzle' },
  56: { description: 'Light freezing drizzle', icon: 'cloud-snow' },
  57: { description: 'Dense freezing drizzle', icon: 'cloud-snow' },
  61: { description: 'Slight rain', icon: 'cloud-rain' },
  63: { description: 'Moderate rain', icon: 'cloud-rain' },
  65: { description: 'Heavy rain', icon: 'cloud-rain' },
  66: { description: 'Light freezing rain', icon: 'cloud-snow' },
  67: { description: 'Heavy freezing rain', icon: 'cloud-snow' },
  71: { description: 'Slight snow fall', icon: 'snowflake' },
  73: { description: 'Moderate snow fall', icon: 'snowflake' },
  75: { description: 'Heavy snow fall', icon: 'snowflake' },
  77: { description: 'Snow grains', icon: 'snowflake' },
  80: { description: 'Slight rain showers', icon: 'cloud-rain' },
  81: { description: 'Moderate rain showers', icon: 'cloud-rain' },
  82: { description: 'Violent rain showers', icon: 'cloud-rain' },
  85: { description: 'Slight snow showers', icon: 'snowflake' },
  86: { description: 'Heavy snow showers', icon: 'snowflake' },
  95: { description: 'Thunderstorm', icon: 'cloud-lightning' },
  96: { description: 'Thunderstorm with slight hail', icon: 'cloud-lightning' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'cloud-lightning' },
};

export const DEFAULT_CITIES: CitySearchResult[] = [
  { id: 5128581, name: 'New York', latitude: 40.7128, longitude: -74.0060, country_code: 'US', country: 'United States', admin1: 'New York' },
  { id: 2643743, name: 'London', latitude: 51.5074, longitude: -0.1278, country_code: 'GB', country: 'United Kingdom', admin1: 'England' },
  { id: 1850147, name: 'Tokyo', latitude: 35.6762, longitude: 139.6503, country_code: 'JP', country: 'Japan', admin1: 'Tokyo' },
  { id: 2988507, name: 'Paris', latitude: 48.8566, longitude: 2.3522, country_code: 'FR', country: 'France', admin1: 'Île-de-France' },
  { id: 1275339, name: 'Mumbai', latitude: 19.0760, longitude: 72.8777, country_code: 'IN', country: 'India', admin1: 'Maharashtra' },
  { id: 2147714, name: 'Sydney', latitude: -33.8688, longitude: 151.2093, country_code: 'AU', country: 'Australia', admin1: 'New South Wales' },
  { id: 5391959, name: 'San Francisco', latitude: 37.7749, longitude: -122.4194, country_code: 'US', country: 'United States', admin1: 'California' },
];

export async function searchCities(query: string): Promise<CitySearchResult[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=8&language=en&format=json`
    );
    if (!res.ok) throw new Error('Geocoding API failed');
    const data = await res.json();
    return (data.results || []) as CitySearchResult[];
  } catch (err) {
    console.warn('Geocoding search failed, falling back to local list:', err);
    return DEFAULT_CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.country.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export async function fetchCurrentWeather(
  city: string,
  country: string,
  countryCode: string,
  lat: number,
  lon: number
): Promise<CurrentWeatherData> {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&daily=sunrise,sunset,uv_index_max&hourly=dew_point_2m,visibility&timezone=auto`;
  const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide&timezone=auto`;

  try {
    const [weatherRes, airRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(airQualityUrl).catch(() => null),
    ]);

    if (!weatherRes.ok) {
      throw new Error(`Weather API error: ${weatherRes.status}`);
    }

    const data = await weatherRes.json();
    let airData = null;
    if (airRes && airRes.ok) {
      airData = await airRes.json().catch(() => null);
    }

    const current = data.current || {};
    const daily = data.daily || {};
    const hourly = data.hourly || {};

    const code = current.weather_code ?? 0;
    const weatherInfo = WMO_WEATHER_CODES[code] || { description: 'Clear', icon: 'sun' };

    // Air quality parsing
    let airQualityInfo: CurrentWeatherData['airQuality'] = undefined;
    if (airData?.current?.us_aqi !== undefined) {
      const aqi = Math.round(airData.current.us_aqi);
      let status: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous' = 'Good';
      if (aqi > 300) status = 'Hazardous';
      else if (aqi > 200) status = 'Very Unhealthy';
      else if (aqi > 150) status = 'Unhealthy';
      else if (aqi > 100) status = 'Unhealthy for Sensitive Groups';
      else if (aqi > 50) status = 'Moderate';

      airQualityInfo = {
        aqi,
        pm25: airData.current.pm2_5 ?? 12,
        pm10: airData.current.pm10 ?? 24,
        co: airData.current.carbon_monoxide ?? 250,
        no2: airData.current.nitrogen_dioxide ?? 18,
        status,
      };
    }

    const dewPoint = hourly.dew_point_2m?.[0] ?? Math.round(current.temperature_2m - (100 - current.relative_humidity_2m) / 5);
    const visibility = hourly.visibility?.[0] ? Math.round(hourly.visibility[0] / 1000) : 10;

    return {
      city,
      country,
      countryCode,
      coordinates: { lat, lon },
      temperature: Math.round(current.temperature_2m ?? 21),
      apparentTemperature: Math.round(current.apparent_temperature ?? current.temperature_2m ?? 21),
      weatherCode: code,
      weatherDescription: weatherInfo.description,
      weatherIcon: weatherInfo.icon,
      humidity: Math.round(current.relative_humidity_2m ?? 50),
      windSpeed: Math.round(current.wind_speed_10m ?? 12),
      windDirection: Math.round(current.wind_direction_10m ?? 180),
      windGusts: current.wind_gusts_10m ? Math.round(current.wind_gusts_10m) : undefined,
      pressure: Math.round(current.pressure_msl ?? 1013),
      uvIndex: daily.uv_index_max?.[0] ? Math.round(daily.uv_index_max[0] * 10) / 10 : 4.5,
      visibility,
      cloudCover: Math.round(current.cloud_cover ?? 20),
      dewPoint: Math.round(dewPoint),
      precipitation: current.precipitation ?? 0,
      rain: current.rain ?? 0,
      isDay: current.is_day === 1,
      sunrise: daily.sunrise?.[0] ? daily.sunrise[0].split('T')[1] || '06:30' : '06:30',
      sunset: daily.sunset?.[0] ? daily.sunset[0].split('T')[1] || '19:45' : '19:45',
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      airQuality: airQualityInfo,
    };
  } catch (error) {
    console.error('Failed to fetch live weather, using reliable fallback:', error);
    return getFallbackWeather(city, country, countryCode, lat, lon);
  }
}

export function getFallbackWeather(
  city: string,
  country: string,
  countryCode: string,
  lat: number,
  lon: number
): CurrentWeatherData {
  return {
    city,
    country,
    countryCode,
    coordinates: { lat, lon },
    temperature: 22,
    apparentTemperature: 23,
    weatherCode: 1,
    weatherDescription: 'Mainly clear',
    weatherIcon: 'sun',
    humidity: 58,
    windSpeed: 14,
    windDirection: 210,
    windGusts: 22,
    pressure: 1014,
    uvIndex: 5.2,
    visibility: 12,
    cloudCover: 25,
    dewPoint: 13,
    precipitation: 0.0,
    rain: 0.0,
    isDay: true,
    sunrise: '06:14',
    sunset: '19:48',
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    airQuality: {
      aqi: 42,
      pm25: 8.4,
      pm10: 15.2,
      co: 210,
      no2: 12.1,
      status: 'Good',
    },
  };
}
