import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// This endpoint receives Supabase storage webhooks 
// Setup in Supabase: Database -> Webhooks -> Trigger on INSERT to storage.objects table
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()

    if (payload.type === 'INSERT' && payload.table === 'objects') {
      const record = payload.record
    
      // Example record structure from Supabase
      // { name: 'user-id/file-name.mp4', bucket_id: 'video-exports', ... }
      if (record.bucket_id === 'video-exports') {
        const parts = record.name.split('/')
        if (parts.length >= 2) {
          const userId = parts[0]
          const fileName = parts.slice(1).join('/')
          
          await db.cloudVideo.create({
            data: {
              userId,
              fileName,
              fileUrl: record.name, // Usually the S3 key, we can construct the full URL later
              sizeBytes: record.metadata?.size || 0,
              mimeType: record.metadata?.mimetype || 'application/octet-stream',
              isPinned: false
            }
          })
          
          return NextResponse.json({ success: true, message: 'CloudVideo record created' })
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Ignored webhook payload' })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Internal server error processing webhook' }, { status: 500 })
  }
}
