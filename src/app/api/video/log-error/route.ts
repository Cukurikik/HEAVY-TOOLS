import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { anonymizeIp } from '@/lib/privacy'

/**
 * 83. WASM Crash Logger
 * 89. Browser Support Logger (SharedArrayBuffer)
 * Endpoint for client FFmpeg instances to report fatal errors like OOM or SAB missing.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { errorType, errorMessage, userAgent, url } = body
    
    // Get IP address for rough generalized regional statistics (hashing it to comply with privacy laws)
    const rawIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '0.0.0.0'
    const safeIp = anonymizeIp(rawIp)

    // Log the error into the database
    // Reusing AuditLog or a specific ErrorLog table (mapped conceptually to VideoAnalytics with failed status)
    await db.videoAnalytics.create({
      data: {
        sessionId: safeIp,
        toolName: errorType === 'SAB_MISSING' ? 'SYSTEM_CHECK' : 'WASM_ENGINE',
        processTimeMs: 0,
        success: false,
        errorMessage: `${errorType}: ${errorMessage} | UA: ${userAgent.substring(0, 50)}`,
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Crash logger failed:', error)
    return NextResponse.json({ error: 'Internal server error while logging crash' }, { status: 500 })
  }
}
