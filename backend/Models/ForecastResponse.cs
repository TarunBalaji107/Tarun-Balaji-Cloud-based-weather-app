using System.Text.Json.Serialization;

namespace WeatherDashboardAPI.Models;

public record DailyForecastDto(
    [property: JsonPropertyName("date")] string Date,
    [property: JsonPropertyName("dayOfWeek")] string DayOfWeek,
    [property: JsonPropertyName("minTemp")] double MinTemp,
    [property: JsonPropertyName("maxTemp")] double MaxTemp,
    [property: JsonPropertyName("apparentMinTemp")] double ApparentMinTemp,
    [property: JsonPropertyName("apparentMaxTemp")] double ApparentMaxTemp,
    [property: JsonPropertyName("weatherCode")] int WeatherCode,
    [property: JsonPropertyName("weatherDescription")] string WeatherDescription,
    [property: JsonPropertyName("precipitationProbability")] int PrecipitationProbability,
    [property: JsonPropertyName("precipitationSum")] double PrecipitationSum,
    [property: JsonPropertyName("rainSum")] double RainSum,
    [property: JsonPropertyName("snowfallSum")] double SnowfallSum,
    [property: JsonPropertyName("maxWindSpeed")] double MaxWindSpeed,
    [property: JsonPropertyName("windDirectionDominant")] int WindDirectionDominant,
    [property: JsonPropertyName("uvIndexMax")] double UvIndexMax,
    [property: JsonPropertyName("sunrise")] string Sunrise,
    [property: JsonPropertyName("sunset")] string Sunset
);

public record HourlyForecastDto(
    [property: JsonPropertyName("time")] string Time,
    [property: JsonPropertyName("temperature")] double Temperature,
    [property: JsonPropertyName("apparentTemperature")] double ApparentTemperature,
    [property: JsonPropertyName("precipitationProbability")] int PrecipitationProbability,
    [property: JsonPropertyName("precipitation")] double Precipitation,
    [property: JsonPropertyName("weatherCode")] int WeatherCode,
    [property: JsonPropertyName("weatherDescription")] string WeatherDescription,
    [property: JsonPropertyName("humidity")] int Humidity,
    [property: JsonPropertyName("windSpeed")] double WindSpeed,
    [property: JsonPropertyName("uvIndex")] double UvIndex,
    [property: JsonPropertyName("isDay")] bool IsDay
);

public record ForecastResponse(
    [property: JsonPropertyName("city")] string City,
    [property: JsonPropertyName("country")] string Country,
    [property: JsonPropertyName("coordinates")] Coordinates Coordinates,
    [property: JsonPropertyName("daily")] List<DailyForecastDto> Daily,
    [property: JsonPropertyName("hourly")] List<HourlyForecastDto> Hourly,
    [property: JsonPropertyName("generatedTime")] string GeneratedTime
);
