# Complete Deployment Guide

## Quick Decision Guide

**Choose based on your needs:**

| Platform | Frontend | Backend | Best For |
|----------|----------|---------|----------|
| **Firebase** | ✅ Hosting | ✅ Cloud Run | Full Google ecosystem |
| **Vercel** | ✅ Hosting | ⚠️ Limited | Frontend only (use Railway/Cloud Run for backend) |
| **Railway** | ❌ | ✅ Full | Simple backend deployment |

## Recommended Setup

### Option 1: Firebase + Cloud Run (Recommended)

✅ **Best for**: Production, Google ecosystem users

- **Frontend**: Firebase Hosting (`qapipeline-7c83d.web.app`)
- **Backend**: Google Cloud Run
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage

**Pros:**
- All services in one ecosystem
- Scalable and reliable
- Good documentation

**Cons:**
- Requires Google Cloud account
- Slightly more complex setup

**See**: `DEPLOY_FIREBASE.md`

### Option 2: Vercel + Railway (Simplest)

✅ **Best for**: Quick deployment, simplicity

- **Frontend**: Vercel (fast CDN)
- **Backend**: Railway (simple deployment)
- **Database**: Firebase Firestore (still works!)

**Pros:**
- Very easy setup
- Railway auto-detects everything
- Free tiers available

**Cons:**
- Multiple platforms to manage
- Railway free tier limited

**See**: `DEPLOY_VERCEL.md` + `DEPLOY_RAILWAY.md`

### Option 3: All Firebase

✅ **Best for**: Everything in one place

- **Frontend**: Firebase Hosting
- **Backend**: Cloud Run
- **Database**: Firestore
- **Storage**: Firebase Storage

**See**: `DEPLOY_FIREBASE.md`

## Step-by-Step: Firebase + Cloud Run (Recommended)

### 1. Deploy Frontend (2 minutes)

```bash
npm run build
npm run firebase:deploy
```

✅ Done! Your dashboard is live at: `https://qapipeline-7c83d.web.app`

### 2. Deploy Backend to Cloud Run (10 minutes)

```bash
# Install gcloud CLI (if not installed)
# macOS: brew install google-cloud-sdk

# Authenticate
gcloud auth login
gcloud config set project qapipeline-7c83d

# Deploy
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

You'll get a URL like: `https://qa-api-xxxxx.run.app`

### 3. Connect Frontend to Backend (1 minute)

1. Go to: `https://qapipeline-7c83d.web.app`
2. Open browser console (F12)
3. Run:
   ```javascript
   localStorage.setItem('API_BASE', 'https://qa-api-xxxxx.run.app');
   location.reload();
   ```

✅ Done! Your app is fully deployed!

## Environment Variables Checklist

Make sure these are set in your backend deployment:

- ✅ `OPENAI_API_KEY` - Required for AI evaluation
- ✅ `BROWSERBASE_API_KEY` - Optional (falls back to local browser)
- `USE_LOCAL_BROWSER=true` - Use free local browser
- ✅ `FIREBASE_PROJECT_ID=qapipeline-7c83d` - For Firestore
- ✅ `PORT=8080` - Server port (Cloud Run sets this automatically)

## Testing Your Deployment

1. **Test Frontend:**
   - Visit: `https://qapipeline-7c83d.web.app`
   - Should see dashboard (may show "View-Only Mode" if backend not connected)

2. **Test Backend:**
   - Visit: `https://your-backend-url.run.app/api/reports`
   - Should return JSON array (empty if no reports)

3. **Test Full Flow:**
   - Enter a game URL in dashboard
   - Click "Run Test"
   - Should see pipeline animation and test results

## Troubleshooting

### Frontend shows "API server not available"

**Solution**: Make sure backend is deployed and `API_BASE` is set correctly.

### Backend returns 404

**Solution**: Check that Cloud Run service is running and URL is correct.

### Tests timeout

**Solution**: Increase Cloud Run timeout:
```bash
gcloud run services update qa-api --timeout 300
```

### Playwright not working

**Solution**: Make sure Dockerfile installs Chromium (already included in provided Dockerfile).

## Cost Estimates

### Firebase + Cloud Run
- **Firebase Hosting**: Free (10 GB storage)
- **Cloud Run**: ~$0.50/month (light usage)
- **Firestore**: Free tier (1 GB storage, 50K reads/day)
- **Total**: ~$0.50-2/month for light usage

### Vercel + Railway
- **Vercel**: Free tier (100 GB bandwidth)
- **Railway**: $5/month (Hobby plan) or free tier
- **Total**: $0-5/month

## Next Steps

1. ✅ Choose your deployment option
2. ✅ Follow the specific guide (`DEPLOY_FIREBASE.md`, `DEPLOY_VERCEL.md`, or `DEPLOY_RAILWAY.md`)
3. ✅ Test your deployment
4. ✅ Set up custom domain (optional)
5. ✅ Monitor usage and costs

## Need Help?

- **Firebase**: See `DEPLOY_FIREBASE.md`
- **Vercel**: See `DEPLOY_VERCEL.md`
- **Railway**: See `DEPLOY_RAILWAY.md`
- **General**: Check `docs/` directory for more guides

