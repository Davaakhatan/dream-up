# Using Firebase Firestore & Storage - Complete Solution

## What the "API Server" Actually Does

The API server is **NOT just a database**. It's a full server that:

1. **Runs Browser Automation** (Playwright/Browserbase)
   - Opens real browsers
   - Navigates to game URLs  
   - Clicks buttons, types keys, interacts with games
   - **This requires a server with browser binaries** - can't run in Firebase Hosting

2. **Executes Game Tests**
   - Simulates gameplay (arrow keys, spacebar, mouse clicks)
   - Navigates through 2-3 levels
   - Captures screenshots during gameplay

3. **Calls OpenAI API**
   - Sends screenshots to GPT-4 Vision
   - Analyzes playability
   - Generates test reports

4. **Currently Saves to File System**
   - Reports → JSON files in `./output/`
   - Screenshots → PNG files in `./output/screenshots/`

## Solution: Use Firebase Firestore + Storage

We can refactor to use Firebase services:

### Architecture

```
┌─────────────────────────────────────────┐
│  Firebase Hosting (Static Frontend)     │
│  - Dashboard HTML/CSS/JS                │
│  - Reads directly from Firestore        │
└─────────────────────────────────────────┘
                    │
                    │ Reads reports
                    ▼
┌─────────────────────────────────────────┐
│  Firebase Firestore                     │
│  - Test reports (JSON documents)        │
│  - Query: Get all reports               │
└─────────────────────────────────────────┘
                    │
                    │ References screenshots
                    ▼
┌─────────────────────────────────────────┐
│  Firebase Storage                       │
│  - Screenshot images (PNG files)        │
│  - Public URLs for dashboard            │
└─────────────────────────────────────────┘
                    ▲
                    │ Saves reports/screenshots
                    │
┌─────────────────────────────────────────┐
│  API Server (Express)                   │
│  - Runs browser automation              │
│  - Executes tests                       │
│  - Saves to Firestore + Storage         │
│  - Only needed when running NEW tests   │
└─────────────────────────────────────────┘
```

### Benefits

1. **Viewing Reports**: Dashboard reads directly from Firestore (no API needed!)
2. **Running Tests**: API server saves to Firestore/Storage
3. **Fully Firebase**: Everything stored in Firebase
4. **No File System**: No need for local `./output/` directory

## Implementation Plan

1. **Add Firebase Admin SDK** to save reports/screenshots
2. **Update EvidenceCapture** to upload to Firebase Storage
3. **Update QAAgent** to save reports to Firestore
4. **Update Dashboard** to read from Firestore (no API for viewing!)
5. **Keep API Server** only for running new tests

## Result

- ✅ **Dashboard**: Reads from Firestore (works without API server!)
- ✅ **Test Runner**: API server runs test, saves to Firebase
- ✅ **No File System**: Everything in Firebase
- ✅ **Fully Hosted**: Frontend + Database + Storage all in Firebase

Would you like me to implement this Firebase integration?

