using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using WeatherDashboardAPI.Models;

namespace WeatherDashboardAPI.Functions;

public class ForecastFunction
{
    private readonly ILogger<ForecastFunction> _logger;

    public ForecastFunction(ILogger<ForecastFunction> logger)
    {
        _logger = logger;
    }

    [Function("ForecastFunction")]
    public IActionResult Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "weather/forecast")] HttpRequest req)
    {
        string? city = req.Query["city"] ?? "New York";
        string? latStr = req.Query["lat"];
        string? lonStr = req.Query["lon"];

        double.TryParse(latStr, out double lat);
        double.TryParse(lonStr, out double lon);
        if (lat == 0 && lon == 0) { lat = 40.7128; lon = -74.006; }

        _logger.LogInformation("Generating 7-day numerical forecast for {City}", city);

        var days = new[] { "Today", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon" };
        var daily = days.Select((d, idx) => new DailyForecastDto(
            Date: DateTime.UtcNow.AddDays(idx).ToString("yyyy-MM-dd"),
            DayOfWeek: d,
            MinTemp: 14 + (idx % 3),
            MaxTemp: 23 + (idx % 4),
            ApparentMinTemp: 13 + (idx % 3),
            ApparentMaxTemp: 24 + (idx % 4),
            WeatherCode: idx == 3 ? 61 : 1,
            WeatherDescription: idx == 3 ? "Slight rain" : "Mainly clear",
            PrecipitationProbability: idx == 3 ? 65 : 10,
            PrecipitationSum: idx == 3 ? 4.2 : 0.0,
            RainSum: idx == 3 ? 4.2 : 0.0,
            SnowfallSum: 0.0,
            MaxWindSpeed: 16.0,
            WindDirectionDominant: 200,
            UvIndexMax: 5.4,
            Sunrise: "06:15",
            Sunset: "19:45"
        )).ToList();

        var hourly = Enumerable.Range(0, 24).Select(i => new HourlyForecastDto(
            Time: $"{i:D2}:00",
            Temperature: Math.Round(18 + Math.Sin(i / 4.0) * 6, 1),
            ApparentTemperature: Math.Round(18 + Math.Sin(i / 4.0) * 6, 1),
            PrecipitationProbability: (i > 14 && i < 18) ? 45 : 5,
            Precipitation: i == 16 ? 1.4 : 0.0,
            WeatherCode: (i > 14 && i < 18) ? 61 : 1,
            WeatherDescription: (i > 14 && i < 18) ? "Slight rain" : "Mainly clear",
            Humidity: (int)(55 + Math.Cos(i / 4.0) * 15),
            WindSpeed: Math.Round(12 + Math.Sin(i / 3.0) * 5, 1),
            UvIndex: (i >= 9 && i <= 17) ? 5.2 : 0.0,
            IsDay: i >= 6 && i <= 20
        )).ToList();

        var response = new ForecastResponse(
            City: city,
            Country: "United States",
            Coordinates: new Coordinates(lat, lon),
            Daily: daily,
            Hourly: hourly,
            GeneratedTime: DateTime.UtcNow.ToString("o")
        );

        return new OkObjectResult(response);
    }
}
