using System.Net;
using System.Net.Http.Json;
using Xunit;
using WeatherDashboardAPI.Models;

namespace WeatherDashboardAPI.Tests.Integration;

public class WeatherApiTests
{
    private readonly HttpClient _client;

    public WeatherApiTests()
    {
        _client = new HttpClient
        {
            BaseAddress = new Uri(Environment.GetEnvironmentVariable("BASE_API_URL") ?? "http://localhost:7071")
        };
    }

    [Fact]
    public async Task GetCurrentWeather_ReturnsValidCoordinatesAndTemperature()
    {
        var response = await _client.GetAsync("/api/weather/current?city=Zurich&lat=47.3769&lon=8.5417");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var data = await response.Content.ReadFromJsonAsync<WeatherResponse>();
        Assert.NotNull(data);
        Assert.Equal("Zurich", data.City);
        Assert.True(data.Temperature > -50 && data.Temperature < 60);
    }

    [Fact]
    public async Task GetHealth_ReturnsHealthyStatus()
    {
        var response = await _client.GetAsync("/api/health");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var health = await response.Content.ReadFromJsonAsync<HealthResponse>();
        Assert.NotNull(health);
        Assert.Equal("Healthy", health.OverallStatus);
    }
}
