import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * 36. Storage Webhook Listener (Audio)
 * Designed to catch Supabase INSERT triggers into `storage.objects` 
 * where bucket_id = 'audio-exports'.
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    // payload usually depends on Supabase webhooks shape
    const { record } = payload
    
    if (record && record.bucket_id === 'audio-exports') {
      const pathParts = record.name.split('/')
      const userId = pathParts[0]

      // Extract filename
      const fileName = pathParts.slice(1).join('/')
      const fileUrl = `https://${process.env.SUPABASE_REGION}.supabase.co/storage/v1/object/public/audio-exports/${record.name}`
      
      await db.cloudAudio.create({
        data: {
          userId,
          fileName,
          fileUrl,
          sizeBytes: BigInt(record.metadata?.size || 0),
          mimeType: record.metadata?.mimetype || 'audio/unknown'
        }
      })

      return NextResponse.json({ success: true, indexed: true })
    }
    
    return NextResponse.json({ success: true, ignored: true })
  } catch (error) {
    console.error('Storage Audio Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error listening to storage' }, { status: 500 })
  }
}
