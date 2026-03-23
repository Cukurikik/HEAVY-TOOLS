'use server'

import { db } from '@/lib/db'

// 21. Action saveVideoTaskHistory
export async function saveVideoTaskHistory(data: {
  userId: string;
  toolName: string;
  inputFile?: string;
  outputFile?: string;
  durationSeconds?: number;
  status?: string;
  errorMessage?: string;
}) {
  try {
    const record = await db.videoTaskHistory.create({ data })
    return { success: true, record }
  } catch (error) {
    return { error: 'Failed to save task history' }
  }
}

// 22. Action getVideoHistory
export async function getVideoHistory(userId: string, skip = 0, take = 20) {
  try {
    const records = await db.videoTaskHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    })
    return { success: true, records }
  } catch (error) {
    return { error: 'Failed to fetch task history' }
  }
}

// 23. Action deleteVideoHistory
export async function deleteVideoHistory(id: string, userId: string) {
  try {
    await db.videoTaskHistory.deleteMany({
      where: { id, userId },
    })
    return { success: true }
  } catch (error) {
    return { error: 'Failed to delete task history' }
  }
}

// 24. Action saveVideoPreset
export async function saveVideoPreset(data: {
  userId: string;
  name: string;
  tool: string;
  settings: any;
}) {
  try {
    const preset = await db.videoPreset.create({
      data: { ...data, isGlobal: false }
    })
    return { success: true, preset }
  } catch (error) {
    return { error: 'Failed to save video preset' }
  }
}

// 25. Action getCustomVideoPresets
export async function getCustomVideoPresets(userId: string, tool?: string) {
  try {
    const presets = await db.videoPreset.findMany({
      where: {
        OR: [{ userId }, { isGlobal: true }],
        ...(tool ? { tool } : {})
      },
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, presets }
  } catch (error) {
    return { error: 'Failed to fetch video presets' }
  }
}

// 26. Action deleteVideoPreset
export async function deleteVideoPreset(id: string, userId: string) {
  try {
    await db.videoPreset.deleteMany({
      where: { id, userId, isGlobal: false },
    })
    return { success: true }
  } catch (error) {
    return { error: 'Failed to delete video preset' }
  }
}

// 27. Action saveWatermarkTemplate
export async function saveWatermarkTemplate(data: {
  userId: string;
  name: string;
  type: string;
  content: string;
  position: string;
  opacity?: number;
  scale?: number;
}) {
  try {
    const template = await db.watermarkTemplate.create({ data })
    return { success: true, template }
  } catch (error) {
    return { error: 'Failed to save watermark template' }
  }
}

// 28. Action getWatermarkTemplates
export async function getWatermarkTemplates(userId: string) {
  try {
    const templates = await db.watermarkTemplate.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, templates }
  } catch (error) {
    return { error: 'Failed to fetch watermark templates' }
  }
}

// 29. Action pinVideoToCloud
export async function pinVideoToCloud(id: string, userId: string) {
  try {
    const video = await db.cloudVideo.updateMany({
      where: { id, userId },
      data: { isPinned: true }
    })
    return { success: true, count: video.count }
  } catch (error) {
    return { error: 'Failed to pin video' }
  }
}

// 30. Action unpinVideoFromCloud
export async function unpinVideoFromCloud(id: string, userId: string) {
  try {
    const video = await db.cloudVideo.updateMany({
      where: { id, userId },
      data: { isPinned: false }
    })
    return { success: true, count: video.count }
  } catch (error) {
    return { error: 'Failed to unpin video' }
  }
}

// 38. Action deleteCloudVideo (Fisik)
export async function deleteCloudVideo(id: string, userId: string) {
  try {
    const video = await db.cloudVideo.findUnique({
      where: { id }
    })
    
    if (video && video.userId === userId) {
      const { deleteCloudObject } = await import('@/lib/storage')
      const key = `${userId}/${video.fileName}`
      await deleteCloudObject(key)
      
      await db.cloudVideo.delete({
        where: { id }
      })
      
      // Log the deletion (Task 20: Audit Log)
      await db.auditLog.create({
        data: {
          tableName: 'CloudVideo',
          recordId: id,
          action: 'DELETE',
          userId,
          details: { fileName: video.fileName }
        }
      })
      
      return { success: true }
    }
    return { error: 'Video not found or forbidden' }
  } catch (error) {
    return { error: 'Failed to delete cloud video' }
  }
}
