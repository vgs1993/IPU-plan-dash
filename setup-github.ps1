# GitHub Repository Setup Script for Windows PowerShell
# Run this after installing Git and creating the GitHub repository

Write-Host "🚀 Setting up IPU Planner GitHub Repository..." -ForegroundColor Green

# Check if git is installed
try {
    git --version | Out-Null
    Write-Host "✅ Git is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed. Please install Git first:" -ForegroundColor Red
    Write-Host "   Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Navigate to project directory
$projectPath = "c:\Users\vivsoni\OneDrive - Microsoft\Desktop\code files\IPU Planner"
Set-Location $projectPath

Write-Host "📂 Current directory: $((Get-Location).Path)" -ForegroundColor Cyan

# Initialize git repository
Write-Host "🔧 Initializing Git repository..." -ForegroundColor Yellow
git init

# Add all files
Write-Host "📄 Adding files to Git..." -ForegroundColor Yellow
git add .

# Create initial commit
Write-Host "💾 Creating initial commit..." -ForegroundColor Yellow
$commitMessage = @"
Initial commit: IPU Program Planner with bulk milestone feature

Features:
- React TypeScript application for program planning
- Bulk milestone addition functionality
- 7-phase development process tracking
- Multi-platform product management
- Timeline visualization with week-based grid
- Status tracking (not-started, in-progress, blocked, completed)
- Issue management for blocking items
- Secure deployment configurations
- Comprehensive documentation
"@

git commit -m $commitMessage

# Prompt for GitHub username
$username = Read-Host "Please enter your GitHub username"

if ([string]::IsNullOrWhiteSpace($username)) {
    Write-Host "❌ GitHub username is required" -ForegroundColor Red
    exit 1
}

# Add remote origin
Write-Host "🔗 Adding GitHub remote..." -ForegroundColor Yellow
git remote add origin "https://github.com/$username/ipu-planner.git"

# Set main branch
Write-Host "🌿 Setting main branch..." -ForegroundColor Yellow
git branch -M main

# Push to GitHub
Write-Host "⬆️ Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "You may be prompted for your GitHub credentials..." -ForegroundColor Cyan
git push -u origin main

Write-Host ""
Write-Host "✅ Repository setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Your repository is now available at:" -ForegroundColor Cyan
Write-Host "   https://github.com/$username/ipu-planner" -ForegroundColor Blue
Write-Host ""
Write-Host "📚 Next steps:" -ForegroundColor Yellow
Write-Host "1. Enable GitHub Pages in repository settings" -ForegroundColor White
Write-Host "2. Your app will be available at: https://$username.github.io/ipu-planner" -ForegroundColor White
Write-Host "3. Invite team members as collaborators" -ForegroundColor White
Write-Host "4. Set up branch protection rules" -ForegroundColor White
Write-Host ""
Write-Host "🔒 Security reminder: Keep repository PRIVATE (contains Microsoft confidential data)" -ForegroundColor Red
