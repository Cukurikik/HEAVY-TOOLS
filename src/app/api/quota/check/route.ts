/**
 * Phase 28: Quota Check API (Internal Edge Delegate)
 * 
 * Called by middleware.ts to verify Firestore tier limits 
 * BEFORE allowing media manipulation requests through.
 * 
 * This runs in Node.js runtime (NOT Edge) because it needs firebase-admin.
 * The middleware delegates to this via internal fetch().
 */

import { NextRequest, NextResponse } from 'next/server';
import { OmniFirestoreEngine, type EngineType } from '@/lib/firestore-ephemeral';

// Map engine types to their quota operation key
const ENGINE_TO_QUOTA_KEY: Record<EngineType, 'video_ops' | 'image_ops' | 'pdf_ops' | 'llm_tokens' | 'bandwidth_bytes'> = {
  video: 'video_ops',
  image: 'image_ops',
  pdf: 'pdf_ops',
  llm: 'llm_tokens',
  converter: 'bandwidth_bytes', // Converter charges bandwidth since it handles raw file transforms
};

/**
 * POST /api/quota/check
 * Body: { identifier: string, engineType: EngineType, costAmount?: number }
 * 
 * Returns: { allowed: boolean, remaining: number, resetAt: string, tier: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Validate internal-only access via admin token
    const authHeader = request.headers.get('x-internal-token');
    if (authHeader !== (process.env.ADMIN_SECRET_TOKEN || 'omni-internal-secret')) {
      return NextResponse.json(
        { error: 'Unauthorized internal access.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { identifier, engineType, costAmount = 1 } = body;

    if (!identifier || !engineType) {
      return NextResponse.json(
        { error: 'Missing required fields: identifier, engineType' },
        { status: 400 }
      );
    }

    // Map engine to quota key
    const quotaKey = ENGINE_TO_QUOTA_KEY[engineType as EngineType];
    if (!quotaKey) {
      return NextResponse.json(
        { error: `Unknown engine type: ${engineType}` },
        { status: 400 }
      );
    }

    // Perform atomic Firestore quota check (does NOT consume yet)
    // We use a "dry run" approach: read the document to check limits
    // without increment. Actual consumption is done post-processing.
    const result = await OmniFirestoreEngine.checkAndConsumeQuota(
      identifier,
      quotaKey,
      0 // Zero cost: just check, don't consume
    );

    // Also check if the user would exceed limits with the planned cost
    const wouldExceed = result.remaining < costAmount;

    return NextResponse.json({
      allowed: !wouldExceed && result.allowed,
      remaining: result.remaining,
      resetAt: result.resetAt.toISOString(),
      quotaKey,
      requestedCost: costAmount,
    });

  } catch (error) {
    // If Firestore is not configured (local mode), allow by default
    if (error instanceof Error && error.message.includes('unavailable')) {
      return NextResponse.json({
        allowed: true,
        remaining: Infinity,
        resetAt: new Date(Date.now() + 86400000).toISOString(),
        quotaKey: 'unknown',
        requestedCost: 1,
        note: 'Firestore not configured — running in unlimited local mode.',
      });
    }

    console.error('[Quota Check] Fatal error:', error);
    return NextResponse.json(
      { error: 'Internal quota check failure.', details: String(error) },
      { status: 500 }
    );
  }
}
