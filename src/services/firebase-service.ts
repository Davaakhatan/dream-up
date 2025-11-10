/**
 * Firebase service for Firestore and Storage operations
 */

import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getStorage, type Storage } from 'firebase-admin/storage';
import type { QAReport, ScreenshotInfo } from '../types/report.js';

export class FirebaseService {
  private app: App | null = null;
  private firestore: Firestore | null = null;
  private storage: Storage | null = null;
  private initialized = false;

  /**
   * Initialize Firebase Admin SDK
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Check if already initialized
      const existingApps = getApps();
      if (existingApps.length > 0) {
        this.app = existingApps[0];
      } else {
        // Get project ID from env var or use default from .firebaserc
        const projectId = process.env.FIREBASE_PROJECT_ID || 'qapipeline-7c83d';
        
        // Initialize with service account or use default credentials
        // For local development, use GOOGLE_APPLICATION_CREDENTIALS env var
        // For production (Cloud Run/Functions), uses default credentials
        if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
          const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
          this.app = initializeApp({
            credential: cert(serviceAccount),
            projectId: projectId,
          });
        } else {
          // Use default credentials (works in Cloud Run/Functions)
          // Explicitly set project ID to avoid auto-detection issues
          this.app = initializeApp({
            projectId: projectId,
          });
        }
      }

      this.firestore = getFirestore(this.app);
      this.storage = getStorage(this.app);
      this.initialized = true;
      console.log('✓ Firebase initialized');
    } catch (error) {
      console.warn('⚠ Firebase initialization failed (will use file system fallback):', error);
      this.initialized = false;
    }
  }

  /**
   * Check if Firebase is available
   */
  isAvailable(): boolean {
    return this.initialized && this.firestore !== null && this.storage !== null;
  }

  /**
   * Upload screenshot to Firebase Storage
   */
  async uploadScreenshot(
    screenshotBuffer: Buffer,
    filename: string
  ): Promise<string | null> {
    if (!this.isAvailable() || !this.storage) {
      return null;
    }

    try {
      const bucket = this.storage.bucket();
      const file = bucket.file(`screenshots/${filename}`);
      
      await file.save(screenshotBuffer, {
        metadata: {
          contentType: 'image/png',
          cacheControl: 'public, max-age=31536000',
        },
      });

      // Make file publicly readable
      await file.makePublic();

      // Get public URL
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/screenshots/${filename}`;
      console.log(`✓ Screenshot uploaded to Firebase Storage: ${filename}`);
      return publicUrl;
    } catch (error) {
      console.warn('⚠ Failed to upload screenshot to Firebase:', error);
      return null;
    }
  }

  /**
   * Save report to Firestore
   */
  async saveReport(report: QAReport): Promise<string | null> {
    if (!this.isAvailable() || !this.firestore) {
      return null;
    }

    try {
      // Update screenshot URLs if screenshots were uploaded
      const reportWithUrls = {
        ...report,
        screenshots: report.screenshots.map((screenshot) => {
          // If screenshot has a Firebase Storage URL, use it
          // Otherwise, keep the filename (will be served via API)
          if (screenshot.storageUrl) {
            return {
              ...screenshot,
              url: screenshot.storageUrl,
            };
          }
          return screenshot;
        }),
      };

      const docRef = await this.firestore.collection('reports').add({
        ...reportWithUrls,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`✓ Report saved to Firestore: ${docRef.id}`);
      return docRef.id;
    } catch (error) {
      console.warn('⚠ Failed to save report to Firestore:', error);
      return null;
    }
  }

  /**
   * Get all reports from Firestore
   */
  async getReports(): Promise<QAReport[]> {
    if (!this.isAvailable() || !this.firestore) {
      return [];
    }

    try {
      const snapshot = await this.firestore
        .collection('reports')
        .orderBy('timestamp', 'desc')
        .get();

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        if (!data) {
          return null;
        }
        // Remove Firestore metadata fields
        const { createdAt, updatedAt, id, ...report } = data as any;
        return report as QAReport;
      }).filter((r): r is QAReport => r !== null);
    } catch (error) {
      console.warn('⚠ Failed to get reports from Firestore:', error);
      return [];
    }
  }

  /**
   * Get a single report by ID
   */
  async getReport(reportId: string): Promise<QAReport | null> {
    if (!this.isAvailable() || !this.firestore) {
      return null;
    }

    try {
      const doc = await this.firestore.collection('reports').doc(reportId).get();
      if (!doc.exists) {
        return null;
      }
      const data = doc.data();
      if (!data) {
        return null;
      }
      // Remove Firestore metadata fields (same pattern as getReports)
      const { createdAt, updatedAt, id, ...report } = data as any;
      return report as QAReport;
    } catch (error) {
      console.warn('⚠ Failed to get report from Firestore:', error);
      return null;
    }
  }
}

// Singleton instance
let firebaseServiceInstance: FirebaseService | null = null;

export function getFirebaseService(): FirebaseService {
  if (!firebaseServiceInstance) {
    firebaseServiceInstance = new FirebaseService();
  }
  return firebaseServiceInstance;
}

