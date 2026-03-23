import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { trackAiUsage } from '@/lib/token-tracker'
import { withAiFallback } from '@/lib/ai-fallback'

export async function POST(request: NextRequest) {
  try {
    const userId = "dev-user-id"
    
    // 48. Rate limiting
    const allowed = await checkRateLimit(userId, 10)
    if (!allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 })
    }

    const { transcript } = await request.json()

    if (!transcript) {
      return NextResponse.json({ error: 'No transcript provided.' }, { status: 400 })
    }

    // 42. API Proxy Smart Chapter (Gemini 1.5 Pro or similar)
    const prompt = `Based on the following video transcript, divide the video into logical chapters. Provide a JSON array with 'timestamp' (e.g., "00:00") and 'title'. Transcript: ${transcript}`

    const primaryAiCall = async () => {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      })
      if(!resp.ok) throw new Error("Gemini API error")
      const result = await resp.json()
      return result.candidates[0].content.parts[0].text
    }

    const fallbackAiCall = async () => {
      // Mocking fallback logic (e.g. OpenAI)
      return "[{ \"timestamp\": \"00:00\", \"title\": \"Introduction\" }]" 
    }

    // 50. Fallback utilization
    const content = await withAiFallback(primaryAiCall, fallbackAiCall)
    
    // Clean response markup if any (e.g. ```json )
    const rawJson = content.replace(/```json/g, '').replace(/```/g, '')
    const chapters = JSON.parse(rawJson)

    // 49. Token Tracking
    const estimatedTokens = transcript.length / 4
    await trackAiUsage(userId, 'Smart-Chapter', estimatedTokens, estimatedTokens * 0.000001)

    return NextResponse.json({ success: true, chapters })
  } catch (error) {
    console.error('Smart Chapter proxy error:', error)
    return NextResponse.json({ error: 'Internal server error processing chapters' }, { status: 500 })
  }
}
