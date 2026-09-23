#!/usr/bin/env bash
set -euo pipefail

ENV="${1:-dev}"
LOCATION="${2:-eastus2}"
RESOURCE_GROUP="rg-weather-intelligence-${ENV}"

echo "=========================================================="
echo " Deploying Cloud Weather Intelligence Platform: ${ENV}"
echo " Resource Group: ${RESOURCE_GROUP} (${LOCATION})"
echo "=========================================================="

# 1. Ensure Resource Group exists
az group create --name "${RESOURCE_GROUP}" --location "${LOCATION}" --output table

# 2. Deploy Bicep Stack
az deployment group create \
  --resource-group "${RESOURCE_GROUP}" \
  --template-file "./infrastructure/bicep/main.bicep" \
  --parameters environment="${ENV}" location="${LOCATION}" \
  --output table

echo "Deployment completed successfully for environment: ${ENV}"
