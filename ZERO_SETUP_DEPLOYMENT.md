# Zero-Setup Deployment Options - Click to Open

## 🎯 Best Options for "Just Click and Use"

### 1. **SharePoint Online (Recommended)**
**User Experience**: Click link → Opens immediately in browser
**Setup Time**: 5 minutes for you, 0 seconds for peer

**Steps for You**:
1. Build: `npm run build` 
2. Go to SharePoint → Create private site
3. Upload `dist/index.html` and `dist/assets/` folder
4. Share direct link: `https://[yoursite].sharepoint.com/sites/[sitename]/Shared%20Documents/index.html`

**For Your Peer**: 
- Click the link you send
- Signs in automatically with Microsoft account
- App opens instantly in browser
- Zero installation or setup required

---

### 2. **Azure Static Web Apps**
**User Experience**: Click URL → Opens like any website
**Setup Time**: 15 minutes for you, 0 seconds for peer

**Steps for You**:
1. Build: `npm run build`
2. Azure Portal → Create Static Web App
3. Upload `dist` folder
4. Get URL: `https://[appname].azurestaticapps.net`

**For Your Peer**:
- Click the URL you provide
- Opens instantly in any browser
- No authentication needed (if you choose public)
- Works on any device

---

### 3. **OneDrive Business + HTML File**
**User Experience**: Click file → Opens in browser
**Setup Time**: 2 minutes for you, 0 seconds for peer

**Steps for You**:
1. Build: `npm run build`
2. Upload `index.html` and `assets` folder to OneDrive Business
3. Right-click `index.html` → Share → Copy link
4. Send the share link

**For Your Peer**:
- Click the OneDrive link
- File opens directly in browser
- No download required
- Automatic Microsoft authentication

---

### 4. **Netlify Drop (Public)**
**User Experience**: Click URL → Opens immediately
**Setup Time**: 2 minutes for you, 0 seconds for peer
**⚠️ Note**: Not recommended for confidential data

**Steps for You**:
1. Build: `npm run build`
2. Go to [netlify.com/drop](https://app.netlify.com/drop)
3. Drag `dist` folder to browser
4. Get instant URL: `https://[random-name].netlify.app`

---

## 🚀 Fastest Option: SharePoint Direct Link

**Complete Setup in 5 Minutes**:

1. **Build your app**:
   ```powershell
   npm run build
   ```

2. **Create SharePoint site**:
   - Go to SharePoint → "Create site" → "Team site"
   - Name it "IPU Planner Test"
   - Make it Private

3. **Upload files**:
   - Go to Documents library
   - Upload ALL contents from `dist/` folder
   - Make sure `index.html` and `assets/` folder are uploaded

4. **Get direct link**:
   - Right-click `index.html` → "Copy link"
   - Share this link with your peer

5. **Send to peer**:
   ```
   IPU Planner Test Link: [SHAREPOINT_LINK]
   
   Just click the link above - it will open the app directly in your browser.
   No setup, installation, or technical knowledge required.
   
   Sign in with your @microsoft.com account if prompted.
   
   See attached testing guide for what to focus on.
   ```

## ✅ What Your Peer Experiences:
1. **Clicks your link**
2. **Browser opens** with the IPU Planner running
3. **Starts testing immediately** - no delays, no setup
4. **Can bookmark** the link for future access
5. **Data persists** between sessions (saved in browser)

## 📱 Works On:
- Any computer with internet
- Any modern browser (Chrome, Edge, Firefox, Safari)
- Mobile devices (though desktop recommended)
- No software installation required

**This is exactly what you want - your peer just clicks and starts using the app immediately!**
