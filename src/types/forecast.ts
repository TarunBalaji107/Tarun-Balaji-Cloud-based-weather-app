export interface DailyForecastItem {
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  minTemp: number;
  maxTemp: number;
  apparentMinTemp: number;
  apparentMaxTemp: number;
  weatherCode: number;
  weatherDescription: string;
  precipitationProbability: number;
  precipitationSum: number;
  rainSum: number;
  snowfallSum: number;
  maxWindSpeed: number;
  windDirectionDominant: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
}

export interface HourlyForecastItem {
  time: string; // ISO string or HH:mm
  temperature: number;
  apparentTemperature: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  weatherDescription: string;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  isDay: boolean;
}

export interface ForecastResponseData {
  city: string;
  country: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  daily: DailyForecastItem[];
  hourly: HourlyForecastItem[];
  generatedTime: string;
}
