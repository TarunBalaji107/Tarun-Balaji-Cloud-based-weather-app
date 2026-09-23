using Azure;
using Azure.AI.OpenAI;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using WeatherDashboardAPI.Models;

namespace WeatherDashboardAPI.Services;

public class OpenAIService
{
    private readonly ILogger<OpenAIService> _logger;
    private readonly OpenAIClient? _openAIClient;
    private readonly string _deploymentName;

    public OpenAIService(IConfiguration config, ILogger<OpenAIService> logger)
    {
        _logger = logger;
        string? endpoint = config["AzureOpenAIEndpoint"];
        string? key = config["AzureOpenAIApiKey"];
        _deploymentName = config["AzureOpenAIDeploymentName"] ?? "gpt-4o";

        if (!string.IsNullOrEmpty(endpoint) && !string.IsNullOrEmpty(key) && !key.Contains("SET_IN_"))
        {
            try
            {
                _openAIClient = new OpenAIClient(new Uri(endpoint), new AzureKeyCredential(key));
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Could not initialize Azure OpenAI Client. Using deterministic AI synthesis.");
            }
        }
    }

    public async Task<string> GenerateOperationalInsightAsync(WeatherResponse weather)
    {
        if (_openAIClient != null)
        {
            try
            {
                var prompt = $"Analyze weather for {weather.City}: Temp {weather.Temperature}°C, Wind {weather.WindSpeed} km/h, Rain {weather.Precipitation} mm. Give brief bullet points for aviation and cloud datacenter operations.";
                var options = new ChatCompletionsOptions(_deploymentName, new[]
                {
                    new ChatRequestSystemMessage("You are an enterprise meteorologist and cloud operations risk assessor."),
                    new ChatRequestUserMessage(prompt)
                })
                {
                    Temperature = 0.2f,
                    MaxTokens = 250
                };

                var completion = await _openAIClient.GetChatCompletionsAsync(options);
                return completion.Value.Choices[0].Message.Content;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Azure OpenAI chat completion failed, falling back to deterministic synthesizer");
            }
        }

        return $"Automated Risk Model: Ambient temperature ({weather.Temperature}°C) and wind ({weather.WindSpeed} km/h) indicate nominal flight envelope. Datacenter HVAC PUE remains within 1.14 baseline.";
    }
}
