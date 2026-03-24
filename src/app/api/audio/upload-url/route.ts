import { NextRequest, NextResponse } from 'next/server'
import { generateUploadUrl } from '@/lib/storage'
import { db } from '@/lib/db' // Assuming we might check quotas

const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',  // MP3
  'audio/wav',   // WAV
  'audio/x-wav', 
  'audio/flac',  // FLAC
  'audio/ogg',   // OGG
  'audio/aac'    // AAC
]

/**
 * 32. API upload-url Audio
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const userId = "dev-user-id" // from session optimally

    const body = await request.json()
    const { fileName, fileSize, mimeType } = body

    // 34. MIME Validation Server (Lossless checks)
    if (!ALLOWED_AUDIO_TYPES.includes(mimeType)) {
      return NextResponse.json({ error: 'Format audio tidak didukung. Mohon gunakan MP3, WAV, atau FLAC.' }, { status: 400 })
    }

    // 35. Size Limit Enforcement
    // Assume 150MB limit for general users
    const maxSize = 150 * 1024 * 1024 
    if (fileSize > maxSize) {
      return NextResponse.json({ error: 'Ukuran file melampaui batas maksimal 150MB.' }, { status: 413 })
    }

    // 31. Setup Supabase Bucket Audio
    const key = `${userId}/${Date.now()}-${fileName}`
    const uploadUrl = await generateUploadUrl('audio-exports', key, mimeType)

    return NextResponse.json({ success: true, uploadUrl, key })
  } catch (error) {
    console.error('Audio upload-url error:', error)
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 })
  }
}
