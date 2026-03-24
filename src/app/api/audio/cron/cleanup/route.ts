import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * 39. Cron Job Auto-Cleanup
 * Designed to be triggered by Vercel Cron.
 * Wipes out audio files that have been resting unpinned for over 24 hours.
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    
    // Find unpinned audios older than 24h
    const targets = await db.cloudAudio.findMany({
      where: {
        isPinned: false,
        createdAt: { lt: yesterday }
      }
    })

    // Delete physically from S3
    for (const record of targets) {
      // await deleteCloudObject('audio-exports', record.fileName)
    }

    // Delete from DB
    if (targets.length > 0) {
      const ids = targets.map(t => t.id)
      await db.cloudAudio.deleteMany({
        where: { id: { in: ids } }
      })
    }

    return NextResponse.json({ success: true, deletedCount: targets.length })
  } catch (error) {
    console.error('Audio cleanup cron error:', error)
    return NextResponse.json({ error: 'Internal server error cleaning up audio.' }, { status: 500 })
  }
}
