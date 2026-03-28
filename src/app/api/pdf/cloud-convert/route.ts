import { NextRequest, NextResponse } from 'next/server'
import { serverlessPdfClient } from '@/lib/serverless-pdf'

/**
 * 52. API cloud-pdf-convert
 * Single Gateway Endpoint replacing all individual SaaS conversion endpoints.
 */
export async function POST(request: NextRequest) {
  try {
    const { fileUrl, operation, options, pageCount } = await request.json()

    // 60. Cost Limiter Cloud (PDF >500 halaman)
    if (pageCount && pageCount > 500) {
      return NextResponse.json({ 
        error: 'Dokumen di atas 500 halaman tidak didukung di proxy gratis. Harap operasikan via mode Lokal (WASM).' 
      }, { status: 413 })
    }

    // Identify fallback target (55, 56, 57, 58)
    let payload = { fileUrl, options }
    const validOperations = [
      'compress-ghostscript', // 55
      'pdf-to-excel',         // 56
      'pdf-to-ppt',           // 57
      'html-to-pdf'           // 58
    ]

    if (!validOperations.includes(operation)) {
      return NextResponse.json({ error: 'Operasi konversi dokumen tidak valid.' }, { status: 400 })
    }

    const result = await serverlessPdfClient.runJob(operation, payload)

    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghubungi server PDF' }, { status: 500 })
  }
}
