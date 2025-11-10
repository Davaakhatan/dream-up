# Firebase Firestore Integration Setup

## What's Implemented

✅ **Backend (API Server)**:
- Firebase Admin SDK installed
- `FirebaseService` class for Firestore and Storage operations
- `EvidenceCapture` updated to upload screenshots to Firebase Storage
- `DashboardServer` saves reports to Firestore (in addition to file system)
- API endpoint reads from Firestore first, falls back to file system

✅ **Frontend (Dashboard)**:
- View-only mode when API server unavailable
- Ready for Firebase Client SDK integration

## Next Steps to Complete Integration

### 1. Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `qapipeline-7c83d`
3. Go to Project Settings > General
4. Scroll to "Your apps" section
5. Click on Web app (or create one)
6. Copy the Firebase configuration object

### 2. Configure Firebase in Dashboard

Add Firebase config to `src/dashboard/public/firebase-config.js`:

```javascript
window.FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "qapipeline-7c83d.firebaseapp.com",
  projectId: "qapipeline-7c83d",
  storageBucket: "qapipeline-7c83d.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Update Dashboard HTML

Add Firebase Client SDK script before the closing `</head>` tag:

```html
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js"></script>
<script src="/firebase-config.js"></script>
```

### 4. Update `fetchReports()` Function

Replace the current `fetchReports()` function to:
1. Try Firestore first (if Firebase is initialized)
2. Fall back to API endpoint
3. Handle screenshot URLs (Firebase Storage vs API)

### 5. Configure Firebase Storage Rules

In Firebase Console > Storage > Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /screenshots/{filename} {
      allow read: if true; // Public read access
      allow write: if request.auth != null; // Only authenticated users can write
    }
  }
}
```

### 6. Configure Firestore Rules

In Firebase Console > Firestore > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reports/{reportId} {
      allow read: if true; // Public read access
      allow write: if request.auth != null; // Only authenticated users can write
    }
  }
}
```

### 7. Enable Firebase in API Server

Set environment variable when running the API server:

```bash
USE_FIREBASE=true npm run dashboard
```

Or add to `.env`:
```
USE_FIREBASE=true
```

## How It Works

**When API Server is Running**:
- Tests run → Screenshots uploaded to Firebase Storage → Reports saved to Firestore
- Dashboard reads from Firestore (via API or directly)

**When API Server is NOT Running**:
- Dashboard reads directly from Firestore (no API needed!)
- View-only mode (cannot run new tests)

## Benefits

✅ Dashboard works without API server (for viewing reports)
✅ All data in Firebase (scalable, cloud-native)
✅ Screenshots accessible via public URLs
✅ No local file dependencies

