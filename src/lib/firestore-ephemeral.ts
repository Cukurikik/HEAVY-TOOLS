import { getAdminFirestore } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * Omni-Tool Enterprise Firestore Engine (Phase 25)
 * 
 * Architecture Focus:
 * - Extremely strict, immutable server-side tracking of 1-Hour Ephemeral Tasks to prevent cloud space exhaustion.
 * - Deeply integrated Transactional Rate-Limiting quotas (video_ops, bandwidth, llm_tokens) per IP/User.
 * - Entirely uses Firebase Admin SDK bypassing client limits and ensuring zero-trust.
 */

// ═══════════════════════════════════════════════════
// TYPES & ENUMS
// ═══════════════════════════════════════════════════
export type EngineType = 'video' | 'image' | 'pdf' | 'llm' | 'converter';
export type TaskStatus = 'processing' | 'success' | 'error';
export type QuotaTier = 'free' | 'pro' | 'enterprise';

export interface EphemeralTaskOptions {
  userId: string;
  engineType: EngineType;
  toolSlug: string;
  fileSize: number;
  bucketPath?: string | null;
}

export interface EphemeralTaskRecord extends EphemeralTaskOptions {
  id: string;
  status: TaskStatus;
  createdAt: FirebaseFirestore.Timestamp;
  expiresAt: FirebaseFirestore.Timestamp;
  errorLog?: string;
}

export interface RateLimitQuota {
  identifier: string; // Document ID (IP Hash or UserID)
  tier: QuotaTier;
  video_ops: number;
  image_ops: number;
  pdf_ops: number;
  llm_tokens: number;
  bandwidth_bytes: number;
  last_reset_at: FirebaseFirestore.Timestamp;
  next_reset_at: FirebaseFirestore.Timestamp;
}

// ═══════════════════════════════════════════════════
// CONSTANTS & LIMITS
// ═══════════════════════════════════════════════════
const EXPIRATION_TTL_MS = 60 * 60 * 1000; // 1 Hour TTL
const QUOTA_RESET_MS = 24 * 60 * 60 * 1000; // 24 Hours Daily Limit

const FREE_TIER_LIMITS = {
  video_ops: 10,
  image_ops: 50,
  pdf_ops: 20,
  llm_tokens: 50000,
  bandwidth_bytes: 500 * 1024 * 1024, // 500 MB Default
};

// ═══════════════════════════════════════════════════
// CORE ENGINE IMPLEMENTATION
// ═══════════════════════════════════════════════════
export class OmniFirestoreEngine {
  /**
   * Generates extremely strict Ephemeral Tasks binding it to a 1-hour destruction cycle.
   */
  static async trackEphemeralTask(params: EphemeralTaskOptions): Promise<string> {
    const db = getAdminFirestore();
    const tasksRef = db.collection('ephemeral_tasks');
    
    // Calculate precise TTL timelines
    const now = Date.now();
    const expiresAt = now + EXPIRATION_TTL_MS;

    const docRef = await tasksRef.add({
      user_id: params.userId,
      engine_type: params.engineType,
      tool_slug: params.toolSlug,
      status: 'processing',
      file_size: params.fileSize,
      bucket_path: params.bucketPath || null,
      created_at: FieldValue.serverTimestamp(),
      expires_at: FirebaseFirestore.Timestamp.fromMillis(expiresAt),
    });

    return docRef.id;
  }

  /**
   * Finalizes an ephemeral task preventing abandoned processing locks.
   */
  static async finalizeTask(taskId: string, status: TaskStatus, errorLog?: string): Promise<void> {
    const db = getAdminFirestore();
    const taskRef = db.collection('ephemeral_tasks').doc(taskId);
    
    const updateData: any = { status };
    if (errorLog) updateData.error_log = errorLog;
    if (status === 'success') {
      // Re-trigger the expire cycle +1 hour from finalization so download URL remains active
      updateData.expires_at = FirebaseFirestore.Timestamp.fromMillis(Date.now() + EXPIRATION_TTL_MS);
    }

    await taskRef.update(updateData);
  }

  /**
   * Evaluates limits through a strict atomic Native Transaction to absolutely prevent usage race-conditions.
   */
  static async checkAndConsumeQuota(
    identifier: string,
    operationType: keyof typeof FREE_TIER_LIMITS,
    costAmount: number = 1
  ): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
    const db = getAdminFirestore();
    const quotaRef = db.collection('rate_limit_quotas').doc(identifier);

    return await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(quotaRef);
      const now = Date.now();

      // If document doesn't exist, build entirely new initialization state
      if (!doc.exists) {
        const resetAt = now + QUOTA_RESET_MS;
        const initialData = {
          identifier,
          tier: 'free' as QuotaTier,
          video_ops: 0,
          image_ops: 0,
          pdf_ops: 0,
          llm_tokens: 0,
          bandwidth_bytes: 0,
          last_reset_at: FieldValue.serverTimestamp(),
          next_reset_at: FirebaseFirestore.Timestamp.fromMillis(resetAt),
        };

        // Inject the initial cost upfront
        (initialData as any)[operationType] = costAmount;
        
        // Ensure requested cost doesn't trivially exceed free limit instantly
        const limit = FREE_TIER_LIMITS[operationType];
        if (costAmount > limit) {
          throw new Error('Operation exceeds absolute maximum free tier payload boundary.');
        }

        transaction.set(quotaRef, initialData);
        return {
          allowed: true,
          remaining: limit - costAmount,
          resetAt: new Date(resetAt),
        };
      }

      // Existing Quota Record Extraction
      const data = doc.data() as RateLimitQuota;
      const nextResetTime = data.next_reset_at.toMillis();
      const isExpired = now >= nextResetTime;

      if (isExpired) {
        // Daily limit cycle completely reset
        const newResetAt = now + QUOTA_RESET_MS;
        const resetUpdate = {
          video_ops: 0,
          image_ops: 0,
          pdf_ops: 0,
          llm_tokens: 0,
          bandwidth_bytes: 0,
          last_reset_at: FieldValue.serverTimestamp(),
          next_reset_at: FirebaseFirestore.Timestamp.fromMillis(newResetAt),
        };

        (resetUpdate as any)[operationType] = costAmount;
        const limit = FREE_TIER_LIMITS[operationType];
        
        if (costAmount > limit) {
          return { allowed: false, remaining: 0, resetAt: new Date(newResetAt) };
        }

        transaction.update(quotaRef, resetUpdate);
        return {
          allowed: true,
          remaining: limit - costAmount,
          resetAt: new Date(newResetAt),
        };
      }

      // Live Check (Not Expired) Continues
      const currentUsageString = operationType;
      const currentUsageCount = typeof data[currentUsageString] === 'number' ? data[currentUsageString] : 0;
      const tierLimit = FREE_TIER_LIMITS[operationType]; // Expanding to Pro/Enterprise requires checking data.tier later.

      if (currentUsageCount + costAmount > tierLimit) {
        // BLOCKED: Usage would exceed allowance
        return {
          allowed: false,
          remaining: tierLimit - currentUsageCount,
          resetAt: data.next_reset_at.toDate(),
        };
      }

      // PERMITTED: Atomic Usage Increment
      transaction.update(quotaRef, {
        [operationType]: FieldValue.increment(costAmount),
      });

      return {
        allowed: true,
        remaining: tierLimit - (currentUsageCount + costAmount),
        resetAt: data.next_reset_at.toDate(),
      };
    });
  }
}
