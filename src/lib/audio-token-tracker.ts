import { db } from '@/lib/db'

/**
 * 47. Token/Minute Tracking Audio
 * Logs usage of AI models (e.g., audio seconds for AI Stem Splitter) 
 * for billing and telemetry analysis specifically in the Audio Engine.
 */
export async function trackAudioAiUsage(
  userId: string, 
  toolName: string, 
  usageSeconds: number, 
  costEstimateCents: number
) {
  try {
    await db.audioAnalytics.create({
      data: {
        sessionId: userId, // Mapping user Id to anonymous session ID
        toolName,
        processTimeMs: usageSeconds * 1000, 
        success: true,
        errorMessage: `Cost Est: $${(costEstimateCents / 100).toFixed(5)}`
      }
    })
  } catch (e) {
    console.error("Failed to track Audio AI usage:", e)
  }
}
