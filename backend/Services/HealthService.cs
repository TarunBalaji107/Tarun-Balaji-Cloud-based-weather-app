using WeatherDashboardAPI.Models;

namespace WeatherDashboardAPI.Services;

public class HealthService
{
    public HealthResponse CheckSystemHealth()
    {
        var services = new List<ServiceHealthItem>
        {
            new("CurrentWeatherFunction (Azure Function App)", "AzureFunction", "Healthy", 38, 99.98, "Just now", "East US 2",
                new Dictionary<string, object> { ["requestCount24h"] = 184200, ["circuitBreaker"] = "Closed" }),

            new("ForecastFunction (Azure Function App)", "AzureFunction", "Healthy", 44, 99.95, "Just now", "East US 2",
                new Dictionary<string, object> { ["requestCount24h"] = 142100, ["circuitBreaker"] = "Closed" }),

            new("Cosmos DB NoSQL Database", "CosmosDB", "Healthy", 12, 99.999, "Just now", "East US 2",
                new Dictionary<string, object> { ["consumedRUs"] = 420, ["activeConnections"] = 32 }),

            new("Azure OpenAI Weather Risk Engine", "OpenAI", "Healthy", 182, 99.89, "Just now", "East US",
                new Dictionary<string, object> { ["model"] = "gpt-4o", ["status"] = "Nominal" }),

            new("Application Insights APM Workspace", "ApplicationInsights", "Healthy", 18, 99.99, "Just now", "East US 2",
                new Dictionary<string, object> { ["telemetryRate"] = "1.25M events/24h" })
        };

        return new HealthResponse(
            OverallStatus: "Healthy",
            HealthyCount: services.Count,
            TotalServices: services.Count,
            AverageLatencyMs: 58,
            ErrorRate24h: 0.03,
            LastDeploymentTimestamp: DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm UTC"),
            Services: services
        );
    }
}
