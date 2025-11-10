# Implementing Firebase Firestore + Storage Integration

## What This Will Do

1. **Replace file system storage** with Firebase Firestore (reports) and Storage (screenshots)
2. **Update dashboard** to read directly from Firestore (no API needed for viewing!)
3. **Keep API server** only for running new tests (saves to Firebase)

## Benefits

- ✅ Dashboard works without API server (for viewing reports)
- ✅ All data in Firebase (no local files)
- ✅ Screenshots accessible via public URLs
- ✅ Scalable and cloud-native

## Implementation Steps

1. Install Firebase Admin SDK
2. Create Firestore collections structure
3. Update EvidenceCapture to upload screenshots to Firebase Storage
4. Update QAAgent to save reports to Firestore
5. Update Dashboard HTML to read from Firestore
6. Configure Firebase Storage rules for public access

## Current vs New Architecture

**Current:**
- Reports → `./output/report-*.json` (file system)
- Screenshots → `./output/screenshots/*.png` (file system)
- Dashboard → Reads via API `/api/reports` (needs server)

**New:**
- Reports → Firestore `reports` collection
- Screenshots → Firebase Storage `screenshots/` folder
- Dashboard → Reads directly from Firestore (no API!)

The API server is still needed, but only when:
- Running new tests (browser automation)
- It will save results to Firebase instead of file system

