# Deploy to Firebase (Recommended)

## Architecture

- **Frontend**: Firebase Hosting (static files) ✅ Already deployed
- **Backend API**: Google Cloud Run (for browser automation)

## Why Cloud Run for Backend?

- ✅ Supports long-running processes (up to 60 minutes)
- ✅ Can install system dependencies (Playwright, Chromium)
- ✅ Scales automatically
- ✅ Pay-per-use pricing
- ✅ Works seamlessly with Firebase

## Step 1: Deploy Frontend (Already Done ✅)

```bash
npm run firebase:deploy
```

Your dashboard is already at: `https://qapipeline-7c83d.web.app`

## Step 2: Deploy Backend to Cloud Run

### Option A: Using gcloud CLI (Recommended)

1. **Install Google Cloud SDK:**
   ```bash
   # macOS
   brew install google-cloud-sdk
   
   # Or download from: https://cloud.google.com/sdk/docs/install
   ```

2. **Authenticate:**
   ```bash
   gcloud auth login
   gcloud config set project qapipeline-7c83d
   ```

3. **Create Dockerfile:**
   Create `Dockerfile` in project root:
   ```dockerfile
   FROM node:20-slim
   
   # Install Playwright dependencies
   RUN apt-get update && apt-get install -y \
       chromium \
       chromium-sandbox \
       && rm -rf /var/lib/apt/lists/*
   
   WORKDIR /app
   
   # Copy package files
   COPY package*.json ./
   COPY tsconfig.json ./
   
   # Install dependencies
   RUN npm ci
   
   # Copy source code
   COPY . .
   
   # Build
   RUN npm run build
   
   # Expose port
   EXPOSE 8080
   
   # Set environment variables
   ENV PORT=8080
   ENV NODE_ENV=production
   
   # Start server
   CMD ["node", "dist/dashboard/server.js"]
   ```

4. **Create .dockerignore:**
   ```
   node_modules
   .git
   .env
   output
   dist
   *.md
   docs
   .memory-bank
   ```

5. **Deploy to Cloud Run:**
   ```bash
   # Build and deploy
   gcloud run deploy qa-api \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --port 8080 \
     --memory 2Gi \
     --timeout 300 \
     --set-env-vars "OPENAI_API_KEY=your-key,BROWSERBASE_API_KEY=your-key,USE_LOCAL_BROWSER=true"
   ```

6. **Get the URL:**
   After deployment, you'll get a URL like: `https://qa-api-xxxxx.run.app`

7. **Update Frontend:**
   In your Firebase dashboard, open browser console and run:
   ```javascript
   localStorage.setItem('API_BASE', 'https://qa-api-xxxxx.run.app');
   location.reload();
   ```

### Option B: Using Firebase Functions (Limited - 9 min max)

⚠️ **Note**: Firebase Functions have a 9-minute timeout limit, which may not be enough for some tests.

1. **Update `functions/src/index.ts`:**
   ```typescript
   import * as functions from 'firebase-functions';
   import { DashboardServer } from '../../dist/dashboard/server.js';
   
   const server = new DashboardServer(8080);
   
   export const api = functions.https.onRequest(async (req, res) => {
     // Handle CORS
     res.set('Access-Control-Allow-Origin', '*');
     res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
     res.set('Access-Control-Allow-Headers', 'Content-Type');
     
     if (req.method === 'OPTIONS') {
       res.status(204).send('');
       return;
     }
     
     // Proxy to dashboard server
     // Note: This is a simplified version
     // You may need to adapt the Express app for Cloud Functions
   });
   ```

2. **Deploy:**
   ```bash
   firebase deploy --only functions
   ```

## Step 3: Configure Environment Variables

Set environment variables in Cloud Run:
```bash
gcloud run services update qa-api \
  --set-env-vars "OPENAI_API_KEY=sk-...,BROWSERBASE_API_KEY=bb_...,USE_LOCAL_BROWSER=true" \
  --region us-central1
```

## Step 4: Update Frontend API Base

After deployment, update your Firebase dashboard to point to the new API:

1. Go to: `https://qapipeline-7c83d.web.app`
2. Open browser console (F12)
3. Run:
   ```javascript
   localStorage.setItem('API_BASE', 'https://your-cloud-run-url.run.app');
   location.reload();
   ```

## Cost Estimate

- **Firebase Hosting**: Free tier (10 GB storage, 360 MB/day transfer)
- **Cloud Run**: Pay per use (~$0.00002400 per vCPU-second, ~$0.00000250 per GiB-second)
- **Example**: 100 tests/month × 2 min each = ~$0.50/month

## Troubleshooting

### Playwright not working in Cloud Run

Make sure your Dockerfile installs Chromium:
```dockerfile
RUN apt-get update && apt-get install -y chromium
```

### Timeout errors

Increase Cloud Run timeout:
```bash
gcloud run services update qa-api --timeout 300
```

### Memory issues

Increase memory:
```bash
gcloud run services update qa-api --memory 2Gi
```

