'use server'

import { sendQuotaAlertEmail } from '@/lib/email-service'

interface UserMock {
  id: string;
  tier: string;
  audioAiCredits: number;
  maxAudioAiCredits: number;
}

// 65. Action getAudioQuota
export async function getAudioQuota(userId: string) {
  try {
    // In a real app we'd query db.user.findUnique
    const user = { id: userId, tier: 'FREE', audioAiCredits: 50, maxAudioAiCredits: 100 } 
    return { 
      success: true, 
      tier: user.tier,
      audioAiCredits: user.audioAiCredits,
      bitrateEnforced: user.tier === 'FREE' // 69. Bitrate Enforcement Flag
    }
  } catch (error) {
    return { error: 'Failed to fetch audio quota' }
  }
}

// 64. Credit Deduction API (Audio)
export async function deductAudioCredits(userId: string, amount: number) {
  try {
    // const user = await db.user.findUnique(...)
    const user: UserMock = { id: userId, tier: 'FREE', audioAiCredits: 12, maxAudioAiCredits: 100 }
    
    if (user.audioAiCredits < amount) {
      return { error: 'Insufficient Audio AI credits. Please upgrade or top up.' }
    }

    const newBalance = user.audioAiCredits - amount;
    
    // await db.user.update({ where: { id: userId }, data: { audioAiCredits: newBalance } })

    // 67. Quota Alert System (Audio)
    const remainingPercentage = (newBalance / user.maxAudioAiCredits) * 100;
    if (remainingPercentage <= 10 && remainingPercentage > 0) {
      await sendQuotaAlertEmail("dummy@email.com", newBalance);
    }

    return { success: true, newBalance }
  } catch (error) {
    return { error: 'Failed to deduct audio credits' }
  }
}
