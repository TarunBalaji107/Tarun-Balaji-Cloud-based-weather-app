using System.Text.Json.Serialization;

namespace WeatherDashboardAPI.Models;

public class OpenWeatherCurrentDto
{
    [JsonPropertyName("coord")]
    public CoordDto? Coord { get; set; }

    [JsonPropertyName("weather")]
    public List<WeatherConditionDto>? Weather { get; set; }

    [JsonPropertyName("main")]
    public MainMetricsDto? Main { get; set; }

    [JsonPropertyName("visibility")]
    public int? Visibility { get; set; }

    [JsonPropertyName("wind")]
    public WindMetricsDto? Wind { get; set; }

    [JsonPropertyName("clouds")]
    public CloudsDto? Clouds { get; set; }

    [JsonPropertyName("dt")]
    public long? Dt { get; set; }

    [JsonPropertyName("sys")]
    public SysDto? Sys { get; set; }

    [JsonPropertyName("name")]
    public string? Name { get; set; }
}

public class CoordDto
{
    [JsonPropertyName("lon")]
    public double Lon { get; set; }

    [JsonPropertyName("lat")]
    public double Lat { get; set; }
}

public class WeatherConditionDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("main")]
    public string? Main { get; set; }

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("icon")]
    public string? Icon { get; set; }
}

public class MainMetricsDto
{
    [JsonPropertyName("temp")]
    public double Temp { get; set; }

    [JsonPropertyName("feels_like")]
    public double FeelsLike { get; set; }

    [JsonPropertyName("temp_min")]
    public double TempMin { get; set; }

    [JsonPropertyName("temp_max")]
    public double TempMax { get; set; }

    [JsonPropertyName("pressure")]
    public double Pressure { get; set; }

    [JsonPropertyName("humidity")]
    public int Humidity { get; set; }
}

public class WindMetricsDto
{
    [JsonPropertyName("speed")]
    public double Speed { get; set; }

    [JsonPropertyName("deg")]
    public int Deg { get; set; }

    [JsonPropertyName("gust")]
    public double? Gust { get; set; }
}

public class CloudsDto
{
    [JsonPropertyName("all")]
    public int All { get; set; }
}

public class SysDto
{
    [JsonPropertyName("country")]
    public string? Country { get; set; }

    [JsonPropertyName("sunrise")]
    public long Sunrise { get; set; }

    [JsonPropertyName("sunset")]
    public long Sunset { get; set; }
}
