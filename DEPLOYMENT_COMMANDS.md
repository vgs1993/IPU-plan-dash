# Quick Command Reference for All Deployment Options

## Build Commands
```powershell
# Standard build
npm run build

# Build with environment check
npm run build -- --mode production

# Verify build contents
Get-ChildItem -Recurse dist/
```

## SharePoint (Fastest - 5 min)
```powershell
# After npm run build
# 1. Create private SharePoint site
# 2. Upload dist/ contents to Documents/IPU-Planner-App/  
# 3. Share with peer
# Direct URL: [SITE]/Documents/IPU-Planner-App/index.html
```

## Azure Static Web Apps (Most Professional - 15 min)
```bash
# Install Azure CLI
# az login
# az staticwebapp create --name "ipu-planner" --resource-group "rg-ipu" --source dist/ --location "West US 2" --sku "Free"
```

## Teams App (Best Collaboration - 20 min)
```powershell
# 1. Create Teams app manifest
# 2. Package dist/ as .zip
# 3. Upload to Teams App Studio
# 4. Deploy to specific team
```

## OneDrive Business (Simplest - 2 min)
```powershell
# After npm run build
# 1. Compress-Archive -Path dist/* -DestinationPath "IPU-Planner.zip"
# 2. Upload to OneDrive Business
# 3. Share zip file with peer + instructions
```

## GitHub Enterprise (Developer-Friendly - 15 min)
```bash
# git add dist/
# git commit -m "Production build for internal review"
# git push origin main
# Enable GitHub Pages in repo settings
```

## Azure DevOps (Enterprise - 25 min)
```yaml
# azure-pipelines.yml
trigger:
- main
pool:
  vmImage: 'ubuntu-latest'
steps:
- task: Npm@1
  inputs:
    command: 'ci'
- task: Npm@1
  inputs:
    command: 'run'
    arguments: 'build'
- task: PublishBuildArtifacts@1
  inputs:
    pathToPublish: 'dist'
    artifactName: 'ipu-planner'
```

## Security Commands
```powershell
# Remove debug traces before build
Get-ChildItem -Recurse src/ -Include "*.ts","*.tsx" | Select-String "console\.|debugger|alert\("

# Check for sensitive data
Get-ChildItem -Recurse dist/ -Include "*.js","*.html" | Select-String "password|key|secret"

# Verify build integrity  
Get-FileHash dist/index.html
```
