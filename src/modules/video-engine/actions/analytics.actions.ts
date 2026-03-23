'use server'

import { db } from '@/lib/db'
import { anonymizeUserId } from '@/lib/privacy'

interface TelemetryPayload {
  userId?: string;
  toolName: string;
  processTimeMs: number;
  inputFormat?: string;
  outputFormat?: string;
  resolution?: string; // e.g. "1080p", "4K"
  fileSizeBytes?: number;
}

/**
 * Server Actions for capturing analytics from the client after successful local rendering.
 * Covers Tasks 81, 82, 84, 85, 86.
 */
export async function logVideoTelemetry(data: TelemetryPayload) {
  try {
    const safeSessionId = data.userId ? anonymizeUserId(data.userId) : 'anonymous'

    // Extensively packing resolution and filesize into the DB schema
    // In our schema.prisma we defined: inputFormat, outputFormat
    // For resolution and size, we merge them into outputFormat or a JSON details column.
    // We'll map them carefully:
    const mergedDetails = `Res:${data.resolution || 'unknown'}|Size:${data.fileSizeBytes || 0}`

    await db.videoAnalytics.create({
      data: {
        sessionId: safeSessionId,
        toolName: data.toolName, // 81. Tool Usage Tracker
        processTimeMs: data.processTimeMs, // 82. Performance Telemetry
        inputFormat: data.inputFormat, // 84. Format Analytics (Input/Output)
        outputFormat: `${data.outputFormat || 'unknown'} | ${mergedDetails}`, // 85 & 86. Resolution and File Size
        success: true,
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Telemetry logging failed:', error)
    return { error: 'Failed to save telemetry data' }
  }
}
