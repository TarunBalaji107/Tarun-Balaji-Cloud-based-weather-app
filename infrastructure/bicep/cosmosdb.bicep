param baseName string
param location string
param environment string

var accountName = 'cdb-${baseName}'
var databaseName = 'WeatherIntelligenceDB'
var containerName = 'FavoriteCities'

resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2023-11-15' = {
  name: accountName
  location: location
  kind: 'GlobalDocumentDB'
  properties: {
    databaseAccountOfferType: 'Standard'
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: environment == 'prod'
      }
      {
        locationName: 'westus2'
        failoverPriority: 1
        isZoneRedundant: false
      }
    ]
    enableMultipleWriteLocations: false
    enableAutomaticFailover: true
  }
}

resource database 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2023-11-15' = {
  parent: cosmosAccount
  name: databaseName
  properties: {
    resource: {
      id: databaseName
    }
  }
}

resource container 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/sqlContainers@2023-11-15' = {
  parent: database
  name: containerName
  properties: {
    resource: {
      id: containerName
      partitionKey: {
        paths: [
          '/partitionKey'
        ]
        kind: 'Hash'
      }
      indexingPolicy: {
        indexingMode: 'consistent'
        includedPaths: [
          {
            path: '/*'
          }
        ]
      }
    }
    options: {
      autoscaleSettings: {
        maxThroughput: environment == 'prod' ? 4000 : 1000
      }
    }
  }
}

output endpoint string = cosmosAccount.properties.documentEndpoint
output connectionString string = cosmosAccount.listConnectionStrings().connectionStrings[0].connectionString
