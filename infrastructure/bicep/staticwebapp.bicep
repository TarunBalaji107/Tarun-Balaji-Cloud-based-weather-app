param baseName string
param location string = 'eastus2'

var staticWebAppName = 'swa-${baseName}'

resource staticWebApp 'Microsoft.Web/staticSites@2023-01-01' = {
  name: staticWebAppName
  location: location
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    allowConfigFileUpdates: true
    stagingEnvironmentPolicy: 'Enabled'
  }
}

output url string = 'https://${staticWebApp.properties.defaultHostname}'
