'use server'

import { db as prisma } from '@/lib/db'

// Note: In production, auth() would come from NextAuth.js.
// For now, userId is passed as parameter from authenticated frontend.

/**
 * 21. Action saveConverterHistory
 */
export async function saveConverterHistory({
  userId, operation, originalFormat, targetFormat, fileSizeBytes, status, durationMs, errorMessage
}: {
  userId: string; operation: string; originalFormat: string; targetFormat: string; 
  fileSizeBytes: number; status: string; durationMs: number; errorMessage?: string;
}) {
  if (!userId) throw new Error('Unauthorized')

  return await prisma.converterTaskHistory.create({
    data: {
      userId, operation, originalFormat, targetFormat, fileSizeBytes, status, durationMs, errorMessage
    }
  })
}

/**
 * 22. Action getConverterHistory
 */
export async function getConverterHistory(userId: string, limit = 50, offset = 0) {
  if (!userId) throw new Error('Unauthorized')

  return await prisma.converterTaskHistory.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset
  })
}

/**
 * 23. Action deleteConverterHistory
 */
export async function deleteConverterHistory(userId: string, historyId: string) {
  if (!userId) throw new Error('Unauthorized')

  return await prisma.converterTaskHistory.delete({
    where: { id: historyId, userId }
  })
}

/**
 * 24. Action saveConverterPreset
 */
export async function saveConverterPreset({
  userId, name, description, category, config
}: {
  userId: string; name: string; description?: string; category: string; config: any;
}) {
  if (!userId) throw new Error('Unauthorized')

  return await prisma.converterPreset.create({
    data: { userId, name, description, category, config, isDefault: false }
  })
}

/**
 * 25. Action getConverterPresets
 */
export async function getConverterPresets(userId: string) {
  if (!userId) throw new Error('Unauthorized')

  return await prisma.converterPreset.findMany({
    where: {
      OR: [{ userId }, { isDefault: true }]
    },
    orderBy: { createdAt: 'desc' }
  })
}

/**
 * 26. Action deleteConverterPreset
 */
export async function deleteConverterPreset(userId: string, presetId: string) {
  if (!userId) throw new Error('Unauthorized')

  return await prisma.converterPreset.delete({
    where: { id: presetId, userId, isDefault: false }
  })
}

/**
 * 27. Action pinConvertedFile
 */
export async function pinConvertedFile(userId: string, fileId: string) {
  if (!userId) throw new Error('Unauthorized')

  return await prisma.cloudConvertedFile.update({
    where: { id: fileId, userId },
    data: { isPinned: true, expiresAt: null }
  })
}

/**
 * 28. Action unpinConvertedFile
 */
export async function unpinConvertedFile(userId: string, fileId: string) {
  if (!userId) throw new Error('Unauthorized')

  return await prisma.cloudConvertedFile.update({
    where: { id: fileId, userId },
    data: { isPinned: false, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24) }
  })
}

/**
 * 29. Action fetchCurrencyRates
 */
export async function fetchCurrencyRates() {
  const cache = await prisma.exchangeRates.findUnique({ where: { baseCurrency: 'USD' } })
  return cache?.rates || {}
}

/**
 * 30. Action fetchTimezoneData
 */
export async function fetchTimezoneData(timezoneId: string) {
  return await prisma.timezoneOffsets.findUnique({ where: { timezoneId } })
}
