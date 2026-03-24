import { NextRequest, NextResponse } from 'next/server'
import { generateDownloadUrl } from '@/lib/storage'
import { db } from '@/lib/db'

/**
 * 33. API download-url Audio
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const audioId = searchParams.get('audioId')
    const userId = "dev-user-id"

    if (!audioId) {
      return NextResponse.json({ error: 'Audio ID is required' }, { status: 400 })
    }

    // Verify ownership
    const record = await db.cloudAudio.findFirst({
      where: { id: audioId, userId }
    })

    if (!record) {
      return NextResponse.json({ error: 'Audio file not found or unauthorized' }, { status: 404 })
    }

    // Generate secure URL
    // Extract key from the URL or filename logic
    const key = record.fileUrl.split('/').slice(-2).join('/') 
    const downloadUrl = await generateDownloadUrl('audio-exports', key)

    return NextResponse.json({ success: true, downloadUrl })
  } catch (error) {
    console.error('Audio download-url error:', error)
    return NextResponse.json({ error: 'Failed to generate download URL' }, { status: 500 })
  }
}
