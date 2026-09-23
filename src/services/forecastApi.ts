import { DailyForecastItem, ForecastResponseData, HourlyForecastItem } from '../types/forecast';
import { WMO_WEATHER_CODES } from './weatherApi';

export async function fetchForecastData(
  city: string,
  country: string,
  lat: number,
  lon: number
): Promise<ForecastResponseData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,snowfall_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,relative_humidity_2m,wind_speed_10m,uv_index,is_day&timezone=auto`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Forecast API HTTP ${res.status}`);
    const data = await res.json();

    const dailyRaw = data.daily || {};
    const hourlyRaw = data.hourly || {};

    const daily: DailyForecastItem[] = [];
    const daysCount = (dailyRaw.time || []).length;

    for (let i = 0; i < Math.min(daysCount, 7); i++) {
      const dateStr = dailyRaw.time[i];
      const dateObj = new Date(dateStr + 'T12:00:00Z');
      const dayOfWeek = i === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      const code = dailyRaw.weather_code[i] ?? 0;
      const weatherInfo = WMO_WEATHER_CODES[code] || { description: 'Clear', icon: 'sun' };

      daily.push({
        date: dateStr,
        dayOfWeek,
        minTemp: Math.round(dailyRaw.temperature_2m_min[i] ?? 14),
        maxTemp: Math.round(dailyRaw.temperature_2m_max[i] ?? 24),
        apparentMinTemp: Math.round(dailyRaw.apparent_temperature_min[i] ?? 13),
        apparentMaxTemp: Math.round(dailyRaw.apparent_temperature_max[i] ?? 25),
        weatherCode: code,
        weatherDescription: weatherInfo.description,
        precipitationProbability: Math.round(dailyRaw.precipitation_probability_max[i] ?? 10),
        precipitationSum: Math.round((dailyRaw.precipitation_sum[i] ?? 0) * 10) / 10,
        rainSum: Math.round((dailyRaw.rain_sum[i] ?? 0) * 10) / 10,
        snowfallSum: Math.round((dailyRaw.snowfall_sum[i] ?? 0) * 10) / 10,
        maxWindSpeed: Math.round(dailyRaw.wind_speed_10m_max[i] ?? 15),
        windDirectionDominant: Math.round(dailyRaw.wind_direction_10m_dominant[i] ?? 180),
        uvIndexMax: Math.round((dailyRaw.uv_index_max[i] ?? 5) * 10) / 10,
        sunrise: dailyRaw.sunrise[i] ? dailyRaw.sunrise[i].split('T')[1] : '06:00',
        sunset: dailyRaw.sunset[i] ? dailyRaw.sunset[i].split('T')[1] : '19:30',
      });
    }

    const hourly: HourlyForecastItem[] = [];
    // Take next 24 hours starting from current hour
    const nowHour = new Date().getHours();
    const hourlyTimes = hourlyRaw.time || [];
    const startIndex = Math.max(0, Math.min(nowHour, hourlyTimes.length - 24));

    for (let i = startIndex; i < Math.min(startIndex + 24, hourlyTimes.length); i++) {
      const timeStr = hourlyTimes[i];
      const timeLabel = timeStr ? timeStr.split('T')[1]?.substring(0, 5) || '12:00' : '12:00';
      const code = hourlyRaw.weather_code?.[i] ?? 0;
      const weatherInfo = WMO_WEATHER_CODES[code] || { description: 'Clear', icon: 'sun' };

      hourly.push({
        time: timeLabel,
        temperature: Math.round(hourlyRaw.temperature_2m?.[i] ?? 20),
        apparentTemperature: Math.round(hourlyRaw.apparent_temperature?.[i] ?? 20),
        precipitationProbability: Math.round(hourlyRaw.precipitation_probability?.[i] ?? 0),
        precipitation: Math.round((hourlyRaw.precipitation?.[i] ?? 0) * 10) / 10,
        weatherCode: code,
        weatherDescription: weatherInfo.description,
        humidity: Math.round(hourlyRaw.relative_humidity_2m?.[i] ?? 50),
        windSpeed: Math.round(hourlyRaw.wind_speed_10m?.[i] ?? 10),
        uvIndex: Math.round((hourlyRaw.uv_index?.[i] ?? 0) * 10) / 10,
        isDay: hourlyRaw.is_day?.[i] === 1,
      });
    }

    return {
      city,
      country,
      coordinates: { lat, lon },
      daily,
      hourly,
      generatedTime: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to fetch forecast, using fallback:', error);
    return getFallbackForecast(city, country, lat, lon);
  }
}

export function getFallbackForecast(
  city: string,
  country: string,
  lat: number,
  lon: number
): ForecastResponseData {
  const days = ['Today', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon'];
  const daily: DailyForecastItem[] = days.map((day, idx) => ({
    date: new Date(Date.now() + idx * 86400000).toISOString().split('T')[0],
    dayOfWeek: day,
    minTemp: 14 + (idx % 3),
    maxTemp: 23 + (idx % 4),
    apparentMinTemp: 13 + (idx % 3),
    apparentMaxTemp: 24 + (idx % 4),
    weatherCode: idx === 3 ? 61 : idx === 5 ? 2 : 1,
    weatherDescription: idx === 3 ? 'Slight rain' : idx === 5 ? 'Partly cloudy' : 'Mainly clear',
    precipitationProbability: idx === 3 ? 65 : 15,
    precipitationSum: idx === 3 ? 4.2 : 0,
    rainSum: idx === 3 ? 4.2 : 0,
    snowfallSum: 0,
    maxWindSpeed: 16,
    windDirectionDominant: 200,
    uvIndexMax: 5.4,
    sunrise: '06:15',
    sunset: '19:45',
  }));

  const hourly: HourlyForecastItem[] = Array.from({ length: 24 }).map((_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    temperature: Math.round(18 + Math.sin(i / 4) * 6),
    apparentTemperature: Math.round(18 + Math.sin(i / 4) * 6),
    precipitationProbability: i > 14 && i < 18 ? 40 : 10,
    precipitation: i === 16 ? 1.2 : 0,
    weatherCode: i > 14 && i < 18 ? 61 : 1,
    weatherDescription: i > 14 && i < 18 ? 'Slight rain' : 'Mainly clear',
    humidity: Math.round(55 + Math.cos(i / 4) * 15),
    windSpeed: Math.round(12 + Math.sin(i / 3) * 5),
    uvIndex: i >= 9 && i <= 17 ? Math.round(Math.sin((i - 9) / 8 * Math.PI) * 70) / 10 : 0,
    isDay: i >= 6 && i <= 20,
  }));

  return {
    city,
    country,
    coordinates: { lat, lon },
    daily,
    hourly,
    generatedTime: new Date().toISOString(),
  };
}
