'use server'

/**
 * FASE 7: QUOTA MANAGEMENT (61-70)
 * Server Actions monitoring global PDF operations enforcing Premium guards and Credit limits.
 */

// Mock User DB check
let MOCK_USER_PLAN: string = 'FREE'; // Could be 'PRO'
let MOCK_AI_CREDITS: number = 15;

// 65. Action getPdfQuota
export async function getPdfQuota() {
  return {
    success: true,
    data: {
      plan: MOCK_USER_PLAN,
      aiCreditsLeft: MOCK_AI_CREDITS,
      
      // 61. Premium Guard (Page Limit >50 hal)
      maxPagesPerDoc: MOCK_USER_PLAN === 'FREE' ? 50 : 5000,
      
      // 62. Premium Guard (Batch Processing max 3)
      maxBatchFiles: MOCK_USER_PLAN === 'FREE' ? 3 : 50,
      
      // 63. Premium Guard (OCR & AI Advance)
      isAiAdvanceUnlocked: MOCK_USER_PLAN === 'PRO',
      
      // 69. Watermark Enforcement Flag (Free user)
      forceSystemWatermark: MOCK_USER_PLAN === 'FREE',

      // 70. Feature Flagging PDF (Emergency killswitch)
      features: {
        pdfToWordEnabled: true,
        pdfSummarizerEnabled: true
      }
    }
  }
}

// 64. Credit Deduction API (PDF)
export async function deductPdfCredits(amount: number) {
  if (MOCK_USER_PLAN === 'PRO') return { success: true, remaining: 999 };
  
  if (MOCK_AI_CREDITS < amount) {
    return { success: false, error: 'Kredit AI tidak cukup. Silahkan upgrade.' };
  }
  
  // db.user.update(...)
  
  // 67. Quota Alert System (PDF email limit)
  if (MOCK_AI_CREDITS - amount <= 2) {
    console.log("TRIGGER: Menyiapkan email notifikasi limit kredit 10% ke user...");
  }
  
  return { success: true, remaining: MOCK_AI_CREDITS - amount };
}
