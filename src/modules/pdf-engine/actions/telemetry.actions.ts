'use server'

import { db } from '@/lib/db'

const MOCK_ADMIN_ID = "admin-role"

// 85. Action getAnalyticsDashboard
export async function getPdfAnalyticsDashboard() {
  try {
    // Collect broad aggregate metrics securely over the Postgres server instance
    const [totalProcessed, avgProcessingTime, errorRates] = await Promise.all([
      db.pdfAnalytics.count(),
      db.pdfAnalytics.aggregate({
        _avg: { processTimeMs: true, pageCount: true }
      }),
      db.pdfAnalytics.groupBy({
        by: ['toolName', 'success'],
        _count: { success: true }
      })
    ])

    return { 
      success: true, 
      data: { totalProcessed, avgProcessingTime, errorRates } 
    }
  } catch (err) {
    return { success: false, error: 'Dashboard Error' }
  }
}

// 90. Export Analytics (CSV)
export async function exportPdfAnalyticsCsv(): Promise<string> {
  try {
    const records = await db.pdfAnalytics.findMany({
      orderBy: { createdAt: 'desc' },
      take: 1000 // Sample limit
    })

    const header = "ID,Tool,TimeMs,Pages,Success,Date\n"
    const rows = records.map(r => 
      `${r.id},${r.toolName},${r.processTimeMs},${r.pageCount},${r.success},${r.createdAt.toISOString()}`
    ).join('\n')

    return header + rows
  } catch (e) {
    return "Error generating CSV"
  }
}
