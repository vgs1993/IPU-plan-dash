# Manual Git Commands for IPU Planner Upload

## Prerequisites
✅ Git installed from https://git-scm.com/download/win
✅ GitHub repository created (should be PRIVATE)
✅ VS Code restarted after Git installation

## Commands to Run (Copy-paste one by one)

### 1. Navigate to project directory
```powershell
cd "c:\Users\vivsoni\OneDrive - Microsoft\Desktop\code files\IPU Planner"
```

### 2. Configure Git (if not done before)
```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@microsoft.com"
```

### 3. Initialize Git repository
```powershell
git init
```

### 4. Add all files
```powershell
git add .
```

### 5. Create initial commit
```powershell
git commit -m "Initial commit: IPU Program Planner with bulk milestone feature"
```

### 6. Add your GitHub repository (replace USERNAME and REPO_NAME)
```powershell
git remote add origin https://github.com/USERNAME/REPO_NAME.git
```

### 7. Set main branch
```powershell
git branch -M main
```

### 8. Push to GitHub
```powershell
git push -u origin main
```

## Example with actual values:
If your GitHub username is "john-doe" and repository is "ipu-planner":
```powershell
git remote add origin https://github.com/john-doe/ipu-planner.git
```

## Troubleshooting

### If you get authentication errors:
1. Use GitHub Personal Access Token instead of password
2. Go to GitHub Settings → Developer settings → Personal access tokens
3. Generate new token with 'repo' permissions
4. Use token as password when prompted

### If git commands don't work:
1. Restart VS Code after installing Git
2. Open new terminal in VS Code
3. Try: `git --version` to verify installation

### If repository already exists:
```powershell
git remote remove origin
git remote add origin https://github.com/USERNAME/REPO_NAME.git
```

## After successful upload:
1. Go to your GitHub repository
2. Settings → Pages → Source: GitHub Actions
3. Your app will be automatically deployed to: `https://USERNAME.github.io/REPO_NAME`
