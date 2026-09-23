using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using WeatherDashboardAPI.Services;

namespace WeatherDashboardAPI.Functions;

public class CurrentWeatherFunction
{
    private readonly WeatherService _weatherService;
    private readonly ILogger<CurrentWeatherFunction> _logger;

    public CurrentWeatherFunction(WeatherService weatherService, ILogger<CurrentWeatherFunction> logger)
    {
        _weatherService = weatherService;
        _logger = logger;
    }

    [Function("CurrentWeatherFunction")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "weather/current")] HttpRequest req)
    {
        string? city = req.Query["city"];
        string? latStr = req.Query["lat"];
        string? lonStr = req.Query["lon"];
        string? countryCode = req.Query["countryCode"];

        if (string.IsNullOrWhiteSpace(city)) city = "New York";
        double.TryParse(latStr, out double lat);
        double.TryParse(lonStr, out double lon);

        if (lat == 0 && lon == 0)
        {
            lat = 40.7128;
            lon = -74.006;
        }

        _logger.LogInformation("Processing current weather telemetry request for {City} ({Lat},{Lon})", city, lat, lon);
        var result = await _weatherService.GetCurrentWeatherAsync(city, lat, lon, countryCode ?? "US");
        return new OkObjectResult(result);
    }
}
