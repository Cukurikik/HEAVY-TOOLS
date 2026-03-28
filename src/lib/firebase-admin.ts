/**
 * Omni-Tool Enterprise Firebase Admin Initialization (Phase 21)
 * 
 * Architecture Focus:
 * - Extremely strict singleton pattern to prevent Vercel Serverless cold-start exhaustion.
 * - Used strictly for generating V4 Signed URLs and Ephemeral Metadata tracking.
 * - Bypasses client-side SDK limitations by giving the backend full IAM authority
 *   for precise 1-hour expiration tokens.
 */

import * as admin from 'firebase-admin';

// Interface defining the strictly required Google Service Account structure defined in ENV
interface FirebaseServiceAccount {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

/**
 * Validates and parses the Base64 or JSON injected Environment Variables.
 * Returns null if the backend is running in "Local Only (No-Cloud) Mode".
 */
function getServiceAccount(): FirebaseServiceAccount | null {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.warn('[Omni-Tool] FIREBASE credentials missing from ENV. Cloud uploads disabled.');
    return null;
  }

  // Handle escaped newlines from env strings properly
  privateKey = privateKey.replace(/\\n/g, '\n');

  return {
    projectId,
    clientEmail,
    privateKey,
  };
}

/**
 * Initializes the Firebase Admin SDK ensuring strict Singleton behavior.
 */
function initializeAdminSingleton() {
  if (admin.apps.length > 0) {
    return admin.app(); // Already initialized from a previous hot-reload
  }

  const serviceAccount = getServiceAccount();
  if (!serviceAccount) return null;

  try {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId: serviceAccount.projectId,
        clientEmail: serviceAccount.clientEmail,
        privateKey: serviceAccount.privateKey,
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${serviceAccount.projectId}.firebasestorage.app`,
    });
  } catch (error) {
    console.error('[Omni-Tool] FATAL: Failed to initialize Firebase Admin SDK', error);
    throw error;
  }
}

// Instantiate and export the singletons
export const firebaseAdmin = initializeAdminSingleton();

// Provide direct accessors throwing explicit errors if accessed without configuration
export const getAdminStorage = () => {
  if (!firebaseAdmin) throw new Error('Cloud Storage is unavailable. Missing credentials.');
  return firebaseAdmin.storage();
};

export const getAdminFirestore = () => {
  if (!firebaseAdmin) throw new Error('Firestore is unavailable. Missing credentials.');
  return firebaseAdmin.firestore();
};

export const getAdminAuth = () => {
  if (!firebaseAdmin) throw new Error('Firebase Auth is unavailable. Missing credentials.');
  return firebaseAdmin.auth();
};
