# Enable Browser Automation for Web Dashboard

## Quick Setup (3 Steps)

### Step 1: Set Environment Variables

Create or update your `.env` file in the project root:

```bash
# Required: OpenAI API key for AI evaluation
OPENAI_API_KEY=your_openai_key_here

# Optional: Browserbase (cloud browser automation)
BROWSERBASE_API_KEY=your_browserbase_key_here
BROWSERBASE_PROJECT_ID=your_project_id_here

# Optional: Use local browser (FREE - no API key needed)
USE_LOCAL_BROWSER=true

# Optional: Show browser window (for debugging)
SHOW_BROWSER=false
```

**Minimum Required**: Just `OPENAI_API_KEY` - the system will automatically use the free local browser.

### Step 2: Start the API Server

Open a terminal and run:

```bash
npm run dashboard
```

You should see:
```
📊 Dashboard running at:
   →→ http://localhost:3000
```

**Keep this terminal open** - the server must keep running for browser automation to work.

### Step 3: Connect Web Dashboard to API Server

#### Option A: Local Development (Recommended)

**Run both dashboard and API server locally:**

1. Start the API server (Terminal 1):
```bash
npm run dashboard
```

2. Open the dashboard: `http://localhost:3000`
3. The dashboard will automatically connect to the API server on the same port.

#### Option B: Firebase Hosting + Local API Server

**If your dashboard is hosted on Firebase but API server runs locally:**

⚠️ **Important**: This only works if you're accessing Firebase from the same machine running the API server.

1. **Start the API server locally:**
```bash
npm run dashboard
```

2. **Open your Firebase dashboard** (`qapipeline-7c83d.web.app`)

3. **Open browser console** (F12) and run:
```javascript
localStorage.setItem('API_BASE', 'http://localhost:3000');
location.reload();
```

4. **Deploy the updated dashboard** (with CSP fix):
```bash
npm run firebase:deploy
```

**Note**: The CSP has been updated to allow `localhost` connections. After deploying, refresh your Firebase dashboard.

#### Option C: Production (Both on Cloud)

For production, deploy both:
- Dashboard: Firebase Hosting ✅ (already done)
- API Server: Cloud Run, Railway, or Render (see Production Deployment section)

## Browser Automation Options

### Option 1: Local Browser (FREE - Recommended for Development)

**Pros:**
- ✅ Free - no API key needed
- ✅ Fast - runs on your machine
- ✅ Can show browser window for debugging

**Cons:**
- ❌ Requires your machine to be running
- ❌ Not suitable for production

**Setup:**
```bash
# In .env file:
USE_LOCAL_BROWSER=true
OPENAI_API_KEY=your_key
```

### Option 2: Browserbase (Cloud - Recommended for Production)

**Pros:**
- ✅ Cloud-based - no local resources needed
- ✅ Scalable
- ✅ Works from anywhere

**Cons:**
- ❌ Requires API key (paid service)
- ❌ May have quota limits

**Setup:**
```bash
# In .env file:
BROWSERBASE_API_KEY=your_key
BROWSERBASE_PROJECT_ID=your_project_id
OPENAI_API_KEY=your_key
# Don't set USE_LOCAL_BROWSER (or set to false)
```

### Automatic Fallback

The system automatically falls back to local browser if:
- Browserbase API key is not provided
- Browserbase quota limit is reached
- `USE_LOCAL_BROWSER=true` is set

## Verify Browser Automation is Working

1. **Start the API server**: `npm run dashboard`
2. **Open the dashboard**: `http://localhost:3000` (or your Firebase URL)
3. **Run a test**:
   - Enter a game URL: `https://funhtml5games.com/pacman/index.html`
   - Click "Run Test"
   - Watch the pipeline animation
4. **Check the terminal** - you should see:
   ```
   📱 Using local browser (Playwright - FREE)
   🚀 Starting local browser...
   📸 Capturing screenshots...
   🎮 Executing game actions...
   ```

## Production Deployment

For production, deploy the API server to a cloud service:

### Option 1: Google Cloud Run (Recommended)

1. Build Docker image:
```bash
docker build -t qa-agent .
```

2. Deploy to Cloud Run:
```bash
gcloud run deploy qa-agent \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars OPENAI_API_KEY=your_key,USE_LOCAL_BROWSER=true
```

3. Update dashboard API_BASE to your Cloud Run URL

### Option 2: Railway / Render

1. Connect your GitHub repo
2. Set environment variables:
   - `OPENAI_API_KEY`
   - `USE_LOCAL_BROWSER=true`
3. Deploy
4. Update dashboard API_BASE

### Option 3: AWS Lambda

See `lambda/README.md` for Lambda deployment instructions.

## Troubleshooting

### "API Server Not Available"

**Problem**: Dashboard can't connect to API server.

**Solutions**:
1. Make sure API server is running: `npm run dashboard`
2. Check the port (default: 3000)
3. For Firebase hosting, set `API_BASE` in localStorage (see Step 3 above)

### "Browser automation failed"

**Problem**: Tests fail to start browser.

**Solutions**:
1. Check `.env` file has `OPENAI_API_KEY`
2. If using Browserbase, verify API key is valid
3. Try `USE_LOCAL_BROWSER=true` to use free local browser
4. Check terminal logs for specific errors

### "OpenAI API error"

**Problem**: AI evaluation fails.

**Solutions**:
1. Verify `OPENAI_API_KEY` is correct
2. Check OpenAI account has credits
3. Ensure API key has GPT-4o access

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | ✅ Yes | - | OpenAI API key for AI evaluation |
| `BROWSERBASE_API_KEY` | ❌ No | - | Browserbase API key (optional) |
| `BROWSERBASE_PROJECT_ID` | ❌ No | - | Browserbase project ID (optional) |
| `USE_LOCAL_BROWSER` | ❌ No | `false` | Use local Playwright browser (free) |
| `SHOW_BROWSER` | ❌ No | `false` | Show browser window (for debugging) |
| `USE_FIREBASE` | ❌ No | `false` | Save reports to Firebase Firestore |
| `PORT` | ❌ No | `3000` | API server port |

## Next Steps

- ✅ Browser automation enabled
- ✅ API server running
- ✅ Dashboard connected
- 🎮 Ready to test games!

Try testing a game now:
1. Go to dashboard
2. Enter a game URL
3. Click "Run Test"
4. Watch the magic happen! ✨

