using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using WeatherDashboardAPI.Models;

namespace WeatherDashboardAPI.Services;

public class CosmosDbService
{
    private readonly ILogger<CosmosDbService> _logger;
    private readonly Container? _container;
    private readonly List<FavoriteCity> _inMemoryFallback = new();

    public CosmosDbService(IConfiguration config, ILogger<CosmosDbService> logger)
    {
        _logger = logger;
        string? connectionString = config["CosmosDbConnectionString"];
        string? dbName = config["CosmosDbDatabaseName"] ?? "WeatherIntelligenceDB";
        string? containerName = config["CosmosDbContainerName"] ?? "FavoriteCities";

        if (!string.IsNullOrEmpty(connectionString) && !connectionString.Contains("SET_IN_"))
        {
            try
            {
                var client = new CosmosClient(connectionString, new CosmosClientOptions
                {
                    ApplicationName = "WeatherDashboardAPI",
                    ConnectionMode = ConnectionMode.Direct
                });
                _container = client.GetContainer(dbName, containerName);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Could not initialize real CosmosClient. Falling back to in-memory store.");
            }
        }
        else
        {
            SeedInitialCities();
        }
    }

    private void SeedInitialCities()
    {
        _inMemoryFallback.Add(new FavoriteCity
        {
            Id = "fav-nyc",
            Name = "New York",
            Country = "United States",
            Latitude = 40.7128,
            Longitude = -74.006,
            Temp = 21,
            Condition = "Partly cloudy",
            WeatherCode = 2
        });
        _inMemoryFallback.Add(new FavoriteCity
        {
            Id = "fav-lon",
            Name = "London",
            Country = "United Kingdom",
            Latitude = 51.5074,
            Longitude = -0.1278,
            Temp = 16,
            Condition = "Light drizzle",
            WeatherCode = 51
        });
    }

    public async Task<IEnumerable<FavoriteCity>> GetFavoriteCitiesAsync()
    {
        if (_container == null)
        {
            return _inMemoryFallback;
        }

        try
        {
            var query = _container.GetItemQueryIterator<FavoriteCity>("SELECT * FROM c");
            var results = new List<FavoriteCity>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();
                results.AddRange(response);
            }
            return results;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed reading favorite cities from Cosmos DB");
            return _inMemoryFallback;
        }
    }

    public async Task<FavoriteCity> AddFavoriteCityAsync(FavoriteCity city)
    {
        if (_container == null)
        {
            _inMemoryFallback.Add(city);
            return city;
        }

        var response = await _container.CreateItemAsync(city, new PartitionKey(city.PartitionKey));
        return response.Resource;
    }

    public async Task DeleteFavoriteCityAsync(string id, string partitionKey)
    {
        if (_container == null)
        {
            _inMemoryFallback.RemoveAll(c => c.Id == id);
            return;
        }

        await _container.DeleteItemAsync<FavoriteCity>(id, new PartitionKey(partitionKey));
    }
}
