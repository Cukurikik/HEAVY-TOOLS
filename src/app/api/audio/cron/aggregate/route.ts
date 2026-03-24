import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * 84. Daily Aggregation Cron (Audio)
 * Designed to compress daily AudioAnalytics rows into a cheaper summary 
 * database, or simply report them to monitoring software.
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)

    const aggregations = await db.audioAnalytics.groupBy({
      by: ['toolName', 'success'],
      where: {
        createdAt: { gte: yesterday }
      },
      _count: { id: true },
      _avg: { processTimeMs: true }
    })

    console.log('[AUDIO CRON] Daily Aggregations Computed:', aggregations)
    // We would ideally insert these into a `AudioDailyStats` table.

    return NextResponse.json({ success: true, processed: aggregations.length })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to aggregate daily audio stats' }, { status: 500 })
  }
}
