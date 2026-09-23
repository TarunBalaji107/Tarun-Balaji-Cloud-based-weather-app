param baseName string
param location string
param appInsightsConnectionString string
param cosmosDbConnectionString string
param environment string

var storageAccountName = 'st${replace(baseName, '-', '')}'
var hostingPlanName = 'asp-${baseName}'
var functionAppName = 'func-${baseName}'

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: take(storageAccountName, 24)
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
}

resource hostingPlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: hostingPlanName
  location: location
  sku: {
    name: 'Y1'
    tier: 'Dynamic'
  }
  properties: {}
}

resource functionApp 'Microsoft.Web/sites@2023-01-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp'
  properties: {
    serverFarmId: hostingPlan.id
    siteConfig: {
      netFrameworkVersion: 'v8.0'
      appSettings: [
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'dotnet-isolated'
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: appInsightsConnectionString
        }
        {
          name: 'CosmosDbConnectionString'
          value: cosmosDbConnectionString
        }
        {
          name: 'CosmosDbDatabaseName'
          value: 'WeatherIntelligenceDB'
        }
        {
          name: 'CosmosDbContainerName'
          value: 'FavoriteCities'
        }
      ]
      cors: {
        allowedOrigins: [
          '*'
        ]
      }
    }
  }
}

output url string = 'https://${functionApp.properties.defaultHostName}'
