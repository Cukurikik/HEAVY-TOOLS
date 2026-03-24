import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * 85. Admin Dashboard API (Audio Data)
 * Exposes a protected endpoint exclusively for internal super-admins
 * to view the overall audio ecosystem health.
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
      return new NextResponse('Forbidden API Access.', { status: 403 })
    }

    // High level metrics
    const totalJobs = await db.audioTaskHistory.count()
    const crashRate = await db.audioAnalytics.count({ where: { success: false } })
    const presetsCreated = await db.audioPreset.count()
    const activeCloudPins = await db.cloudAudio.count({ where: { isPinned: true } })

    const responseFormat = {
      health: 'GREEN',
      totalJobsProcessed: totalJobs,
      totalAudioCrashesRecorded: crashRate,
      activeCloudAudioAssets: activeCloudPins,
      userCreatedPresets: presetsCreated
    }

    return NextResponse.json({ success: true, data: responseFormat })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 })
  }
}
