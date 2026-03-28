/**
 * Phase 28: Quota Status API (User-Facing Dashboard Data)
 * 
 * Returns the complete quota breakdown for the requesting IP/user.
 * Consumed by Admin Dashboard and user-facing quota widgets.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase-admin';

const FREE_TIER_LIMITS = {
  video_ops: 10,
  image_ops: 50,
  pdf_ops: 20,
  llm_tokens: 50000,
  bandwidth_bytes: 500 * 1024 * 1024, // 500 MB
};

type QuotaKey = keyof typeof FREE_TIER_LIMITS;

/**
 * GET /api/quota/status?identifier=xxx
 * Returns full quota dashboard for the given identifier (IP hash or user ID)
 */
export async function GET(request: NextRequest) {
  try {
    const identifier = request.nextUrl.searchParams.get('identifier');
    const ip = request.headers.get('x-real-ip') || 
               request.headers.get('x-forwarded-for') || 
               '127.0.0.1';
    
    // Use provided identifier or hash the IP
    const lookupId = identifier || await hashIp(ip);

    const db = getAdminFirestore();
    const quotaDoc = await db.collection('rate_limit_quotas').doc(lookupId).get();

    if (!quotaDoc.exists) {
      // No record = brand new user with full quota
      return NextResponse.json({
        identifier: lookupId,
        tier: 'free',
        usage: { video_ops: 0, image_ops: 0, pdf_ops: 0, llm_tokens: 0, bandwidth_bytes: 0 },
        limits: FREE_TIER_LIMITS,
        remaining: { ...FREE_TIER_LIMITS },
        percentages: { video_ops: 0, image_ops: 0, pdf_ops: 0, llm_tokens: 0, bandwidth_bytes: 0 },
        resetAt: new Date(Date.now() + 86400000).toISOString(),
        isExhausted: false,
      });
    }

    const data = quotaDoc.data()!;
    const usage: Record<QuotaKey, number> = {
      video_ops: data.video_ops || 0,
      image_ops: data.image_ops || 0,
      pdf_ops: data.pdf_ops || 0,
      llm_tokens: data.llm_tokens || 0,
      bandwidth_bytes: data.bandwidth_bytes || 0,
    };

    const tier = data.tier || 'free';
    const limits = FREE_TIER_LIMITS; // Expand for pro/enterprise later

    const remaining: Record<QuotaKey, number> = {} as any;
    const percentages: Record<QuotaKey, number> = {} as any;
    let isExhausted = false;

    for (const key of Object.keys(limits) as QuotaKey[]) {
      remaining[key] = Math.max(0, limits[key] - usage[key]);
      percentages[key] = Math.min(100, Math.round((usage[key] / limits[key]) * 100));
      if (remaining[key] <= 0) isExhausted = true;
    }

    const resetAt = data.next_reset_at?.toDate?.()?.toISOString?.() 
                    || new Date(Date.now() + 86400000).toISOString();

    return NextResponse.json({
      identifier: lookupId,
      tier,
      usage,
      limits,
      remaining,
      percentages,
      resetAt,
      isExhausted,
    });

  } catch (error) {
    // Firestore unavailable = local mode with unlimited quota
    if (error instanceof Error && error.message.includes('unavailable')) {
      return NextResponse.json({
        identifier: 'local-user',
        tier: 'free',
        usage: { video_ops: 0, image_ops: 0, pdf_ops: 0, llm_tokens: 0, bandwidth_bytes: 0 },
        limits: FREE_TIER_LIMITS,
        remaining: { ...FREE_TIER_LIMITS },
        percentages: { video_ops: 0, image_ops: 0, pdf_ops: 0, llm_tokens: 0, bandwidth_bytes: 0 },
        resetAt: new Date(Date.now() + 86400000).toISOString(),
        isExhausted: false,
        note: 'Firestore unavailable — unlimited local mode.',
      });
    }

    console.error('[Quota Status] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch quota status.' }, { status: 500 });
  }
}

async function hashIp(ip: string): Promise<string> {
  const enc = new TextEncoder();
  const salt = process.env.ENCRYPTION_SALT || 'omni-salt';
  const hashBuffer = await crypto.subtle.digest('SHA-256', enc.encode(ip + salt));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
}
