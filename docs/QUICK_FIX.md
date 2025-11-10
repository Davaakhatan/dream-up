# Quick Fix: API Server Connection

## Immediate Solution (Development)

### Step 1: Start the API Server

Open a terminal and run:
```bash
npm run dashboard
```

This will start the API server on `http://localhost:3000`

### Step 2: Configure the Dashboard

1. Open your Firebase-hosted dashboard: `https://qapipeline-7c83d.web.app`
2. Open browser console (F12 or Right-click → Inspect → Console)
3. Run this command:
```javascript
localStorage.setItem('API_BASE', 'http://localhost:3000');
location.reload();
```

4. The dashboard will now connect to your local API server!

## Production Solution Options

### Option A: Deploy API to Cloud Run (Recommended)

Cloud Run is perfect for long-running browser automation tasks.

1. **Create a Dockerfile** for the dashboard server
2. **Deploy to Cloud Run** with:
   - Memory: 2GB+ (for Playwright)
   - Timeout: 15 minutes
   - CPU: 2+ cores
3. **Set API_BASE** to your Cloud Run URL

### Option B: Use Firebase Functions (Limited)

Firebase Functions can work but have limitations:
- Max timeout: 9 minutes (Gen 2)
- May need special Playwright setup
- Cold starts can be slow

### Option C: Keep API Local (Development Only)

For development/testing, keep running `npm run dashboard` locally.

## Testing the Connection

After setting the API_BASE, you should see:
- ✅ No red banner
- ✅ Reports loading (if any exist)
- ✅ Test runner working

## Troubleshooting

**Issue**: Still seeing "API Server Not Available"
- Check if `npm run dashboard` is running
- Verify the port (default: 3000)
- Check browser console for CORS errors

**Issue**: CORS errors
- The dashboard server already has CORS enabled
- If issues persist, check firewall/network settings

**Issue**: API works but tests fail
- Check environment variables (OPENAI_API_KEY, etc.)
- Verify Browserbase API key (optional)
- Check server logs for errors

