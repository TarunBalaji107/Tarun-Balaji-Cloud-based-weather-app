# Cloud Deployment & Infrastructure as Code Guide

## Prerequisites
- Azure CLI v2.55+
- .NET SDK 8.0
- Node.js 20.x
- Bicep CLI

## Automated Deployment (Bicep)
```bash
# Deploy dev environment
./infrastructure/scripts/deploy.sh dev eastus2

# Deploy production environment
./infrastructure/scripts/deploy.sh prod eastus2
```

## Azure DevOps CI/CD Pipeline
The `pipelines/azure-pipelines.yml` file defines 4 stages:
1. **Build & Lint**: Compiles React frontend and .NET 8 backend.
2. **Deploy -> Dev**: Runs smoke tests with a 90% quality gate.
3. **Deploy -> QA**: Runs integration tests with a 95% quality gate.
4. **Deploy -> Prod**: Executes blue/green slot swap with a 98% quality gate.
