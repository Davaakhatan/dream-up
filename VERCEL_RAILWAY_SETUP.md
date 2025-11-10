# Connect Vercel Frontend to Railway Backend

## Current Status ✅

- ✅ **Frontend**: Deployed on Vercel at `qa-dream-up.vercel.app`
- ⚠️ **Backend**: Not deployed yet (that's why you see "View-Only Mode")

## Step 1: Deploy Backend to Railway (5 minutes)

### 1. Go to Railway
Visit: https://railway.app

### 2. Sign Up / Login
- Click "Start a New Project"
- Sign up with GitHub (same account as your repo)

### 3. Create New Project
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose: `Davaakhatan/dream-up` (or `Davaakhatan/DreamUp`)

### 4. Railway Auto-Deploys
Railway will:
- Auto-detect Node.js
- Run `npm install`
- Run `npm run build`
- Run `npm start` (which runs `node dist/dashboard/prod.js`)

### 5. Add Environment Variables
In Railway dashboard, go to your project → **Variables** tab, add:

```
OPENAI_API_KEY=your-openai-key-here
BROWSERBASE_API_KEY=your-browserbase-key-here (optional)
USE_LOCAL_BROWSER=true
FIREBASE_PROJECT_ID=qapipeline-7c83d
PORT=3000
```

**Important**: Railway sets `PORT` automatically, but we include it just in case.

### 6. Get Your Railway URL
After deployment, Railway gives you a URL like:
- `https://your-app.up.railway.app`
- Or `https://qa-api-production.up.railway.app`

**Copy this URL** - you'll need it in the next step!

## Step 2: Connect Vercel Frontend to Railway Backend

### Option A: Via Browser Console (Quick)

1. **Go to your Vercel app**: `https://qa-dream-up.vercel.app`
2. **Open browser console** (F12 or Right-click → Inspect → Console)
3. **Run this command** (replace with your Railway URL):
   ```javascript
   localStorage.setItem('API_BASE', 'https://your-app.up.railway.app');
   location.reload();
   ```
4. **The page will reload** and the orange banner should disappear!
5. **"Run Test" button should now be enabled** ✅

### Option B: Update Vercel Environment Variables (Permanent)

1. **Go to Vercel Dashboard**: https://vercel.com/daves-projects-4e6003cf/qa-dream-up
2. **Go to Settings** → **Environment Variables**
3. **Add**:
   - Name: `NEXT_PUBLIC_API_BASE` (or just update the dashboard code)
   
Actually, since the dashboard reads from `localStorage`, Option A is easier!

## Step 3: Test It!

1. **Go to**: `https://qa-dream-up.vercel.app`
2. **The orange banner should be gone** (if you set `API_BASE`)
3. **Enter a game URL**: `https://play2048.co/`
4. **Click "Run Test"**
5. **Watch the magic happen!** ✨

## Troubleshooting

### Still seeing "View-Only Mode"?

1. **Check Railway is running**:
   - Go to Railway dashboard
   - Check if deployment is "Active"
   - Check logs for errors

2. **Test Railway URL directly**:
   - Visit: `https://your-app.up.railway.app/api/reports`
   - Should return: `[]` (empty array) or JSON with reports

3. **Check browser console** (F12):
   - Look for errors
   - Check if `API_BASE` is set correctly

### Railway deployment fails?

1. **Check Railway logs**:
   - Go to Railway dashboard → Your project → Deployments → View logs

2. **Common issues**:
   - Missing environment variables
   - Build errors
   - Port configuration

3. **Fix**: Add missing env vars or check build logs

## Summary

✅ **Frontend**: Vercel (`qa-dream-up.vercel.app`)  
✅ **Backend**: Railway (`your-app.up.railway.app`)  
✅ **Connected**: Via `localStorage.setItem('API_BASE', ...)`

**You're all set!** 🎉

