using System.Text.Json.Serialization;

namespace WeatherDashboardAPI.Models;

public record Coordinates(
    [property: JsonPropertyName("lat")] double Lat,
    [property: JsonPropertyName("lon")] double Lon
);

public record AirQualityDto(
    [property: JsonPropertyName("aqi")] int Aqi,
    [property: JsonPropertyName("pm25")] double Pm25,
    [property: JsonPropertyName("pm10")] double Pm10,
    [property: JsonPropertyName("co")] double Co,
    [property: JsonPropertyName("no2")] double No2,
    [property: JsonPropertyName("status")] string Status
);

public record WeatherResponse(
    [property: JsonPropertyName("city")] string City,
    [property: JsonPropertyName("country")] string Country,
    [property: JsonPropertyName("countryCode")] string CountryCode,
    [property: JsonPropertyName("coordinates")] Coordinates Coordinates,
    [property: JsonPropertyName("temperature")] double Temperature,
    [property: JsonPropertyName("apparentTemperature")] double ApparentTemperature,
    [property: JsonPropertyName("weatherCode")] int WeatherCode,
    [property: JsonPropertyName("weatherDescription")] string WeatherDescription,
    [property: JsonPropertyName("weatherIcon")] string WeatherIcon,
    [property: JsonPropertyName("humidity")] int Humidity,
    [property: JsonPropertyName("windSpeed")] double WindSpeed,
    [property: JsonPropertyName("windDirection")] int WindDirection,
    [property: JsonPropertyName("pressure")] double Pressure,
    [property: JsonPropertyName("uvIndex")] double UvIndex,
    [property: JsonPropertyName("visibility")] double Visibility,
    [property: JsonPropertyName("cloudCover")] int CloudCover,
    [property: JsonPropertyName("dewPoint")] double DewPoint,
    [property: JsonPropertyName("precipitation")] double Precipitation,
    [property: JsonPropertyName("rain")] double Rain,
    [property: JsonPropertyName("isDay")] bool IsDay,
    [property: JsonPropertyName("sunrise")] string Sunrise,
    [property: JsonPropertyName("sunset")] string Sunset,
    [property: JsonPropertyName("lastUpdated")] string LastUpdated,
    [property: JsonPropertyName("airQuality")] AirQualityDto? AirQuality
);
