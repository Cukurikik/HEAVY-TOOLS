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

    // Delete physical objects from bucket and DB records in optimized chunks
    const CHUNK_SIZE = 50
    for (let i = 0; i < staleVideos.length; i += CHUNK_SIZE) {
      const chunk = staleVideos.slice(i, i + CHUNK_SIZE)

      const results = await Promise.allSettled(
        chunk.map(async (video) => {
          const key = `${video.userId}/${video.fileName}`
          await deleteCloudObject(key)
          return video.id
        })
      )

      const successfulIds: string[] = []
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successfulIds.push(result.value as string)
        } else {
          console.error(`Failed to delete storage object for video ${chunk[index].id}:`, result.reason)
          failedCount++
        }
      })

      if (successfulIds.length > 0) {
        try {
          // Bulk DB deletion
          await db.cloudVideo.deleteMany({
            where: {
              id: { in: successfulIds }
            }
          })
          deletedCount += successfulIds.length
        } catch (dbErr) {
          console.error(`Bulk DB deletion failed for chunk starting at index ${i}:`, dbErr)
          // Fallback or just count as failures?
          // Since storage is deleted, but DB is not, we have an orphaned record.
          // For simplicity in this optimization, we add to failedCount.
          // Adjust this as necessary based on exact required semantics.
          failedCount += successfulIds.length
        }
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
