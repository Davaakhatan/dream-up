# Deploy to Vercel

## Architecture

- **Frontend**: Vercel Hosting (static files)
- **Backend API**: Vercel Serverless Functions ⚠️ **Limited** (5 min max on Pro)

⚠️ **Important**: Vercel Serverless Functions have execution time limits:
- Free tier: 10 seconds
- Pro tier: 5 minutes (may not be enough for browser automation)

**Recommendation**: Use Vercel for frontend only, deploy backend to Cloud Run or Railway.

## Option 1: Frontend Only (Recommended)

### Step 1: Deploy Frontend to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Create `vercel.json`:**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "dist/dashboard/public"
         }
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/$1"
       }
     ]
   }
   ```

3. **Add build script to `package.json`:**
   ```json
   {
     "scripts": {
       "vercel-build": "npm run build"
     }
   }
   ```

4. **Deploy:**
   ```bash
   vercel
   ```

5. **Set environment variables:**
   ```bash
   vercel env add FIREBASE_API_KEY
   vercel env add FIREBASE_PROJECT_ID
   ```

### Step 2: Deploy Backend Separately

Deploy backend to **Cloud Run** or **Railway** (see `DEPLOY_FIREBASE.md` or `DEPLOY_RAILWAY.md`).

Then update frontend to point to backend:
```javascript
localStorage.setItem('API_BASE', 'https://your-backend-url.com');
```

## Option 2: Full Stack (Limited)

⚠️ **Warning**: This approach has limitations due to Vercel's execution time limits.

### Step 1: Create API Routes

Create `api/test.ts`:
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DashboardServer } from '../../dist/dashboard/server.js';

// Note: This is a simplified version
// You'll need to adapt your Express server for Vercel's serverless functions
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  
  // Your API logic here
  // Note: Long-running browser automation may timeout
}
```

### Step 2: Configure `vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/dashboard/public"
      }
    },
    {
      "src": "api/**/*.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 300
    }
  }
}
```

### Step 3: Deploy

```bash
vercel
```

## Recommended Setup

**Best Practice**: 
- ✅ **Frontend**: Vercel (fast, global CDN)
- ✅ **Backend**: Cloud Run or Railway (unlimited execution time)

This gives you:
- Fast frontend delivery via Vercel's CDN
- Reliable backend with no time limits
- Better cost efficiency

## Environment Variables

Set in Vercel dashboard or CLI:
```bash
vercel env add OPENAI_API_KEY
vercel env add BROWSERBASE_API_KEY
vercel env add FIREBASE_PROJECT_ID
```

## Cost Estimate

- **Vercel Free**: 100 GB bandwidth, unlimited requests
- **Vercel Pro**: $20/month (5 min function timeout)
- **Backend (Cloud Run)**: Pay per use (~$0.50/month for light usage)

