import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// 86. Privacy Filter (Sanitize filenames)
function sanitizeFilename(name: string) {
  return name.replace(/[a-zA-Z0-9]/g, '*').substring(0, 10) + '.pdf'
}

/**
 * 81-84, 87-89. Telemetry Collector Endpoint
 * Silently records performance metrics from the Client Side (WASM RAM profiling, Errors).
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    
    // Privacy sanitizations applied immediately
    const safeFileName = payload.fileName ? sanitizeFilename(payload.fileName) : 'Anonymous.pdf'

    // Write to Prisma Database (Task 15: PdfAnalytics schema)
    await db.pdfAnalytics.create({
      data: {
        sessionId: payload.sessionId || 'anonymous-device',
        toolName: payload.toolName || 'unknown-pdf-tool',
        processTimeMs: payload.durationMs || 0,
        pageCount: payload.pageCount || 1,
        fileSizeBytes: payload.fileSizeBytes || 0,
        success: payload.success ?? true,
        errorMessage: payload.errorMessage || null
      }
    })

    // Additional Logging for RAM and Browser Device Stats
    if (payload.ramUsageMB > 500) {
      console.warn(`[PDF Telemetry] ALARM: High Memory usage detected in ${payload.toolName}: ${payload.ramUsageMB}MB`);
    }

    return NextResponse.json({ recorded: true })
  } catch (error) {
    return NextResponse.json({ error: 'Telemetry drop' }, { status: 500 })
  }
}
