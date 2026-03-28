/**
 * Phase 28: Quota Consume API (Post-Processing Deduction)
 * 
 * Called by engine APIs AFTER successful task completion to atomically
 * deduct from the user's quota. This ensures quota is only consumed
 * when a task actually succeeds — preventing phantom drains.
 */

import { NextRequest, NextResponse } from 'next/server';
import { OmniFirestoreEngine, type EngineType } from '@/lib/firestore-ephemeral';

const ENGINE_TO_QUOTA_KEY: Record<EngineType, 'video_ops' | 'image_ops' | 'pdf_ops' | 'llm_tokens' | 'bandwidth_bytes'> = {
  video: 'video_ops',
  image: 'image_ops',
  pdf: 'pdf_ops',
  llm: 'llm_tokens',
  converter: 'bandwidth_bytes',
};

/**
 * POST /api/quota/consume
 * Body: { identifier: string, engineType: EngineType, costAmount: number, bandwidthBytes?: number }
 * 
 * Returns: { consumed: boolean, remaining: number, resetAt: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Validate internal-only access
    const authHeader = request.headers.get('x-internal-token');
    if (authHeader !== (process.env.ADMIN_SECRET_TOKEN || 'omni-internal-secret')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const { identifier, engineType, costAmount = 1, bandwidthBytes = 0 } = body;

    if (!identifier || !engineType) {
      return NextResponse.json(
        { error: 'Missing required fields: identifier, engineType.' },
        { status: 400 }
      );
    }

    const quotaKey = ENGINE_TO_QUOTA_KEY[engineType as EngineType];
    if (!quotaKey) {
      return NextResponse.json(
        { error: `Unknown engine type: ${engineType}` },
        { status: 400 }
      );
    }

    // Atomic consumption: this WILL increment the counter
    const result = await OmniFirestoreEngine.checkAndConsumeQuota(
      identifier,
      quotaKey,
      costAmount
    );

    // Additionally consume bandwidth if provided
    if (bandwidthBytes > 0) {
      await OmniFirestoreEngine.checkAndConsumeQuota(
        identifier,
        'bandwidth_bytes',
        bandwidthBytes
      );
    }

    return NextResponse.json({
      consumed: result.allowed,
      remaining: result.remaining,
      resetAt: result.resetAt.toISOString(),
      quotaKey,
      costDeducted: result.allowed ? costAmount : 0,
    });

  } catch (error) {
    // Firestore unavailable — silently succeed (local mode)
    if (error instanceof Error && error.message.includes('unavailable')) {
      return NextResponse.json({
        consumed: true,
        remaining: Infinity,
        resetAt: new Date(Date.now() + 86400000).toISOString(),
        quotaKey: 'unknown',
        costDeducted: 0,
        note: 'Local mode — no quota tracking.',
      });
    }

    console.error('[Quota Consume] Fatal error:', error);
    return NextResponse.json(
      { error: 'Internal quota consume failure.' },
      { status: 500 }
    );
  }
}
