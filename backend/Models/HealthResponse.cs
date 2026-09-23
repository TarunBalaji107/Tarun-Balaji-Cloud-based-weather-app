using System.Text.Json.Serialization;

namespace WeatherDashboardAPI.Models;

public record ServiceHealthItem(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("type")] string Type,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("latencyMs")] long LatencyMs,
    [property: JsonPropertyName("uptimePercent")] double UptimePercent,
    [property: JsonPropertyName("lastChecked")] string LastChecked,
    [property: JsonPropertyName("region")] string Region,
    [property: JsonPropertyName("details")] Dictionary<string, object> Details
);

public record HealthResponse(
    [property: JsonPropertyName("overallStatus")] string OverallStatus,
    [property: JsonPropertyName("healthyCount")] int HealthyCount,
    [property: JsonPropertyName("totalServices")] int TotalServices,
    [property: JsonPropertyName("averageLatencyMs")] long AverageLatencyMs,
    [property: JsonPropertyName("errorRate24h")] double ErrorRate24h,
    [property: JsonPropertyName("lastDeploymentTimestamp")] string LastDeploymentTimestamp,
    [property: JsonPropertyName("services")] List<ServiceHealthItem> Services
);
