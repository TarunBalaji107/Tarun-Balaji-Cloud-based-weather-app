using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using WeatherDashboardAPI.Services;

namespace WeatherDashboardAPI.Functions;

public class HealthFunction
{
    private readonly HealthService _healthService;
    private readonly ILogger<HealthFunction> _logger;

    public HealthFunction(HealthService healthService, ILogger<HealthFunction> logger)
    {
        _healthService = healthService;
        _logger = logger;
    }

    [Function("HealthFunction")]
    public IActionResult Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "health")] HttpRequest req)
    {
        _logger.LogInformation("System health probe invoked");
        var health = _healthService.CheckSystemHealth();
        return new OkObjectResult(health);
    }
}
