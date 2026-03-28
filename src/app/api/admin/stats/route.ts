/**
 * Phase 28: Unified Admin Stats API
 * 
 * Aggregates metrics across all 5 engines from:
 * - Firestore: ephemeral_tasks (task counts, error rates)
 * - Firestore: rate_limit_quotas (bandwidth, op counts)
 * - Edge Store: in-memory rate limit data (active IPs, bans)
 * 
 * Protected by ADMIN_SECRET_TOKEN in headers.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase-admin';
import type { AdminDashboardData, EngineStats, ActiveSession, ErrorLogEntry, SecurityEvent, EngineType } from '@/modules/admin-dashboard/types';

const ENGINES: EngineType[] = ['video', 'image', 'pdf', 'llm', 'converter'];

const FREE_TIER_LIMITS = {
  video_ops: 10,
  image_ops: 50,
  pdf_ops: 20,
  llm_tokens: 50000,
  bandwidth_bytes: 500 * 1024 * 1024,
};

export async function GET(request: NextRequest) {
  try {
    // Admin auth check
    const adminToken = request.headers.get('x-admin-token') || 
                       request.nextUrl.searchParams.get('token');
    if (adminToken !== (process.env.ADMIN_SECRET_TOKEN || 'omni-admin-dev')) {
      return NextResponse.json({ error: 'Forbidden. Invalid admin token.' }, { status: 403 });
    }

    let engineStats: EngineStats[] = [];
    let recentErrors: ErrorLogEntry[] = [];
    let activeSessions: ActiveSession[] = [];
    let totalBandwidthToday = 0;
    let totalRequestsToday = 0;

    try {
      const db = getAdminFirestore();

      // ─── AGGREGATE ENGINE STATS FROM EPHEMERAL TASKS ───
      const now = Date.now();
      const twentyFourHoursAgo = new Date(now - 86400000);

      for (const engine of ENGINES) {
        try {
          const tasksSnapshot = await db.collection('ephemeral_tasks')
            .where('engine_type', '==', engine)
            .where('created_at', '>=', twentyFourHoursAgo)
            .get();

          let successCount = 0;
          let errorCount = 0;
          let totalBytes = 0;

          tasksSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.status === 'success') successCount++;
            else if (data.status === 'error') errorCount++;
            totalBytes += data.file_size || 0;
          });

          const total = successCount + errorCount;
          engineStats.push({
            engineType: engine,
            totalTasks: tasksSnapshot.size,
            successCount,
            errorCount,
            successRate: total > 0 ? Math.round((successCount / total) * 100) : 100,
            totalBytesProcessed: totalBytes,
          });

          totalBandwidthToday += totalBytes;
        } catch {
          // Engine query failed — push zero stats
          engineStats.push({
            engineType: engine,
            totalTasks: 0,
            successCount: 0,
            errorCount: 0,
            successRate: 100,
            totalBytesProcessed: 0,
          });
        }
      }

      // ─── RECENT ERRORS ───
      try {
        const errorsSnapshot = await db.collection('ephemeral_tasks')
          .where('status', '==', 'error')
          .orderBy('created_at', 'desc')
          .limit(20)
          .get();

        errorsSnapshot.forEach(doc => {
          const data = doc.data();
          recentErrors.push({
            id: doc.id,
            engineType: data.engine_type || 'video',
            toolSlug: data.tool_slug || 'unknown',
            errorMessage: data.error_log || 'No error details captured.',
            timestamp: data.created_at?.toDate?.()?.toISOString?.() || new Date().toISOString(),
            userId: data.user_id || 'anonymous',
          });
        });
      } catch {
        // Errors query failed silently
      }

      // ─── ACTIVE QUOTA SESSIONS ───
      try {
        const quotasSnapshot = await db.collection('rate_limit_quotas')
          .orderBy('last_reset_at', 'desc')
          .limit(50)
          .get();

        quotasSnapshot.forEach(doc => {
          const data = doc.data();
          const totalOps = (data.video_ops || 0) + (data.image_ops || 0) + 
                           (data.pdf_ops || 0) + (data.llm_tokens || 0);
          totalRequestsToday += totalOps;

          activeSessions.push({
            ipHash: doc.id.slice(0, 12) + '...', // Truncated for privacy
            requestCount: totalOps,
            lastRequestAt: data.last_reset_at?.toMillis?.() || Date.now(),
            isBanned: false,
            bannedUntil: null,
            violationCount: 0,
          });
        });
      } catch {
        // No quota data available
      }

    } catch (error) {
      // Firestore completely unavailable — return skeleton data
      console.warn('[Admin Stats] Firestore unavailable, returning skeleton data.');
      engineStats = ENGINES.map(e => ({
        engineType: e,
        totalTasks: 0,
        successCount: 0,
        errorCount: 0,
        successRate: 100,
        totalBytesProcessed: 0,
      }));
    }

    // ─── IMPORT SECURITY EVENTS FROM MIDDLEWARE BUFFER ───
    let securityEvents: SecurityEvent[] = [];
    try {
      // Dynamic import to access middleware's exported buffer
      const { getRecentSecurityEvents } = await import('@/middleware');
      const cutoff = Date.now() - 3600000; // Last hour
      securityEvents = getRecentSecurityEvents(cutoff).map(e => ({
        type: e.type as SecurityEvent['type'],
        ipHash: e.ipHash.slice(0, 12) + '...',
        path: e.path,
        timestamp: e.timestamp,
        details: e.details,
      }));
    } catch {
      // Middleware buffer not accessible — no events
    }

    // ─── ASSEMBLE RESPONSE ───
    const dashboardData: AdminDashboardData = {
      quotaOverview: {
        identifier: 'global-aggregate',
        tier: 'free',
        usage: {
          video_ops: engineStats.find(e => e.engineType === 'video')?.totalTasks || 0,
          image_ops: engineStats.find(e => e.engineType === 'image')?.totalTasks || 0,
          pdf_ops: engineStats.find(e => e.engineType === 'pdf')?.totalTasks || 0,
          llm_tokens: engineStats.find(e => e.engineType === 'llm')?.totalTasks || 0,
          bandwidth_bytes: totalBandwidthToday,
        },
        limits: FREE_TIER_LIMITS,
        remaining: {
          video_ops: FREE_TIER_LIMITS.video_ops - (engineStats.find(e => e.engineType === 'video')?.totalTasks || 0),
          image_ops: FREE_TIER_LIMITS.image_ops - (engineStats.find(e => e.engineType === 'image')?.totalTasks || 0),
          pdf_ops: FREE_TIER_LIMITS.pdf_ops - (engineStats.find(e => e.engineType === 'pdf')?.totalTasks || 0),
          llm_tokens: FREE_TIER_LIMITS.llm_tokens - (engineStats.find(e => e.engineType === 'llm')?.totalTasks || 0),
          bandwidth_bytes: FREE_TIER_LIMITS.bandwidth_bytes - totalBandwidthToday,
        },
        percentages: {
          video_ops: Math.round(((engineStats.find(e => e.engineType === 'video')?.totalTasks || 0) / FREE_TIER_LIMITS.video_ops) * 100),
          image_ops: Math.round(((engineStats.find(e => e.engineType === 'image')?.totalTasks || 0) / FREE_TIER_LIMITS.image_ops) * 100),
          pdf_ops: Math.round(((engineStats.find(e => e.engineType === 'pdf')?.totalTasks || 0) / FREE_TIER_LIMITS.pdf_ops) * 100),
          llm_tokens: Math.round(((engineStats.find(e => e.engineType === 'llm')?.totalTasks || 0) / FREE_TIER_LIMITS.llm_tokens) * 100),
          bandwidth_bytes: Math.round((totalBandwidthToday / FREE_TIER_LIMITS.bandwidth_bytes) * 100),
        },
        resetAt: new Date(Date.now() + 86400000).toISOString(),
        isExhausted: false,
      },
      engineStats,
      activeSessions,
      recentErrors,
      securityEvents,
      bandwidth: {
        totalBytesToday: totalBandwidthToday,
        limitBytes: FREE_TIER_LIMITS.bandwidth_bytes,
        percentUsed: Math.round((totalBandwidthToday / FREE_TIER_LIMITS.bandwidth_bytes) * 100),
      },
      systemHealth: {
        uptime: process.uptime ? process.uptime() : 0,
        activeWorkers: activeSessions.length,
        memoryUsage: typeof process !== 'undefined' && process.memoryUsage 
          ? Math.round(process.memoryUsage().heapUsed / 1024 / 1024) 
          : 0,
        totalRequestsToday,
      },
    };

    return NextResponse.json({ success: true, data: dashboardData });

  } catch (error) {
    console.error('[Admin Stats] Fatal error:', error);
    return NextResponse.json({ error: 'Internal error fetching admin stats.' }, { status: 500 });
  }
}
