param(
    [string]$Environment = "dev",
    [string]$Location = "eastus2"
)

$ErrorActionPreference = "Stop"
$ResourceGroupName = "rg-weather-intelligence-$Environment"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Deploying Cloud Weather Intelligence Platform: $Environment" -ForegroundColor Cyan
Write-Host " Resource Group: $ResourceGroupName ($Location)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

az group create --name $ResourceGroupName --location $Location --output table

az deployment group create `
    --resource-group $ResourceGroupName `
    --template-file "./infrastructure/bicep/main.bicep" `
    --parameters environment=$Environment location=$Location `
    --output table

Write-Host "Deployment completed successfully for $Environment." -ForegroundColor Green
