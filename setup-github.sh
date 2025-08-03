#!/bin/bash
# GitHub Repository Setup Script
# Run this after installing Git and creating the GitHub repository

echo "🚀 Setting up IPU Planner GitHub Repository..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first:"
    echo "   Download from: https://git-scm.com/download/win"
    exit 1
fi

# Navigate to project directory
cd "c:\Users\vivsoni\OneDrive - Microsoft\Desktop\code files\IPU Planner"

echo "📂 Current directory: $(pwd)"

# Initialize git repository
echo "🔧 Initializing Git repository..."
git init

# Add all files
echo "📄 Adding files to Git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: IPU Program Planner with bulk milestone feature

Features:
- React TypeScript application for program planning
- Bulk milestone addition functionality
- 7-phase development process tracking
- Multi-platform product management
- Timeline visualization with week-based grid
- Status tracking (not-started, in-progress, blocked, completed)
- Issue management for blocking items
- Secure deployment configurations
- Comprehensive documentation"

# Prompt for GitHub username
echo "Please enter your GitHub username:"
read -r username

if [ -z "$username" ]; then
    echo "❌ GitHub username is required"
    exit 1
fi

# Add remote origin
echo "🔗 Adding GitHub remote..."
git remote add origin "https://github.com/$username/ipu-planner.git"

# Set main branch
echo "🌿 Setting main branch..."
git branch -M main

# Push to GitHub
echo "⬆️ Pushing to GitHub..."
echo "You may be prompted for your GitHub credentials..."
git push -u origin main

echo "✅ Repository setup complete!"
echo ""
echo "🌐 Your repository is now available at:"
echo "   https://github.com/$username/ipu-planner"
echo ""
echo "📚 Next steps:"
echo "1. Enable GitHub Pages in repository settings"
echo "2. Your app will be available at: https://$username.github.io/ipu-planner"
echo "3. Invite team members as collaborators"
echo "4. Set up branch protection rules"
echo ""
echo "🔒 Security reminder: Keep repository PRIVATE (contains Microsoft confidential data)"
