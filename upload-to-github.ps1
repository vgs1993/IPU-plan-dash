# IPU Planner - GitHub Upload Guide
# Run these commands one by one after installing Git

Write-Host "🚀 IPU Planner GitHub Upload Process" -ForegroundColor Green
Write-Host "Make sure you've created the repository on GitHub first!" -ForegroundColor Yellow
Write-Host ""

# Step 1: Navigate to project directory
Write-Host "Step 1: Navigating to project directory..." -ForegroundColor Cyan
$projectPath = "c:\Users\vivsoni\OneDrive - Microsoft\Desktop\code files\IPU Planner"
Set-Location $projectPath
Write-Host "✅ Current location: $((Get-Location).Path)" -ForegroundColor Green

# Step 2: Initialize Git repository
Write-Host "`nStep 2: Initializing Git repository..." -ForegroundColor Cyan
git init
Write-Host "✅ Git repository initialized" -ForegroundColor Green

# Step 3: Add all files to staging
Write-Host "`nStep 3: Adding all files to Git..." -ForegroundColor Cyan
git add .
Write-Host "✅ All files added to staging area" -ForegroundColor Green

# Step 4: Create initial commit
Write-Host "`nStep 4: Creating initial commit..." -ForegroundColor Cyan
$commitMessage = "Initial commit: IPU Program Planner

✨ Features:
- React TypeScript application for program planning
- Bulk milestone addition functionality
- 7-phase development process tracking
- Multi-platform product management
- Timeline visualization with week-based grid
- Status tracking (not-started, in-progress, blocked, completed)
- Issue management for blocking items
- Secure deployment configurations
- Comprehensive documentation

🔧 Technical Stack:
- React 18 + TypeScript
- Vite build system
- CSS Grid layout
- GitHub Actions CI/CD
- Multiple deployment options"

git commit -m $commitMessage
Write-Host "✅ Initial commit created" -ForegroundColor Green

# Step 5: Get GitHub repository URL
Write-Host "`nStep 5: Connect to your GitHub repository" -ForegroundColor Cyan
Write-Host "Please enter your GitHub username:" -ForegroundColor Yellow
$username = Read-Host
Write-Host "Please enter your repository name (default: ipu-planner):" -ForegroundColor Yellow
$repoName = Read-Host
if ([string]::IsNullOrWhiteSpace($repoName)) {
    $repoName = "ipu-planner"
}

$repoUrl = "https://github.com/$username/$repoName.git"
Write-Host "Repository URL: $repoUrl" -ForegroundColor Blue

# Step 6: Add remote origin
Write-Host "`nStep 6: Adding GitHub remote..." -ForegroundColor Cyan
git remote add origin $repoUrl
Write-Host "✅ Remote origin added" -ForegroundColor Green

# Step 7: Set main branch
Write-Host "`nStep 7: Setting up main branch..." -ForegroundColor Cyan
git branch -M main
Write-Host "✅ Main branch configured" -ForegroundColor Green

# Step 8: Push to GitHub
Write-Host "`nStep 8: Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "⚠️  You may be prompted for GitHub credentials" -ForegroundColor Yellow
git push -u origin main

Write-Host "`n🎉 SUCCESS! Your IPU Planner is now on GitHub!" -ForegroundColor Green
Write-Host "📍 Repository: https://github.com/$username/$repoName" -ForegroundColor Blue
Write-Host ""
Write-Host "🌐 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Enable GitHub Pages in your repository settings" -ForegroundColor White
Write-Host "2. Your app will be available at: https://$username.github.io/$repoName" -ForegroundColor White
Write-Host "3. GitHub Actions will automatically build and deploy your app" -ForegroundColor White
Write-Host ""
Write-Host "🔒 Security: Keep your repository PRIVATE (contains Microsoft confidential data)" -ForegroundColor Red
