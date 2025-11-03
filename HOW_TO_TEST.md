# How to Test - Complete Guide

## Why Dashboard is Empty

The dashboard shows "No test reports found" because **no tests have been run yet**. The dashboard reads reports from the `./output/` directory, which only gets populated when you run tests.

## Automated Testing (Easiest Way)

### Option 1: Quick Automated Test
```bash
./automated-test.sh
```

This will:
1. ✅ Check your API keys
2. ✅ Run a test on a sample game (2048)
3. ✅ Generate a report
4. ✅ Show you where results are

**Then refresh your dashboard** at `http://localhost:3000` to see results!

### Option 2: Test Specific Game
```bash
./automated-test.sh https://play2048.co/
```

### Option 3: Manual Test
```bash
npm run cli test https://play2048.co/
```

## Step-by-Step Testing Process

### 1. Ensure Dashboard is Running
```bash
# In one terminal window
npm run cli dashboard
```

Keep this running. The dashboard will auto-refresh every 30 seconds.

### 2. Run Tests (In Another Terminal)
```bash
# Test Game 1: 2048 Puzzle
npm run cli test https://play2048.co/

# Wait for completion (1-3 minutes)

# Test Game 2: Simple HTML5 Game
npm run cli test <another-game-url>

# Test Game 3: Platformer
npm run cli test <platformer-game-url>
```

### 3. View Results

After each test:
1. Wait for test completion (you'll see "Test completed" message)
2. Go to dashboard: `http://localhost:3000`
3. **Refresh the page** (or wait for auto-refresh)
4. See your test results appear!

## What You'll See After Testing

### Dashboard Will Show:

1. **Statistics Cards** (top of page):
   - Total Tests: 3
   - Passed: X
   - Avg Score: XX
   - Total Issues: X

2. **Test Reports** (main area):
   - Game URL
   - Status badge (pass/fail/partial)
   - Playability score (0-100)
   - Screenshot gallery
   - Issues list
   - Execution time

3. **Screenshots**:
   - Thumbnails you can click
   - Timestamped images
   - Labeled by test phase

## Test Different Game Types

### Simple Puzzle Games
```bash
npm run cli test https://play2048.co/
```

### Platformer Games
```bash
npm run cli test https://itch.io/games/html5/platformer
```

### HTML5 Canvas Games
```bash
npm run cli test https://www.freecodecamp.org/news/how-to-build-a-pong-game-in-html5-with-canvas/
```

## Troubleshooting

### Dashboard Still Empty After Test?

1. **Check if report was created:**
   ```bash
   ls -la output/report-*.json
   ```

2. **Verify dashboard is reading correct directory:**
   - Dashboard looks in `./output/` by default
   - Check dashboard server console for errors

3. **Check report format:**
   ```bash
   cat output/report-*.json | head -20
   ```
   Should show JSON with `status`, `playability_score`, `screenshots`, etc.

4. **Restart dashboard:**
   ```bash
   # Stop dashboard (Ctrl+C)
   # Restart it
   npm run cli dashboard
   ```

### Test Fails?

1. **Check API keys:**
   ```bash
   cat .env | grep -v "your_key"
   ```
   Should show actual keys, not placeholders

2. **Check network:**
   - Browserbase and OpenAI require internet
   - Verify API keys are valid

3. **Check logs:**
   - Look at terminal output during test
   - Check `output/logs/` directory

## Expected Test Flow

```
1. Run: npm run cli test <url>
   ↓
2. Agent loads game in browser
   ↓
3. Takes screenshots
   ↓
4. Simulates gameplay
   ↓
5. Captures console logs
   ↓
6. Sends to AI for evaluation
   ↓
7. Generates report JSON
   ↓
8. Saves to output/report-*.json
   ↓
9. Dashboard reads report on refresh
   ↓
10. You see results!
```

## Quick Test Command

**Copy and paste this to test right now:**

```bash
./automated-test.sh https://play2048.co/
```

Then **refresh your dashboard** and you'll see:
- ✅ Test report card
- ✅ Screenshots
- ✅ Playability score
- ✅ Issues (if any)

## Verify Everything Works

Run this verification:

```bash
# 1. Start dashboard (keep running)
npm run cli dashboard

# 2. In another terminal, run test
./automated-test.sh

# 3. Wait 2-3 minutes

# 4. Refresh dashboard browser

# 5. You should see results!
```

---

**Remember:** The dashboard is a **viewer** - it displays test results. You need to **run tests first** to generate the data it displays!

