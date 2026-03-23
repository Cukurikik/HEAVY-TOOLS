import { db } from '@/lib/db'

/**
 * 49. Token Tracking Video
 * Logs usage of AI models (e.g., audio seconds for Whisper, tokens for Gemini) 
 * for billing and telemetry analysis.
 */
export async function trackAiUsage(
  userId: string, 
  toolName: string, 
  usageValue: number, // e.g. seconds of audio or number of tokens
  costEstimate: number
) {
  try {
    // Storing in VideoAnalytics table (Task 15)
    await db.videoAnalytics.create({
      data: {
        sessionId: userId, // Reusing sessionId for user ID in telemetry
        toolName,
        processTimeMs: usageValue, // Reusing field to store usage magnitude
        success: true,
        errorMessage: `Cost Est: $${costEstimate.toFixed(5)}` // Storing cost loosely
      }
    })
  } catch (e) {
    console.error("Failed to track AI usage:", e)
  }
}
