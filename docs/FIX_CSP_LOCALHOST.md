# Fix: CSP Blocking Localhost Connections

## Problem

When accessing the Firebase-hosted dashboard (`qapipeline-7c83d.web.app`), you may see this error:

```
Content-Security-Policy: The page's settings blocked the loading of a resource 
(connect-src) at http://localhost:3000/api/reports because it violates the 
following directive: "connect-src 'self' https://*.firebaseio.com https://*.googleapis.com"
```

## Solution

The CSP (Content Security Policy) has been updated to allow localhost connections. 

### Step 1: Deploy Updated Dashboard

```bash
npm run build
npm run firebase:deploy
```

### Step 2: Configure API Base URL

After deploying, open your Firebase dashboard and run in the browser console:

```javascript
localStorage.setItem('API_BASE', 'http://localhost:3000');
location.reload();
```

### Step 3: Start API Server

Make sure your API server is running:

```bash
npm run dashboard
```

### Step 4: Refresh Dashboard

Refresh the Firebase dashboard page. The CSP error should be gone, and you should be able to run tests.

## What Changed

The CSP `connect-src` directive now includes:
- `http://localhost:*` - Allows any localhost port
- `http://127.0.0.1:*` - Allows 127.0.0.1 (alternative localhost)
- `https://*.firebaseio.com` - Firebase services
- `https://*.googleapis.com` - Google APIs
- `http://*.googleapis.com` - HTTP Google APIs

## Alternative: Run Everything Locally

If you want to avoid CSP issues entirely, run both locally:

1. Start API server: `npm run dashboard`
2. Open: `http://localhost:3000`
3. No CSP issues, no configuration needed!

## Production Setup

For production, deploy the API server to a cloud service and update `API_BASE` to point to the deployed URL (e.g., `https://your-api.run.app`).

