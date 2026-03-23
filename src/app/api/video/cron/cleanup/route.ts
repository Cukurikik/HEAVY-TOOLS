import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { deleteCloudObject } from '@/lib/storage'

// This endpoint is meant to be called by Vercel Cron or a scheduler
// Configured in vercel.json:
// { "crons": [{ "path": "/api/video/cron/cleanup", "schedule": "0 0 * * *" }] }
export async function GET(request: NextRequest) {
  try {
    // Basic authorization for cron requests
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Find cloud videos older than 24 hours that are NOT pinned
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    
    const staleVideos = await db.cloudVideo.findMany({
      where: {
        isPinned: false,
        createdAt: {
          lt: yesterday
        }
      }
    })

    let deletedCount = 0
    let failedCount = 0

    // Delete physical objects from bucket and DB records
    for (const video of staleVideos) {
      try {
        const key = `${video.userId}/${video.fileName}`
        await deleteCloudObject(key)
        await db.cloudVideo.delete({ where: { id: video.id } })
        deletedCount++
      } catch (err) {
        console.error(`Failed to delete video ${video.id}:`, err)
        failedCount++
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Cron job complete`, 
      stats: { processed: staleVideos.length, deleted: deletedCount, failed: failedCount } 
    })

  } catch (error) {
    console.error('Cron auto-cleanup error:', error)
    return NextResponse.json({ error: 'Internal server error running auto-cleanup' }, { status: 500 })
  }
}
