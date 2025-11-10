# How to Start the API Server

## Quick Fix (2 Steps)

### Step 1: Start the API Server

Open a **new terminal window** and run:

```bash
cd "/Users/davaakhatanzorigtbaatar/Downloads/Private/2024/2025/CLassboxes/Gauntlet AI/Projects/AlphaSchool/DreamUp"
npm run dashboard
```

You should see:
```
📊 Dashboard running at:
   →→ http://localhost:3000
```

**Keep this terminal open** - the server needs to keep running.

### Step 2: Configure the Dashboard

1. Go to your Firebase dashboard: `https://qapipeline-7c83d.web.app`
2. Open browser console:
   - **Chrome/Edge**: Press `F12` or `Right-click → Inspect → Console`
   - **Firefox**: Press `F12` or `Right-click → Inspect Element → Console`
   - **Safari**: Press `Cmd+Option+I` → Console tab
3. In the console, paste this command and press Enter:
```javascript
localStorage.setItem('API_BASE', 'http://localhost:3000');
location.reload();
```
4. The page will reload and connect to your local API server!

## Verify It's Working

After reloading, you should see:
- ✅ **No red banner** at the top
- ✅ **"No test reports found"** message (if no tests run yet)
- ✅ **Test runner** works when you enter a game URL

## Important Notes

1. **Keep the API server running**: The terminal with `npm run dashboard` must stay open
2. **CORS is enabled**: The server already allows cross-origin requests from Firebase
3. **Port 3000**: Make sure nothing else is using port 3000, or change it with `PORT=3001 npm run dashboard`

## Environment Variables

Make sure you have a `.env` file with:
```
OPENAI_API_KEY=your-key-here
BROWSERBASE_API_KEY=your-key-here  # Optional
USE_LOCAL_BROWSER=true  # Optional - uses free local browser
```

## Testing

Try testing a game:
1. Enter URL: `https://funhtml5games.com/pacman/index.html`
2. Click "Run Test"
3. Watch the pipeline animation!

## Production Deployment

For production, you'll want to deploy the API server to:
- **Cloud Run** (recommended for browser automation)
- **Railway** or **Render** (easier setup)
- **AWS Lambda** (if using the lambda setup)

Then update the API_BASE to your deployed URL.

