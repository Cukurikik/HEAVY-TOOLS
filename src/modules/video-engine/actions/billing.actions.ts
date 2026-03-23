'use server'

import { db } from '@/lib/db'
import { sendQuotaAlertEmail } from '@/lib/email-service'

// Mocking User table for logic demonstration
interface UserMock {
  id: string;
  tier: string;
  aiCredits: number;
  maxAiCredits: number;
}

// 65. Action getVideoQuota
export async function getVideoQuota(userId: string) {
  try {
    // In a real app we'd query db.user.findUnique
    const user = { id: userId, tier: 'FREE', aiCredits: 50, maxAiCredits: 100 } 
    return { 
      success: true, 
      tier: user.tier,
      aiCredits: user.aiCredits,
      watermarkEnforced: user.tier === 'FREE' 
    }
  } catch (error) {
    return { error: 'Failed to fetch quota' }
  }
}

// 64. Credit Deduction API (AI Credits)
export async function deductVideoCredits(userId: string, amount: number) {
  try {
    // const user = await db.user.findUnique(...)
    const user: UserMock = { id: userId, tier: 'FREE', aiCredits: 12, maxAiCredits: 100 }
    
    if (user.aiCredits < amount) {
      return { error: 'Insufficient AI credits. Please upgrade or top up.' }
    }

    const newBalance = user.aiCredits - amount;
    
    // await db.user.update({ where: { id: userId }, data: { aiCredits: newBalance } })

    // 67. Quota Alert System
    const remainingPercentage = (newBalance / user.maxAiCredits) * 100;
    if (remainingPercentage <= 10 && remainingPercentage > 0) {
      await sendQuotaAlertEmail("dummy@email.com", newBalance);
    }

    return { success: true, newBalance }
  } catch (error) {
    return { error: 'Failed to deduct credits' }
  }
}
