/**
 * Firebase Functions for DreamUp QA Dashboard API
 * 
 * Note: Browser automation (Playwright/Browserbase) requires special setup in Firebase Functions.
 * Consider using Cloud Run for the full dashboard server instead, or use Firebase Functions
 * only for simple API endpoints and host the main dashboard elsewhere.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Simple health check endpoint
export const api = functions.https.onRequest((req, res) => {
  // CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  // For now, return a simple response
  // TODO: Integrate full dashboard API here or use Cloud Run
  res.json({
    message: 'DreamUp QA API',
    status: 'running',
    note: 'Full dashboard API should be deployed separately (e.g., Cloud Run) due to browser automation requirements'
  });
});

