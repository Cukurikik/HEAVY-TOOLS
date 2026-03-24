import { NextRequest, NextResponse } from 'next/server'
import { withAiFallback } from '@/lib/ai-fallback'

/**
 * 43. API Proxy BPM & Key Detector
 * Proxies Essentia.js cloud instances or Spotify audio analysis API.
 */
export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    if (!url) return NextResponse.json({ error: 'Missing source URL.' }, { status: 400 })

    const primaryScan = async () => {
       // Mock Spotify Audio Features API
       return { bpm: 124, key: 'C Minor' }
    }

    const secondaryScan = async () => {
       // Mock Essentia HTTP API
       return { bpm: 124.5, key: 'Cm' }
    }

    // 48. Fallback AI Logic in action
    const data = await withAiFallback(primaryScan, secondaryScan)

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to analyze BPM & Key' }, { status: 500 })
  }
}
