'use server'

import { db } from '@/lib/db'

// 21. Action saveAudioTaskHistory
export async function saveAudioTaskHistory(data: {
  userId: string;
  toolName: string;
  inputFile?: string;
  outputFile?: string;
  durationMs?: number;
  status: string;
  errorMessage?: string;
}) {
  try {
    const record = await db.audioTaskHistory.create({ data })
    return { success: true, record }
  } catch (error) {
    console.error('saveAudioTaskHistory Error:', error)
    return { error: 'Failed to save audio task history' }
  }
}

// 22. Action getAudioHistory
export async function getAudioHistory(userId: string, limit = 10, offset = 0) {
  try {
    const history = await db.audioTaskHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })
    return { success: true, history }
  } catch (error) {
    return { error: 'Failed to retrieve audio history' }
  }
}

// 23. Action deleteAudioHistory
export async function deleteAudioHistory(id: string, userId: string) {
  try {
    const deleted = await db.audioTaskHistory.deleteMany({
      where: { id, userId }
    })
    return { success: true, deleted }
  } catch (error) {
    return { error: 'Failed to delete history record' }
  }
}

// 24. Action saveAudioPreset
export async function saveAudioPreset(data: {
  userId: string;
  name: string;
  tool: string;
  settings: any;
}) {
  try {
    const preset = await db.audioPreset.create({
      data: { ...data, isGlobal: false }
    })
    return { success: true, preset }
  } catch (error) {
    console.error('saveAudioPreset Error:', error)
    return { error: 'Failed to save custom audio preset' }
  }
}

// 25. Action getCustomAudioPresets
export async function getCustomAudioPresets(userId: string, tool: string) {
  try {
    const presets = await db.audioPreset.findMany({
      where: {
        tool,
        OR: [
          { userId },
          { isGlobal: true }
        ]
      },
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, presets }
  } catch (error) {
    return { error: 'Failed to get audio presets' }
  }
}

// 26. Action deleteAudioPreset
export async function deleteAudioPreset(id: string, userId: string) {
  try {
    await db.audioPreset.deleteMany({ where: { id, userId } })
    return { success: true }
  } catch (error) {
    return { error: 'Failed to delete audio preset' }
  }
}

// 27. Action saveMasteringChain
export async function saveMasteringChain(userId: string, name: string, chain: any[]) {
  try {
    const masteringTemplate = await db.masteringChain.create({
      data: { userId, name, chain, isGlobal: false }
    })
    return { success: true, masteringTemplate }
  } catch (error) {
    console.error('saveMasteringChain Error:', error)
    return { error: 'Failed to save mastering chain' }
  }
}

// 28. Action getMasteringChains
export async function getMasteringChains(userId: string) {
  try {
    const chains = await db.masteringChain.findMany({
      where: {
        OR: [
          { userId },
          { isGlobal: true }
        ]
      },
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, chains }
  } catch (error) {
    return { error: 'Failed to get mastering chains' }
  }
}

// 29. Action pinAudioToCloud
export async function pinAudioToCloud(id: string, userId: string) {
  try {
    await db.cloudAudio.updateMany({
      where: { id, userId },
      data: { isPinned: true }
    })
    return { success: true }
  } catch (error) {
    return { error: 'Failed to pin audio' }
  }
}

// 30. Action unpinAudioFromCloud
export async function unpinAudioFromCloud(id: string, userId: string) {
  try {
    await db.cloudAudio.updateMany({
      where: { id, userId },
      data: { isPinned: false }
    })
    return { success: true }
  } catch (error) {
    return { error: 'Failed to unpin audio' }
  }
}

// 38. Action deleteCloudAudio
export async function deleteCloudAudio(id: string, userId: string) {
  try {
    const record = await db.cloudAudio.findFirst({ where: { id, userId } })
    if(!record) return { error: 'Not found' }
    
    // In actual implementation, we'd call the S3 deleteObject hook here
    // await deleteCloudObject('audio-exports', record.fileName)

    await db.cloudAudio.delete({ where: { id: record.id } })

    // Log deletion
    await db.auditLog.create({
      data: {
        tableName: 'CloudAudio',
        recordId: id,
        userId: userId,
        action: 'DELETE',
        details: { fileName: record.fileName }
      }
    })

    return { success: true }
  } catch (error) {
    return { error: 'Failed to delete cloud audio' }
  }
}

