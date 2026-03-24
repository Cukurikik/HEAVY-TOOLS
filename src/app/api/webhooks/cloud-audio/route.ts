import { NextRequest, NextResponse } from 'next/server'
import { broadcastVideoEvent } from '@/lib/realtime'
import { handleAudioCloudError } from '@/lib/audio-cloud-error'

/**
 * 53. Serverless Webhook Listener (Audio)
 * Hears from the serverless compute clusters (like Replicate/Vercel workers)
 * when a heavy audio extraction or conversion finishes.
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    // Suppose format: { jobId: '...', status: 'success'|'error', outputUrl: '...', errorCode?: number, errorMsg?: string }
    const { jobId, status, outputUrl, errorCode, errorMsg } = payload

    if (status === 'success') {
      await broadcastVideoEvent('global_or_derived_userId', jobId, 'COMPLETE', { outputUrl })
    } else if (status === 'error') {
      // 59. Cloud Error Handler (Audio)
      const friendlyError = handleAudioCloudError(errorCode, errorMsg)
      await broadcastVideoEvent('global_or_derived_userId', jobId, 'ERROR', { message: friendlyError })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error in audio webhook' }, { status: 500 })
  }
}
