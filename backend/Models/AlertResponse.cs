using System.Text.Json.Serialization;

namespace WeatherDashboardAPI.Models;

public record AlertMetricsDto(
    [property: JsonPropertyName("expectedWindGustsKmh")] double? ExpectedWindGustsKmh,
    [property: JsonPropertyName("expectedRainfallMm")] double? ExpectedRainfallMm,
    [property: JsonPropertyName("expectedTempExtremeC")] double? ExpectedTempExtremeC
);

public record WeatherAlertDto(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("headline")] string Headline,
    [property: JsonPropertyName("event")] string Event,
    [property: JsonPropertyName("severity")] string Severity,
    [property: JsonPropertyName("urgency")] string Urgency,
    [property: JsonPropertyName("areaDesc")] string AreaDesc,
    [property: JsonPropertyName("instruction")] string Instruction,
    [property: JsonPropertyName("effective")] string Effective,
    [property: JsonPropertyName("expires")] string Expires,
    [property: JsonPropertyName("source")] string Source,
    [property: JsonPropertyName("metrics")] AlertMetricsDto? Metrics
);

public record AlertRuleDto(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("metric")] string Metric,
    [property: JsonPropertyName("condition")] string Condition,
    [property: JsonPropertyName("value")] double Value,
    [property: JsonPropertyName("unit")] string Unit,
    [property: JsonPropertyName("enabled")] bool Enabled,
    [property: JsonPropertyName("notifyTarget")] string NotifyTarget
);
