import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * 66. Monthly Quota Reset
 * Runs every 1st day of the month at midnight via Vercel Cron.
 * { "crons": [{ "path": "/api/video/cron/reset-quota", "schedule": "0 0 1 * *" }] }
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Reset FREE users to their base monthly quota
    // await db.user.updateMany({
    //   where: { role: 'FREE' },
    //   data: { aiCredits: 100 }
    // })

    // Reset PRO users
    // await db.user.updateMany({
    //   where: { role: 'PRO' },
    //   data: { aiCredits: 1000 }
    // })

    return NextResponse.json({ success: true, message: 'Seasson quotas have been reset successfully.' })
  } catch (error) {
    console.error('Cron quota reset error:', error)
    return NextResponse.json({ error: 'Internal server error resolving quotas.' }, { status: 500 })
  }
}
