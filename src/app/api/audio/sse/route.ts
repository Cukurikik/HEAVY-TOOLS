import { NextRequest, NextResponse } from 'next/server'

/**
 * 76. Server-Sent Events (SSE) Fallback Audio
 * If corporate firewalls block WebSockets (wss://), 
 * the UI can fallback to this HTTP SSE stream.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue('event: connected\ndata: {"status": "ok"}\n\n')
      
      // We would attach to an emitter or Redis pub/sub here
      const interval = setInterval(() => {
         // Ping to keep connection alive
         controller.enqueue('event: ping\ndata: {}\n\n')
      }, 15000)

      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        controller.close()
      })
    }
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    }
  })
}
