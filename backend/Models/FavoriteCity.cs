using System.Text.Json.Serialization;

namespace WeatherDashboardAPI.Models;

public class FavoriteCity
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("country")]
    public string Country { get; set; } = string.Empty;

    [JsonPropertyName("latitude")]
    public double Latitude { get; set; }

    [JsonPropertyName("longitude")]
    public double Longitude { get; set; }

    [JsonPropertyName("addedAt")]
    public string AddedAt { get; set; } = DateTime.UtcNow.ToString("o");

    [JsonPropertyName("temp")]
    public double? Temp { get; set; }

    [JsonPropertyName("condition")]
    public string? Condition { get; set; }

    [JsonPropertyName("weatherCode")]
    public int? WeatherCode { get; set; }

    [JsonPropertyName("tempTrend")]
    public string TempTrend { get; set; } = "stable";

    // Cosmos DB partition key
    [JsonPropertyName("partitionKey")]
    public string PartitionKey => Country.ToUpperInvariant();
}
