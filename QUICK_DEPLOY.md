# Quick Deployment Guide

## 🚀 Fastest Path to Production

### Option 1: Firebase + Cloud Run (Recommended - 15 minutes)

**Best for**: Production, reliability, Google ecosystem

1. **Deploy Frontend** (already done ✅):
   ```bash
   npm run firebase:deploy
   ```

2. **Deploy Backend to Cloud Run**:
   ```bash
   # Install gcloud (if needed)
   brew install google-cloud-sdk  # macOS
   
   # Authenticate
   gcloud auth login
   gcloud config set project qapipeline-7c83d
   
   # Deploy (one command!)
   gcloud run deploy qa-api \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --port 8080 \
     --memory 2Gi \
     --timeout 300 \
     --set-env-vars "OPENAI_API_KEY=$OPENAI_API_KEY,BROWSERBASE_API_KEY=$BROWSERBASE_API_KEY,USE_LOCAL_BROWSER=true"
   ```

3. **Connect Frontend to Backend**:
   - Go to: `https://qapipeline-7c83d.web.app`
   - Open console (F12)
   - Run: `localStorage.setItem('API_BASE', 'https://qa-api-xxxxx.run.app'); location.reload();`

✅ **Done!** Your app is live!

### Option 2: Vercel + Railway (Simplest - 10 minutes)

**Best for**: Quick setup, simplicity

1. **Deploy Frontend to Vercel**:
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Deploy Backend to Railway**:
   - Go to: https://railway.app
   - Click "New Project" → "Deploy from GitHub"
   - Select your repo
   - Add environment variables:
     - `OPENAI_API_KEY`
     - `BROWSERBASE_API_KEY`
     - `USE_LOCAL_BROWSER=true`
   - Railway auto-deploys!

3. **Connect Frontend**:
   - Get Railway URL (e.g., `https://your-app.up.railway.app`)
   - In Vercel dashboard, set `API_BASE` in localStorage (same as Firebase)

✅ **Done!**

## 📋 What You Need

- ✅ OpenAI API key
- ✅ (Optional) Browserbase API key
- ✅ Google Cloud account (for Cloud Run) OR Railway account (free tier available)

## 💰 Cost Estimate

- **Firebase Hosting**: Free
- **Cloud Run**: ~$0.50/month (light usage)
- **Railway**: Free tier ($5 credit/month) or $5/month

## 📚 Detailed Guides

- **Full Guide**: See `docs/DEPLOYMENT_GUIDE.md`
- **Firebase**: See `docs/DEPLOY_FIREBASE.md`
- **Vercel**: See `docs/DEPLOY_VERCEL.md`
- **Railway**: See `docs/DEPLOY_RAILWAY.md`

## 🎯 Recommended: Firebase + Cloud Run

Why?
- ✅ Already using Firebase for frontend
- ✅ All services in one ecosystem
- ✅ Scalable and reliable
- ✅ Good documentation
- ✅ Pay-per-use pricing

Ready? Start with `docs/DEPLOY_FIREBASE.md`!

