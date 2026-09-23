using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using WeatherDashboardAPI.Models;
using WeatherDashboardAPI.Services;

namespace WeatherDashboardAPI.Functions;

public class AIInsightsFunction
{
    private readonly OpenAIService _openAIService;
    private readonly ILogger<AIInsightsFunction> _logger;

    public AIInsightsFunction(OpenAIService openAIService, ILogger<AIInsightsFunction> logger)
    {
        _openAIService = openAIService;
        _logger = logger;
    }

    [Function("AIInsightsFunction")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "weather/insights")] HttpRequest req)
    {
        using var reader = new StreamReader(req.Body);
        string body = await reader.ReadToEndAsync();
        var weather = JsonSerializer.Deserialize<WeatherResponse>(body);

        if (weather == null)
        {
            return new BadRequestObjectResult(new { error = "Weather payload is required" });
        }

        _logger.LogInformation("Generating AI hazard assessment for {City}", weather.City);
        string insightText = await _openAIService.GenerateOperationalInsightAsync(weather);

        var result = new
        {
            id = $"ai-{Guid.NewGuid():N}",
            title = $"Atmospheric Stability Assessment for {weather.City}",
            summary = insightText,
            confidenceScore = 95,
            affectedSectors = new[] { "Aviation", "Logistics", "Cloud Infrastructure" },
            model = "Azure OpenAI GPT-4o Weather Intelligence Engine",
            generatedAt = DateTime.UtcNow.ToString("o")
        };

        return new OkObjectResult(result);
    }
}
