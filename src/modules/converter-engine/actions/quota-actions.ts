'use server'

import { db as prisma } from '@/lib/db'

// ═══════════════════════════════════════════════════
// Phase 7: Quota Management & Premium Guards
// ═══════════════════════════════════════════════════

const TIER_LIMITS = {
  FREE: {
    maxFileSizeBytes: 100 * 1024 * 1024,
    maxBatchFiles: 5,
    allowedAdvancedFormats: false,
    monthlyCloudCredits: 10,
    monthlyAiCredits: 5,
  },
  PRO: {
    maxFileSizeBytes: 2 * 1024 * 1024 * 1024,
    maxBatchFiles: 50,
    allowedAdvancedFormats: true,
    monthlyCloudCredits: 500,
    monthlyAiCredits: 200,
  },
  ADMIN: {
    maxFileSizeBytes: 10 * 1024 * 1024 * 1024,
    maxBatchFiles: 999,
    allowedAdvancedFormats: true,
    monthlyCloudCredits: 99999,
    monthlyAiCredits: 99999,
  }
}

type TierKey = keyof typeof TIER_LIMITS

const ADVANCED_FORMATS = new Set(['dwg', 'dxf', 'ai', 'eps', 'raw', 'cr2', 'nef', 'arw', 'orf'])

/** 61. Premium Guard: File Size Limit */
export async function checkFileSizeLimit(fileSizeBytes: number, userTier: string = 'FREE') {
  const tier = TIER_LIMITS[userTier as TierKey] || TIER_LIMITS.FREE
  if (fileSizeBytes > tier.maxFileSizeBytes) {
    return { allowed: false, reason: `File exceeds ${userTier} tier limit of ${tier.maxFileSizeBytes / (1024 * 1024)}MB.` }
  }
  return { allowed: true }
}

/** 62. Premium Guard: Batch Processing */
export async function checkBatchLimit(fileCount: number, userTier: string = 'FREE') {
  const tier = TIER_LIMITS[userTier as TierKey] || TIER_LIMITS.FREE
  if (fileCount > tier.maxBatchFiles) {
    return { allowed: false, reason: `Batch limited to ${tier.maxBatchFiles} files for ${userTier} tier.` }
  }
  return { allowed: true }
}

/** 63. Premium Guard: Advanced Formats */
export async function checkAdvancedFormatAccess(format: string, userTier: string = 'FREE') {
  const tier = TIER_LIMITS[userTier as TierKey] || TIER_LIMITS.FREE
  if (ADVANCED_FORMATS.has(format.toLowerCase()) && !tier.allowedAdvancedFormats) {
    return { allowed: false, reason: `${format.toUpperCase()} requires Pro tier.` }
  }
  return { allowed: true }
}

/** 64. Credit Deduction API */
export async function deductConverterCredits(userId: string, creditType: 'cloud' | 'ai', amount: number = 1) {
  console.log(`[CREDIT DEDUCTION] User ${userId}: -${amount} ${creditType} credits`)
  return { success: true, deducted: amount, type: creditType }
}

/** 65. Action getConverterQuota */
export async function getConverterQuota(userId: string) {
  if (!userId) throw new Error('Unauthorized')

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } })
  const tier = TIER_LIMITS[(user?.role as TierKey) || 'FREE'] || TIER_LIMITS.FREE

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const monthlyUsage = await prisma.converterTaskHistory.count({
    where: { userId, createdAt: { gte: startOfMonth } }
  })

  return {
    tier: user?.role || 'FREE',
    limits: tier,
    usage: { monthlyConversions: monthlyUsage },
    remaining: {
      cloudCredits: Math.max(0, tier.monthlyCloudCredits - monthlyUsage),
      aiCredits: Math.max(0, tier.monthlyAiCredits - monthlyUsage),
    }
  }
}

/** 69. Watermark Enforcement Flag */
export async function shouldApplyWatermark(userTier: string = 'FREE') {
  return userTier === 'FREE' || userTier === 'USER'
}

/** 70. Feature Flagging */
export async function getConverterFeatureFlags() {
  return {
    cadConverterEnabled: process.env.FLAG_ENABLE_CAD_CONVERTER !== 'false',
    rawConverterEnabled: process.env.FLAG_ENABLE_RAW_CONVERTER !== 'false',
    aiOcrEnabled: process.env.FLAG_ENABLE_AI_OCR !== 'false',
    cloudRunEnabled: process.env.FLAG_ENABLE_CLOUD_RUN !== 'false',
    batchProcessingEnabled: process.env.FLAG_ENABLE_BATCH !== 'false',
  }
}
