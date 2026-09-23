export interface CurrentWeatherData {
  city: string;
  country: string;
  countryCode: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  weatherDescription: string;
  weatherIcon: string;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  windGusts?: number;
  pressure: number;
  uvIndex: number;
  visibility: number;
  cloudCover: number;
  dewPoint: number;
  precipitation: number;
  rain: number;
  isDay: boolean;
  sunrise: string;
  sunset: string;
  lastUpdated: string;
  airQuality?: {
    aqi: number;
    pm25: number;
    pm10: number;
    co: number;
    no2: number;
    status: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  };
}

export interface CitySearchResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code: string;
  country: string;
  admin1?: string;
  timezone?: string;
  population?: number;
}

export interface FavoriteCityItem {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  addedAt: string;
  temp?: number;
  condition?: string;
  weatherCode?: number;
  tempTrend?: 'rising' | 'falling' | 'stable';
}

export interface WeatherIntelligenceInsight {
  id: string;
  title: string;
  summary: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  confidenceScore: number; // 0-100
  affectedSectors: ('Aviation' | 'Logistics' | 'Cloud Infrastructure' | 'Agriculture' | 'Energy Grid')[];
  recommendations: string[];
  generatedAt: string;
  model: string;
}
