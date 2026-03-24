import { db } from '@/lib/db'

/**
 * Audio Telemetry Suite
 * Provides backend logging capabilities specifically tracking the Audio Engine capabilities.
 */

// 81. Tool Usage Tracker (Audio)
// 87. Average Process Time Logger
// 88. Export Format Trends Logger
export async function logAudioToolUsage(toolName: string, processTimeMs: number, inputFormat: string, outputFormat: string, success: boolean) {
  try {
    await db.audioAnalytics.create({
      data: {
        toolName,
        processTimeMs,
        inputFormat,
        outputFormat,
        success
      }
    })
  } catch (error) {
    console.error("Failed to log audio usage:", error)
  }
}

// 82. WASM Crash Logger (Audio)
// 83. ONNX OOM Logger (Audio)
// 86. API Error Rate Monitor 
export async function logAudioCrash(toolName: string, errorContext: string, isOOM: boolean) {
  try {
    const errorPrefix = isOOM ? '[ONNX OOM]' : '[WASM/API CRASH]'
    await db.audioAnalytics.create({
      data: {
        toolName,
        processTimeMs: 0,
        success: false,
        errorMessage: `${errorPrefix} ${errorContext}`
      }
    })
  } catch (error) {
    console.error("Failed to log crash:", error)
  }
}

// 89. Serverless Cloud Fallback Ratio
export async function logCloudFallbackTrigger(toolName: string, reason: string) {
  try {
    await db.audioAnalytics.create({
      data: {
        toolName: `[FALLBACK] ${toolName}`,
        processTimeMs: 0,
        success: true,
        errorMessage: `Triggered by: ${reason}` // Re-using errorMessage column to log reason
      }
    })
  } catch (error) {
    console.error("Failed to log fallback trigger:", error)
  }
}

// 90. Clean Telemetry Action (GDPR)
export async function purgeOldAudioTelemetry() {
  try {
    // Keep last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    await db.audioAnalytics.deleteMany({
      where: {
        createdAt: { lt: thirtyDaysAgo }
      }
    })
    return { success: true }
  } catch (error) {
    console.error("GDPR Audio Purge failed:", error)
    return { error: 'Failed to purge' }
  }
}
