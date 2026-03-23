import { NextRequest, NextResponse } from 'next/server'
import { generateUploadUrl } from '@/lib/storage'
// import { auth } from '@/lib/auth' 

const MAX_FREE_SIZE_BYTES = 500 * 1024 * 1024 // 500 MB
const ALLOWED_MIME_TYPES = ['video/mp4', 'video/webm', 'video/x-matroska', 'video/quicktime', 'audio/mpeg']

export async function POST(request: NextRequest) {
  try {
    // const session = await auth()
    // if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // For local dev, hardcoding a user ID
    const userId = "dev-user-id"

    const body = await request.json()
    const { fileName, fileSize, mimeType } = body

    // 34. MIME Validation Server
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json({ error: 'Invalid file type. Only video files are allowed.' }, { status: 400 })
    }

    // 35. Size Limit Enforcement
    // Assume user tier is FREE for now. If PRO, we can bump this to 2GB or 10gb.
    const isPro = false 
    const maxAllowedSize = isPro ? 2000 * 1024 * 1024 : MAX_FREE_SIZE_BYTES
    
    if (fileSize > maxAllowedSize) {
      return NextResponse.json({ error: `File size exceeds the limit of ${maxAllowedSize / (1024 * 1024)} MB for your tier.` }, { status: 413 })
    }

    const uploadUrl = await generateUploadUrl(fileName, mimeType, userId)
    
    return NextResponse.json({
      success: true,
      uploadUrl,
      key: `${userId}/${fileName}`
    })
  } catch (error) {
    console.error('Upload URL generation error:', error)
    return NextResponse.json({ error: 'Internal server error generating upload URL' }, { status: 500 })
  }
}
