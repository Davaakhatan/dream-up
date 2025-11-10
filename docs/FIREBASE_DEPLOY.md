# Firebase Hosting Deployment Guide

## Quick Start

1. **Install Firebase CLI** (if not already installed):
```bash
npm install -g firebase-tools
```

2. **Login to Firebase**:
```bash
firebase login
```

3. **Build the project**:
```bash
npm run build
```

4. **Deploy to Firebase Hosting**:
```bash
npm run firebase:deploy
```

Your dashboard will be live at:
- `https://qapipeline-7c83d.web.app`
- `https://qapipeline-7c83d.firebaseapp.com`

## Project Configuration

The Firebase project is already configured:
- **Project ID**: `qapipeline-7c83d`
- **Hosting Directory**: `dist/dashboard/public`
- **Functions Directory**: `functions`

## Important: API Server Setup

The dashboard frontend is deployed to Firebase Hosting, but the **API server** (which handles browser automation) needs to run separately because:

1. **Firebase Functions limitations**:
   - Max timeout: 9 minutes (Gen 2) or 60 seconds (Gen 1)
   - Browser automation (Playwright) requires more resources
   - Cold starts can be slow

2. **Recommended Options**:

   **Option A: Run API Server Locally** (Development)
   ```bash
   npm run dashboard
   ```
   Then configure the API URL in your browser's console:
   ```javascript
   localStorage.setItem('API_BASE', 'http://localhost:3000');
   location.reload();
   ```

   **Option B: Deploy API to Cloud Run** (Production)
   - Better for long-running browser automation
   - More resources and flexibility
   - Can handle concurrent requests
   - Then set: `localStorage.setItem('API_BASE', 'https://your-cloud-run-url')`

## Current Setup

The dashboard HTML now:
- Uses `localStorage.getItem('API_BASE')` if configured, otherwise defaults to `window.location.origin`
- Shows a helpful banner when API server is not available
- Gracefully handles API errors without crashing

**To configure API URL:**
1. Open browser console on the Firebase-hosted dashboard
2. Run: `localStorage.setItem('API_BASE', 'http://your-api-url:3000')`
3. Reload the page

## Deployment Commands

```bash
# Build and deploy hosting only
npm run firebase:deploy

# Build and deploy everything (hosting + functions)
npm run firebase:deploy:all

# Test locally
npm run firebase:serve
```

## Environment Variables

For the API server (when running separately), set:
- `OPENAI_API_KEY`: Your OpenAI API key
- `BROWSERBASE_API_KEY`: (Optional) Browserbase API key
- `USE_LOCAL_BROWSER`: Set to `true` to use local Playwright
- `SHOW_BROWSER`: Set to `true` to show browser window

## Next Steps

1. ✅ Deploy static frontend: `npm run firebase:deploy`
2. ⚠️ Set up API server (Cloud Run, local, or separate service)
3. 🔧 Update API endpoints if needed
4. 🧪 Test the full dashboard

## Troubleshooting

**Issue**: API calls fail after deployment
- **Solution**: Ensure API server is running and accessible. Update CORS settings if needed.

**Issue**: Functions timeout
- **Solution**: Browser automation should run on Cloud Run or separate service, not Firebase Functions.

**Issue**: Build fails
- **Solution**: Run `npm run build` first, then deploy.

