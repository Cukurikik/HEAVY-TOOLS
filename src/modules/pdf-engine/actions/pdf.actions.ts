'use server'

import { db } from '@/lib/db'
import { z } from 'zod'
import { 
  pdfHistorySchema, 
  pdfSignatureSchema, 
  pdfWatermarkSchema, 
  pinCloudPdfSchema 
} from '@/lib/validators/pdf'

const MOCK_USER_ID = "dev-user-id" // Replace with actual Auth session hook later

// 21. Action savePdfTaskHistory
export async function savePdfTaskHistory(payload: z.infer<typeof pdfHistorySchema>) {
  try {
    const data = pdfHistorySchema.parse(payload)
    const task = await db.pdfTaskHistory.create({
      data: {
        userId: MOCK_USER_ID,
        ...data
      }
    })
    return { success: true, data: task }
  } catch (error) {
    return { success: false, error: 'Failed to save PDF task history' }
  }
}

// 22. Action getPdfHistory
export async function getPdfHistory(page = 1, limit = 20) {
  try {
    const skip = (page - 1) * limit
    const [history, total] = await Promise.all([
      db.pdfTaskHistory.findMany({
        where: { userId: MOCK_USER_ID },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      db.pdfTaskHistory.count({ where: { userId: MOCK_USER_ID } })
    ])
    return { success: true, data: { history, total, pages: Math.ceil(total / limit) } }
  } catch (error) {
    return { success: false, error: 'Failed to fetch PDF history' }
  }
}

// 23. Action deletePdfHistory
export async function deletePdfHistory(taskId: string) {
  try {
    await db.pdfTaskHistory.delete({
      where: { id: taskId, userId: MOCK_USER_ID }
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete PDF task history' }
  }
}

// 24. Action saveSignatureTemplate
export async function saveSignatureTemplate(payload: z.infer<typeof pdfSignatureSchema>) {
  try {
    const data = pdfSignatureSchema.parse(payload)
    const signature = await db.pdfSignatureTemplate.create({
      data: {
        userId: MOCK_USER_ID,
        ...data
      }
    })
    return { success: true, data: signature }
  } catch (error) {
    return { success: false, error: 'Failed to save PDF signature' }
  }
}

// 25. Action getSignatureTemplates
export async function getSignatureTemplates() {
  try {
    const signatures = await db.pdfSignatureTemplate.findMany({
      where: { userId: MOCK_USER_ID },
      orderBy: { createdAt: 'desc' } // Newest first
    })
    return { success: true, data: signatures }
  } catch (error) {
    return { success: false, error: 'Failed to fetch PDF signatures' }
  }
}

// 26. Action deleteSignatureTemplate
export async function deleteSignatureTemplate(signatureId: string) {
  try {
    await db.pdfSignatureTemplate.delete({
      where: { id: signatureId, userId: MOCK_USER_ID }
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete PDF signature' }
  }
}

// 27. Action saveWatermarkTemplate
export async function saveWatermarkTemplate(payload: z.infer<typeof pdfWatermarkSchema>) {
  try {
    const data = pdfWatermarkSchema.parse(payload)
    const watermark = await db.pdfWatermarkTemplate.create({
      data: {
        userId: MOCK_USER_ID,
        ...data
      }
    })
    return { success: true, data: watermark }
  } catch (error) {
    return { success: false, error: 'Failed to save watermark preset' }
  }
}

// 28. Action getWatermarkTemplates
export async function getWatermarkTemplates() {
  try {
    const watermarks = await db.pdfWatermarkTemplate.findMany({
      where: { userId: MOCK_USER_ID },
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, data: watermarks }
  } catch (error) {
    return { success: false, error: 'Failed to fetch watermark presets' }
  }
}

// 29 & 30. Action pinPdfToCloud & unpinPdfFromCloud
export async function togglePinCloudPdf(payload: z.infer<typeof pinCloudPdfSchema>) {
  try {
    const data = pinCloudPdfSchema.parse(payload)
    const file = await db.cloudPdfFile.update({
      where: { id: data.fileId, userId: MOCK_USER_ID },
      data: { isPinned: data.isPinned }
    })
    return { success: true, data: file }
  } catch (error) {
    return { success: false, error: 'Failed to toggle cloud PDF pinning status' }
  }
}

// 38. Action deleteCloudPdf
export async function deleteCloudPdf(fileId: string) {
  try {
    await db.cloudPdfFile.delete({
      where: { id: fileId, userId: MOCK_USER_ID }
    })
    // NOTE: Physical cleanup is deferred to the 24hr unpinned Cron or custom trigger to preserve atomicity
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete Cloud PDF record' }
  }
}
