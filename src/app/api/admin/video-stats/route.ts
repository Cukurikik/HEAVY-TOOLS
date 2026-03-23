import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * 88. Admin Dashboard API
 * Secure endpoint serving aggregated data to the Omni-Tool Admin Panel.
 */
export async function GET(request: NextRequest) {
  try {
    // Basic Admin validation (e.g. from cookies/session or static token)
    const adminToken = request.headers.get('x-admin-token')
    if (adminToken !== process.env.ADMIN_SECRET_TOKEN) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    // Fetch total tasks
    const totalProcessed = await db.videoTaskHistory.count()
    
    // Fetch tool popularity
    const toolGrouped = await db.videoTaskHistory.groupBy({
      by: ['toolName'],
      _count: { toolName: true },
      orderBy: { _count: { toolName: 'desc' } },
      take: 10
    })

    // Fetch recent crashes / WASM errors
    const recentErrors = await db.videoAnalytics.findMany({
      where: { success: false },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    return NextResponse.json({
      success: true,
      data: {
        totalProcessed,
        popularTools: toolGrouped,
        recentErrors
      }
    })
  } catch (error) {
    console.error('Admin API error:', error)
    return NextResponse.json({ error: 'Internal server error fetching admin stats.' }, { status: 500 })
  }
}
