import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { trackAiUsage } from '@/lib/token-tracker'

export async function POST(request: NextRequest) {
  try {
    const userId = "dev-user-id" // Replace with actual auth logic
    
    // 48. Rate limiting
    const allowed = await checkRateLimit(userId, 5) // Map tier to limit (e.g. 5 for Free)
    if (!allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded for AI Video tools.' }, { status: 429 })
    }

    const formData = await request.formData()
    const audioFile = formData.get('audio') as Blob | null

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided.' }, { status: 400 })
    }

    // Proxy the request to OpenAI's Whisper (or Groq Whisper)
    // 41. API Proxy Auto-Subtitle
    const openAiData = new FormData()
    openAiData.append('file', audioFile, 'audio.webm')
    openAiData.append('model', 'whisper-1')
    openAiData.append('response_format', 'srt') // e.g. SRT or VTT

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: openAiData
    })

    if (!response.ok) {
        const err = await response.text()
        throw new Error(`Whisper API Error: ${err}`)
    }

    const srtContent = await response.text()

    // 49. Token Tracking
    // Approx cost tracking (e.g., $0.006 / minute for Whisper)
    // Assuming audio file size correlates with length roughly, ideally we extract duration
    const estimatedSeconds = (audioFile.size / 1024 / 1024) * 60 // Rough guestimate based on 1MB/min
    await trackAiUsage(userId, 'Auto-Subtitle', estimatedSeconds, (estimatedSeconds / 60) * 0.006)

    return new NextResponse(srtContent, {
      headers: { 'Content-Type': 'text/plain' }
    })
  } catch (error) {
    console.error('Auto-Subtitle proxy error:', error)
    return NextResponse.json({ error: 'Internal server error processing subtitle' }, { status: 500 })
  }
}
