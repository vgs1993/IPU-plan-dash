# SharePoint Deployment - Step-by-Step Guide

## 🚀 Fastest Secure Option (5 Minutes)

### Prerequisites:
- Access to SharePoint Online
- Built IPU Planner files
- Microsoft account with appropriate permissions

### Step 1: Build the Project
```powershell
npm run build
```
This creates a `dist` folder with production-ready files.

### Step 2: Create Private SharePoint Site
1. Go to [SharePoint Admin Center](https://admin.microsoft.com/sharepoint)
2. Click "Create Site" → "Team Site"
3. Name: "IPU Planner Prototype" 
4. Privacy: **Private** (Critical for confidential data)
5. Add your peer as member

### Step 3: Upload Files
1. Open your new SharePoint site
2. Go to "Documents" library
3. Create new folder: "IPU-Planner-App"
4. Upload ALL contents from `dist` folder:
   - `index.html`
   - `assets/` folder (CSS, JS files)
   - Any other generated files

### Step 4: Enable Static Hosting
1. In SharePoint site → Site Settings
2. Look and Feel → Master Page
3. Enable "Custom Scripts" if needed
4. Or simply access via direct file URL

### Step 5: Share with Peer
1. Click "Share" on the site
2. Add your peer's @microsoft.com email
3. Set permissions to "Can view" or "Can edit"
4. Include testing guide in share message

### Step 6: Access Instructions
Send your peer:
```
SharePoint Site: [SITE_URL]
App Location: /Documents/IPU-Planner-App/index.html
Direct Link: [SITE_URL]/Documents/IPU-Planner-App/index.html

Testing Guide: See TESTING_GUIDE.md for feature walkthrough
```

### Security Benefits:
✅ Automatic Microsoft authentication
✅ Audit trail of all access
✅ Version control for updates
✅ Zero external exposure
✅ Compliance with Microsoft data policies

### Troubleshooting:
- If HTML files don't render: Check custom script permissions
- If access denied: Verify peer is added to site members
- If files missing: Ensure all `dist` contents uploaded
