/**
 * Omni-Tool Client-Side Firebase SDK (Phase 21)
 * 
 * This initializes the Firebase JS SDK for browser-side usage:
 * - Firebase Auth (Google Sign-In, email/password, anonymous)
 * - Firestore (real-time listeners for settings sync)
 * - Firebase Storage (client uploads)
 * - Firebase Analytics (optional)
 * 
 * All keys are NEXT_PUBLIC_ prefixed and safe for browser exposure.
 * The Admin SDK (firebase-admin.ts) handles server-side operations.
 */

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Singleton pattern — prevent re-initialization during HMR
function getFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
}

export const app: FirebaseApp = getFirebaseApp();
export const auth: Auth = getAuth(app);
export const firestore: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

// Lazy-load Analytics only in the browser
export async function getAnalyticsInstance() {
  if (typeof window === 'undefined') return null;
  try {
    const { getAnalytics, isSupported } = await import('firebase/analytics');
    const supported = await isSupported();
    if (supported) {
      return getAnalytics(app);
    }
  } catch {
    console.warn('[Omni-Tool] Firebase Analytics not supported in this environment.');
  }
  return null;
}
