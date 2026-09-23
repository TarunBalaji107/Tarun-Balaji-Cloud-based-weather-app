using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using WeatherDashboardAPI.Models;
using WeatherDashboardAPI.Services;

namespace WeatherDashboardAPI.Functions;

public class FavoriteCitiesFunction
{
    private readonly CosmosDbService _cosmosDbService;
    private readonly ILogger<FavoriteCitiesFunction> _logger;

    public FavoriteCitiesFunction(CosmosDbService cosmosDbService, ILogger<FavoriteCitiesFunction> logger)
    {
        _cosmosDbService = cosmosDbService;
        _logger = logger;
    }

    [Function("GetFavoriteCities")]
    public async Task<IActionResult> GetFavorites(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "favorites")] HttpRequest req)
    {
        _logger.LogInformation("Retrieving all monitored favorite cities from Cosmos DB");
        var items = await _cosmosDbService.GetFavoriteCitiesAsync();
        return new OkObjectResult(items);
    }

    [Function("AddFavoriteCity")]
    public async Task<IActionResult> AddFavorite(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "favorites")] HttpRequest req)
    {
        using var reader = new StreamReader(req.Body);
        string body = await reader.ReadToEndAsync();
        var city = JsonSerializer.Deserialize<FavoriteCity>(body);

        if (city == null || string.IsNullOrWhiteSpace(city.Name))
        {
            return new BadRequestObjectResult(new { error = "City name is required" });
        }

        _logger.LogInformation("Registering new favorite city in Cosmos DB: {Name}", city.Name);
        var created = await _cosmosDbService.AddFavoriteCityAsync(city);
        return new CreatedResult($"/api/favorites/{created.Id}", created);
    }

    [Function("DeleteFavoriteCity")]
    public async Task<IActionResult> DeleteFavorite(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "favorites/{id}")] HttpRequest req,
        string id)
    {
        string? country = req.Query["country"] ?? "US";
        _logger.LogInformation("Deleting favorite city {Id} from Cosmos DB", id);
        await _cosmosDbService.DeleteFavoriteCityAsync(id, country.ToUpperInvariant());
        return new NoContentResult();
    }
}
