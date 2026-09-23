using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using WeatherDashboardAPI.Services;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureServices(services =>
    {
        services.AddApplicationInsightsTelemetryWorkerService();
        services.ConfigureFunctionsApplicationInsights();

        services.AddHttpClient();
        services.AddSingleton<WeatherService>();
        services.AddSingleton<CosmosDbService>();
        services.AddSingleton<OpenAIService>();
        services.AddSingleton<HealthService>();
    })
    .Build();

host.Run();
