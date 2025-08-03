# IPU Planner - Secure Internal Deployment Guide

## ⚠️ CONFIDENTIAL - Internal Microsoft Use Only

This application contains restricted product codenames and must be deployed securely within Microsoft infrastructure.

## 🔒 Recommended: Azure Static Web Apps (Private)

### Security Features:
- **Microsoft AAD Authentication** - Only @microsoft.com emails
- **Private networking** - No public internet access
- **Data residency** - Stays within Microsoft cloud
- **Audit logging** - Track who accessed when

### Deployment Steps:
1. `npm run build`
2. Azure Portal → Static Web Apps
3. **Enable Private Access**
4. **Restrict to Microsoft tenant only**
5. Configure AAD authentication
6. Share URL with peer (requires Microsoft login)

## 🏢 Alternative: Internal SharePoint (Recommended)

### Setup:
1. Create private SharePoint site
2. Upload built files to document library
3. Set permissions to specific users only
4. Enable version control for feedback tracking

### Benefits:
- **Zero external exposure**
- **Built-in Microsoft security**
- **Automatic backup/versioning**
- **Easy permission management**

## 🚫 NOT Recommended for Confidential Code:
- ❌ GitHub Pages (public)
- ❌ Netlify (external)
- ❌ Vercel (external)
- ❌ Any public hosting

## 📋 Pre-Deployment Security Checklist:
- [ ] Remove any hardcoded sensitive data
- [ ] Ensure no API keys in client code
- [ ] Verify all product names are intentionally included
- [ ] Test with Microsoft AAD authentication
- [ ] Document access permissions needed

## 🔐 Access Instructions for Your Peer:
1. Navigate to secure URL (will be provided)
2. Sign in with Microsoft credentials (@microsoft.com)
3. Verify access to IPU Planner interface
4. Test all features as documented in TESTING_GUIDE.md

⚠️ **Important**: This deployment method ensures compliance with Microsoft's data handling policies for confidential product information.
