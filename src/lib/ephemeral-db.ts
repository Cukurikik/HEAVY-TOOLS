/**
 * Omni-Tool Ephemeral Database Wrapper (Phase 21)
 * 
 * Strict 1-Hour TTL Metadata Storage.
 * This ensures that even if users forget to delete their cloud-processed files,
 * the database auto-purges the pointers and a Cloud Function (or Watchdog) clears the Storage Bucket.
 */

import { getAdminFirestore } from './firebase-admin';
import { z } from 'zod';

// ==========================================
// 1. Zod Validation for Ephemeral Records
// ==========================================
export const EphemeralFileSchema = z.object({
  id: z.string().uuid(),
  uploaderIpHash: z.string(), // Extracted from middleware
  originalName: z.string(),
  mimeType: z.string(),
  sizeBytes: z.number().positive(),
  toolCategory: z.enum(['video', 'audio', 'image', 'pdf', 'converter', 'llm']),
  status: z.enum(['uploading', 'processing', 'ready', 'failed']),
  storagePath: z.string(),
  downloadUrl: z.string().url().nullable().default(null),
  createdAt: z.date().default(() => new Date()),
  // TTL Trigger Frame: Exactly 1 hour (3600 seconds) from creation
  expiresAt: z.date(),
});

export type EphemeralFileRecord = z.infer<typeof EphemeralFileSchema>;

// The explicit collection where TTL is configured in GCP Console
const EPHEMERAL_COLLECTION = 'omni_ephemeral_files';

export class EphemeralDB {
  /**
   * Registers a new file intent. Usually called right before handing out a Signed URL.
   */
  static async registerUploadIntent(
    payload: Omit<EphemeralFileRecord, 'id' | 'createdAt' | 'expiresAt' | 'status' | 'downloadUrl'>
  ): Promise<string> {
    const db = getAdminFirestore();
    const id = crypto.randomUUID();
    
    const now = new Date();
    // Guarantee strict 1-Hour survival time
    const ttlDate = new Date(now.getTime() + 60 * 60 * 1000);

    const record = EphemeralFileSchema.parse({
      ...payload,
      id,
      status: 'uploading',
      downloadUrl: null,
      createdAt: now,
      expiresAt: ttlDate,
    });

    await db.collection(EPHEMERAL_COLLECTION).doc(id).set(record);
    return id;
  }

  /**
   * Updates the status to 'ready' once the Cloud Engine finishes processing or
   * the client finishes the chunked upload.
   */
  static async markAsReady(id: string, downloadUrl: string): Promise<void> {
    const db = getAdminFirestore();
    await db.collection(EPHEMERAL_COLLECTION).doc(id).update({
      status: 'ready',
      downloadUrl,
      updatedAt: new Date(),
    });
  }

  /**
   * Emergency Purge Mechanism. Called by the OmniWatchdog if it detects hanging logic
   * bypassing the Firestore TTL.
   */
  static async executeManualPurge(): Promise<number> {
    const db = getAdminFirestore();
    const now = new Date();

    const snapshot = await db.collection(EPHEMERAL_COLLECTION)
      .where('expiresAt', '<', now)
      .limit(500) // Batch limits
      .get();

    if (snapshot.empty) return 0;

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    return snapshot.size;
  }
}
