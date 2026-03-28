import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * 71. Setup SSE Endpoint (/api/pdf/events)
 * Standard HTTP Server-Sent Events implementation, heavily robust against Corporate Firewalls 
 * that typically block WebSocket upgrades (wss://).
 */
export async function GET(request: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      // 78. Connection Recovery Logic
      controller.enqueue('event: connected\ndata: {"status":"active"}\n\n')
      
      // Ping interval to keep connection strictly alive across load balancers
      const interval = setInterval(() => {
        controller.enqueue(': heartbeat\n\n')
      }, 15000)

      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        controller.close()
        console.log('[SSE] Client disconnected normally.')
      })
    }
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no' // Prevent NGINX from buffering SSE stream
    }
  })
}
