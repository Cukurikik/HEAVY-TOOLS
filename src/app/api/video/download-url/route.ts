import { NextRequest, NextResponse } from 'next/server'
import { generateDownloadUrl } from '@/lib/storage'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get('videoId')
    const userId = "dev-user-id" // Replace with proper auth session

    if (!videoId) {
      return NextResponse.json({ error: 'Missing videoId parameter' }, { status: 400 })
    }

    // Check if the user owns this video in the CloudVideo table
    const video = await db.cloudVideo.findUnique({
      where: { id: videoId }
    })

    if (!video) {
        return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    if (video.userId !== userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // The key is stored cleanly or we extract from fileUrl
    // Assuming fileUrl matches the key in the bucket if we use simple storage, or we store the key separately
    // For this example, say fileName contains the S3 key
    const key = `${userId}/${video.fileName}`

    const downloadUrl = await generateDownloadUrl(key)
    
    return NextResponse.json({ success: true, downloadUrl })
  } catch (error) {
    console.error('Download URL generation error:', error)
    return NextResponse.json({ error: 'Internal server error generating download URL' }, { status: 500 })
  }
}
