# Deploy Backend to Railway (Alternative to Cloud Run)

Railway is a simpler alternative to Cloud Run - easier setup, similar pricing.

## Why Railway?

- ✅ Simple deployment (Git push)
- ✅ No Dockerfile needed (auto-detects)
- ✅ Long-running processes supported
- ✅ Easy environment variable management
- ✅ Free tier available ($5 credit/month)

## Step 1: Create Railway Account

1. Go to: https://railway.app
2. Sign up with GitHub
3. Create new project

## Step 2: Deploy Backend

1. **Connect GitHub Repository:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Railway Auto-Detection:**
   - Railway will detect Node.js
   - It will run `npm start` or `npm run dashboard`

3. **Configure Build:**
   - Build Command: `npm run build`
   - Start Command: `node dist/dashboard/server.js`
   - Port: Railway sets `PORT` automatically

4. **Set Environment Variables:**
   In Railway dashboard, add:
   ```
   OPENAI_API_KEY=your-key
   BROWSERBASE_API_KEY=your-key
   BROWSERBASE_PROJECT_ID=your-id
   USE_LOCAL_BROWSER=true
   FIREBASE_PROJECT_ID=qapipeline-7c83d
   PORT=3000
   ```

5. **Deploy:**
   - Railway will automatically deploy on git push
   - Or click "Deploy" in dashboard

6. **Get URL:**
   - Railway provides a URL like: `https://your-app.up.railway.app`
   - You can add a custom domain

## Step 3: Update Frontend

Point your frontend (Firebase or Vercel) to Railway backend:

1. Go to your dashboard
2. Open browser console
3. Run:
   ```javascript
   localStorage.setItem('API_BASE', 'https://your-app.up.railway.app');
   location.reload();
   ```

## Step 4: Install Playwright Dependencies (if needed)

Railway may need Playwright dependencies. Create `railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node dist/dashboard/server.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

Or add to `package.json`:
```json
{
  "scripts": {
    "postinstall": "npx playwright install chromium"
  }
}
```

## Cost Estimate

- **Free Tier**: $5 credit/month
- **Hobby Plan**: $5/month (includes $5 credit)
- **Pro Plan**: $20/month (more resources)

For light usage, free tier is usually enough.

## Troubleshooting

### Build fails

Check Railway logs:
- Go to your project → Deployments → View logs

### Playwright not working

Add to `package.json`:
```json
{
  "scripts": {
    "postinstall": "npx playwright install --with-deps chromium"
  }
}
```

### Timeout issues

Railway doesn't have strict timeouts like Vercel, but if you hit issues:
- Increase memory in Railway settings
- Check Railway logs for errors

