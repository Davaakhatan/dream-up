# Enable Firebase Services for Web App

## Quick Setup Guide

To enable Firebase services for the web dashboard, you need to enable Firestore and Storage in the Firebase Console.

## Step 1: Enable Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **qapipeline-7c83d**
3. Click on **Firestore Database** in the left sidebar
4. Click **Create database**
5. Choose **Start in test mode** (for development) or **Start in production mode**
6. Select a location (choose closest to your users)
7. Click **Enable**

### Firestore Security Rules (for public read access)

After enabling, go to **Rules** tab and set:

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

Click **Publish** to save the rules.

## Step 2: Enable Firebase Storage

1. In Firebase Console, click on **Storage** in the left sidebar
2. Click **Get started**
3. Choose **Start in test mode** (for development) or **Start in production mode**
4. Select a location (should match Firestore location)
5. Click **Done**

### Storage Security Rules (for public read access)

After enabling, go to **Rules** tab and set:

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

Click **Publish** to save the rules.

## Step 3: Create Firestore Index (if needed)

If you see an error about missing index when querying reports:

1. Go to Firestore Database > **Indexes** tab
2. Click **Create Index**
3. Collection ID: `reports`
4. Fields to index:
   - `timestamp` (Descending)
5. Click **Create**

## Step 4: Verify Web App Configuration

Your Firebase config is already set in `src/dashboard/public/firebase-config.js`:

```javascript
{
  apiKey: "AIzaSyDVVI4qv9SV_TlU6-75q0ujszivVZ0zNm4",
  authDomain: "qapipeline-7c83d.firebaseapp.com",
  projectId: "qapipeline-7c83d",
  storageBucket: "qapipeline-7c83d.firebasestorage.app",
  messagingSenderId: "692862365583",
  appId: "1:692862365583:web:fe5ca43e30a9d4d01025fa"
}
```

## Testing

After enabling services:

1. **Build and deploy**:
   ```bash
   npm run build
   npm run firebase:deploy
   ```

2. **Open the dashboard** in your browser

3. **Check browser console** - you should see:
   ```
   ✓ Firebase initialized successfully
   ✓ Firestore ready
   ```

4. **If you see errors**, check:
   - Firestore is enabled
   - Storage is enabled
   - Security rules are published
   - Web app is properly configured in Firebase Console

## Troubleshooting

### Error: "Firestore not available"
- **Solution**: Enable Firestore Database in Firebase Console

### Error: "Permission denied"
- **Solution**: Update Firestore/Storage security rules to allow public read access

### Error: "Missing index"
- **Solution**: Create the index as described in Step 3, or click the error link in the console to create it automatically

### Error: "Storage not available"
- **Solution**: Enable Firebase Storage in Firebase Console

## Production Security

For production, consider:
- Using Firebase Authentication for write access
- Implementing more restrictive read rules
- Using Firebase App Check to prevent abuse

