export interface UserSubscription {
  tier: 'FREE' | 'PRO' | 'ENTERPRISE';
  aiCredits: number;
  monthlyVideoExports: number;
}

/**
 * Validates if the user is allowed to perform specific premium actions.
 */
export function premiumGuard(userStatus: UserSubscription | null, action: string, context?: any) {
  const tier = userStatus?.tier || 'FREE';

  // 61. Premium Guard (4K Export)
  if (action === 'export:4k' && tier === 'FREE') {
    throw new Error('Resolusi 4K hanya tersedia untuk pengguna PRO. Silakan upgrade paket Anda.');
  }

  // 62. Premium Guard (Batch Processing)
  if (action === 'batch:process' && tier === 'FREE') {
    const fileCount = context?.fileCount || 1;
    if (fileCount > 3) {
      throw new Error('Pengguna FREE maksimal dapat memproses 3 video sekaligus dalam mode Batch. Silakan upgrade.');
    }
  }

  // 63. Premium Guard (Pro Editor Codec)
  if (action === 'export:pro-codec' && tier === 'FREE') {
    const codec = context?.codec;
    if (['prores', 'av1', 'dnxhd'].includes(codec?.toLowerCase())) {
      throw new Error(`Codec profesional ${codec} terkunci untuk pengguna PRO.`);
    }
  }

  // 69. Watermark Enforcement Flag
  // If true, the frontend must append the watermark filter into FFmpeg args
  if (action === 'watermark:enforcement') {
    return tier === 'FREE'; 
  }

  return true;
}
