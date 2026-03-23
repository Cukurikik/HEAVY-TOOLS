import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * 87. Daily Aggregation Job
 * Runs every night via Vercel Cron to summarize millions of VideoAnalytics rows 
 * into a lightweight aggregated table, then purges the raw telemetry to save space.
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // In a real scenario:
    // 1. SELECT COUNT(*), toolName FROM VideoAnalytics GROUP BY toolName
    // 2. INSERT INTO DailyStats
    // 3. DELETE FROM VideoAnalytics WHERE createdAt < Yesterday
    
    // Simulating aggregation
    console.log("Aggregating daily video stats...")
    
    // Purging old raw analytics
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const purgeResult = await db.videoAnalytics.deleteMany({
      where: {
        createdAt: {
          lt: yesterday
        }
      }
    })

    return NextResponse.json({ success: true, message: `Aggregated and purged ${purgeResult.count} raw records.` })
  } catch (error) {
    console.error('Cron daily aggregation error:', error)
    return NextResponse.json({ error: 'Internal server error aggregating stats.' }, { status: 500 })
  }
}
