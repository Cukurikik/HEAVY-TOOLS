import { NextRequest, NextResponse } from 'next/server'
import { broadcastVideoEvent } from '@/lib/realtime'
// P.S. Can rename broadcastVideoEvent to broadcastRealtimeEvent logically, but for now we reuse.

/**
 * 49. Webhook Listener AI Audio
 * Receives the final result from remote GPU servers for Stem Splitting, etc.
 */
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const tool = searchParams.get('tool') // e.g. stem-splitter
    
    const payload = await request.json()

    // Assuming payload.output contains the result urls
    if (payload.status === 'succeeded' && userId) {
      await broadcastVideoEvent(userId, payload.id, 'COMPLETE', {
         message: `${tool} completion`,
         urls: payload.output
      })
    } else if (payload.status === 'failed' && userId) {
      await broadcastVideoEvent(userId, payload.id, 'ERROR', {
         message: `${tool} failed on cloud`
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('AI Audio Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error listening to webhook' }, { status: 500 })
  }
}
