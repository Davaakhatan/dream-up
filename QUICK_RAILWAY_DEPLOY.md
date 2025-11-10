# Quick Railway Deployment (No Billing Required!)

## Step 1: Deploy to Railway (5 minutes)

1. **Go to Railway**: https://railway.app
2. **Sign up** with GitHub
3. **Create New Project** → "Deploy from GitHub repo"
4. **Select your repository**: `Davaakhatan/DreamUp`
5. **Railway auto-detects** Node.js and starts building!

## Step 2: Configure Environment Variables

In Railway dashboard, go to your project → Variables tab, add:

```
OPENAI_API_KEY=your-openai-key
BROWSERBASE_API_KEY=your-browserbase-key (optional)
USE_LOCAL_BROWSER=true
FIREBASE_PROJECT_ID=qapipeline-7c83d
PORT=3000
```

## Step 3: Configure Build Settings

Railway should auto-detect, but if needed:

- **Build Command**: `npm run build`
- **Start Command**: `node dist/dashboard/server.js`

## Step 4: Get Your URL

Railway gives you a URL like: `https://your-app.up.railway.app`

## Step 5: Connect Frontend

1. Go to your Firebase dashboard: `https://qapipeline-7c83d.web.app`
2. Open browser console (F12)
3. Run:
   ```javascript
   localStorage.setItem('API_BASE', 'https://your-app.up.railway.app');
   location.reload();
   ```

✅ **Done!** Your app is live!

## Cost

- **Free Tier**: $5 credit/month (usually enough for light usage)
- **Hobby Plan**: $5/month (if you need more)

## Troubleshooting

If Playwright doesn't work, add to `package.json`:
```json
{
  "scripts": {
    "postinstall": "npx playwright install --with-deps chromium"
  }
}
```

