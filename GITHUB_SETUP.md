# GitHub Repository Setup Guide

## Quick Setup (After Installing Git)

### 1. Install Git
Download and install Git from [git-scm.com](https://git-scm.com/download/win)

### 2. Initialize Repository
```bash
cd "c:\Users\vivsoni\OneDrive - Microsoft\Desktop\code files\IPU Planner"
git init
git add .
git commit -m "Initial commit: IPU Program Planner with bulk milestone feature"
```

### 3. Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Click "+" → "New repository"
3. Name: `ipu-planner`
4. Description: `IPU Program Planner - React TypeScript application for managing program planning`
5. **Set to Private** (contains Microsoft confidential product names)
6. **Do NOT** check "Add README" (we have one)

### 4. Connect to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/ipu-planner.git
git branch -M main
git push -u origin main
```

## Repository Features Already Configured

✅ **`.gitignore`** - Excludes node_modules, build files, IDE settings
✅ **GitHub Actions** - Automated build and deployment workflows  
✅ **TypeScript** - Strict configuration with error checking
✅ **Documentation** - Comprehensive README and deployment guides
✅ **Security** - Removed console.log statements and debug code

## Deployment Options Available

1. **GitHub Pages** - Free static hosting (already configured)
2. **SharePoint** - Microsoft internal deployment
3. **Azure Static Web Apps** - Enterprise hosting
4. **Vercel/Netlify** - Alternative static hosting

## Next Steps After Repository Creation

1. **Enable GitHub Pages**: 
   - Go to repository Settings → Pages
   - Source: GitHub Actions
   - Your app will be available at: `https://YOUR_USERNAME.github.io/ipu-planner`

2. **Invite Collaborators**:
   - Settings → Manage access → Invite collaborators
   - Add team members for code review

3. **Branch Protection**:
   - Settings → Branches → Add rule
   - Require pull request reviews for main branch

## Security Considerations

⚠️ **Important**: This repository contains Microsoft confidential product codenames.
- Keep repository **PRIVATE**
- Only invite Microsoft employees
- Consider using environment variables for sensitive product names
- Regular security reviews

## Commands Summary

```bash
# After installing Git:
git init
git add .
git commit -m "Initial commit: IPU Program Planner"
git remote add origin https://github.com/YOUR_USERNAME/ipu-planner.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.
