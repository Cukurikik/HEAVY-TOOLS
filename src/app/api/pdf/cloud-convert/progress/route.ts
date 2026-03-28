import { NextRequest, NextResponse } from 'next/server'
import { serverlessPdfClient } from '@/lib/serverless-pdf'

/**
 * 54. Cloud Progress Polling (PDF)
 * Enables UI loading bars to reliably poll active PDF-to-Word background workers
 * in case Server-Sent Events (SSE) connections drop.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')

    if (!jobId) {
      return NextResponse.json({ error: 'Parameter jobId tidak valid' }, { status: 400 })
    }

    const status = await serverlessPdfClient.checkStatus(jobId)

    return NextResponse.json({ success: true, ...status })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengecek status cloud' }, { status: 500 })
  }
}
