# Using Firebase Services Instead of File System

## What the "API Server" Actually Does

The API server is **not just a database** - it's a full server that:

1. **Runs Browser Automation** (Playwright/Browserbase)
   - Opens real browsers
   - Navigates to game URLs
   - Clicks buttons, types keys, interacts with games
   - This requires a server environment with browser binaries

2. **Executes Game Tests**
   - Simulates gameplay (arrow keys, spacebar, mouse clicks)
   - Navigates through 2-3 levels
   - Captures screenshots during gameplay

3. **Calls OpenAI API**
   - Sends screenshots to GPT-4 Vision
   - Analyzes playability
   - Generates test reports

4. **Stores Results** (currently in file system)
   - Saves reports as JSON files
   - Stores screenshots as PNG files

## Can We Use Firebase Instead?

**Yes!** We can use Firebase services, but the browser automation still needs to run somewhere:

### Option 1: Firebase Firestore + Storage + Functions (Recommended)

**What Firebase can handle:**
- ✅ **Firestore**: Store test reports (instead of JSON files)
- ✅ **Firebase Storage**: Store screenshots (instead of local files)
- ✅ **Firebase Functions**: Run browser automation (with limitations)

**Limitations:**
- ⚠️ Functions timeout: Max 9 minutes (Gen 2) - may not be enough for long tests
- ⚠️ Memory: May need 2GB+ for Playwright
- ⚠️ Cold starts: Can be slow

### Option 2: Firebase Firestore + Storage + Cloud Run (Best for Production)

**What Firebase can handle:**
- ✅ **Firestore**: Store test reports
- ✅ **Firebase Storage**: Store screenshots
- ✅ **Cloud Run**: Run browser automation (better than Functions)

**Benefits:**
- ✅ Longer timeouts (up to 60 minutes)
- ✅ More memory/CPU
- ✅ Better for Playwright

### Option 3: Hybrid Approach (Current + Firebase)

Keep the Express server but use Firebase for storage:
- ✅ Express server runs browser automation (local or Cloud Run)
- ✅ Firebase Firestore stores reports
- ✅ Firebase Storage stores screenshots
- ✅ Dashboard reads from Firebase (no API needed for viewing!)

## Recommended: Option 3 (Hybrid)

This gives you:
1. **Firebase Hosting**: Static dashboard frontend
2. **Firebase Firestore**: Test reports database
3. **Firebase Storage**: Screenshot storage
4. **Cloud Run or Local Server**: Browser automation (when needed)

The dashboard can read reports directly from Firestore, so you only need the API server when **running new tests**.

## Next Steps

Would you like me to:
1. **Refactor to use Firestore + Storage** (reports and screenshots in Firebase)
2. **Keep Express server** for browser automation (runs tests, saves to Firebase)
3. **Update dashboard** to read from Firestore instead of API

This way:
- ✅ Viewing reports: Direct from Firestore (no API needed!)
- ✅ Running tests: API server (local or Cloud Run) saves to Firebase
- ✅ Dashboard: Fully Firebase-hosted, reads from Firestore

