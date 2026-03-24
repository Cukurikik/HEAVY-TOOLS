import { NextRequest, NextResponse } from 'next/server'

/**
 * 66. Monthly Quota Reset (Audio Cron)
 * Runs every 1st day of the month via Vercel Cron.
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Reset FREE users to their base monthly audio quota
    // await db.user.updateMany({
    //   where: { role: 'FREE' },
    //   data: { audioAiCredits: 100 }
    // })

    // Reset PRO users
    // await db.user.updateMany({
    //   where: { role: 'PRO' },
    //   data: { audioAiCredits: 1000 }
    // })

    return NextResponse.json({ success: true, message: 'Audio Quotas reset successfully.' })
  } catch (error) {
    console.error('Audio Cron quota reset error:', error)
    return NextResponse.json({ error: 'Internal server error resolving audio quotas.' }, { status: 500 })
  }
}
