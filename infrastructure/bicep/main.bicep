targetScope = 'resourceGroup'

@description('Deployment environment name')
@allowed([
  'dev'
  'qa'
  'prod'
])
param environment string = 'prod'

@description('Primary Azure deployment region')
param location string = resourceGroup().location

@description('Unique platform suffix for globally unique DNS names')
param appSuffix string = uniqueString(resourceGroup().id)

var baseName = 'weather-intel-${environment}-${appSuffix}'

// 1. Application Insights & Log Analytics Workspace
module appInsights 'applicationinsights.bicep' = {
  name: 'appInsightsDeploy'
  params: {
    baseName: baseName
    location: location
  }
}

// 2. Azure Cosmos DB Multi-Region Account
module cosmosDb 'cosmosdb.bicep' = {
  name: 'cosmosDbDeploy'
  params: {
    baseName: baseName
    location: location
    environment: environment
  }
}

// 3. Azure Function App (Serverless Isolated Worker)
module functionApp 'functionapp.bicep' = {
  name: 'functionAppDeploy'
  params: {
    baseName: baseName
    location: location
    appInsightsConnectionString: appInsights.outputs.connectionString
    cosmosDbConnectionString: cosmosDb.outputs.connectionString
    environment: environment
  }
}

// 4. Azure Static Web App (Frontend Hosting)
module staticWebApp 'staticwebapp.bicep' = {
  name: 'staticWebAppDeploy'
  params: {
    baseName: baseName
    location: 'eastus2'
  }
}

output functionAppUrl string = functionApp.outputs.url
output staticWebAppUrl string = staticWebApp.outputs.url
output cosmosDbEndpoint string = cosmosDb.outputs.endpoint
