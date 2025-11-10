# Quick Guide: Enable Firebase Services

## What You Need to Enable

Your Firebase project (`qapipeline-7c83d`) needs two services enabled:

1. **Firestore Database** - Stores test reports
2. **Firebase Storage** - Stores screenshots

## Quick Steps

### 1. Enable Firestore (2 minutes)

1. Open: https://console.firebase.google.com/project/qapipeline-7c83d/firestore
2. Click **Create database**
3. Select **Start in test mode**
4. Choose location (e.g., `us-central`)
5. Click **Enable**

**Then set security rules:**
- Go to **Rules** tab
- Replace with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reports/{reportId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```
- Click **Publish**

### 2. Enable Storage (2 minutes)

1. Open: https://console.firebase.google.com/project/qapipeline-7c83d/storage
2. Click **Get started**
3. Select **Start in test mode**
4. Choose location (same as Firestore)
5. Click **Done**

**Then set security rules:**
- Go to **Rules** tab
- Replace with:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /screenshots/{filename} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```
- Click **Publish**

## Verify It Works

1. Build and deploy:
   ```bash
   npm run build
   npm run firebase:deploy
   ```

2. Open the dashboard in browser

3. Check browser console (F12) - should see:
   ```
   ✓ Firebase initialized successfully
   ✓ Firestore ready
   ```

4. If you see errors, the services aren't enabled yet - follow steps above!

## That's It!

Once enabled, the dashboard will:
- ✅ Read reports from Firestore (no API server needed!)
- ✅ Display screenshots from Firebase Storage
- ✅ Work completely standalone for viewing reports

