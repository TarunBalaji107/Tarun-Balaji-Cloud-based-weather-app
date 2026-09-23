using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using WeatherDashboardAPI.Models;

namespace WeatherDashboardAPI.Functions;

public class AlertsFunction
{
    private readonly ILogger<AlertsFunction> _logger;

    public AlertsFunction(ILogger<AlertsFunction> logger)
    {
        _logger = logger;
    }

    [Function("AlertsFunction")]
    public IActionResult Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "weather/alerts")] HttpRequest req)
    {
        string? city = req.Query["city"];
        _logger.LogInformation("Evaluating severe weather advisories for {City}", city ?? "All");

        var alerts = new List<WeatherAlertDto>
        {
            new(
                Id: "alt-001",
                Headline: "Severe Thunderstorm Warning & Flash Flood Watch",
                Event: "Severe Convective System",
                Severity: "severe",
                Urgency: "Immediate",
                AreaDesc: "Central Mid-Atlantic Corridor (NY, PA, NJ)",
                Instruction: "Move to interior room on lowest floor. Datacenter cooling chillers on auxiliary power standby.",
                Effective: DateTime.UtcNow.ToString("o"),
                Expires: DateTime.UtcNow.AddHours(8).ToString("o"),
                Source: "National Weather Intelligence Center",
                Metrics: new AlertMetricsDto(ExpectedWindGustsKmh: 85, ExpectedRainfallMm: 45, ExpectedTempExtremeC: null)
            ),
            new(
                Id: "alt-002",
                Headline: "High Wind and Aviation Shear Advisory",
                Event: "Jet Stream Turbulence",
                Severity: "moderate",
                Urgency: "Expected",
                AreaDesc: "Greater London & English Channel Airspace",
                Instruction: "Ground cargo handling equipment must be anchored. Expect approach pattern holds.",
                Effective: DateTime.UtcNow.ToString("o"),
                Expires: DateTime.UtcNow.AddHours(12).ToString("o"),
                Source: "Met Office Aviation Unit",
                Metrics: new AlertMetricsDto(ExpectedWindGustsKmh: 72, ExpectedRainfallMm: null, ExpectedTempExtremeC: null)
            )
        };

        return new OkObjectResult(alerts);
    }
}
