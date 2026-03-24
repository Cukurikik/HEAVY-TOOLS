/**
 * 59. Cloud Error Handler (Audio)
 * Translates low-level serverless / FFmpeg codes into localized user-friendly UI alerts.
 */
export function handleAudioCloudError(errorCode?: string | number, rawMessage?: string): string {
  const msg = (rawMessage || '').toLowerCase();
  
  if (errorCode === 413 || msg.includes('payload too large') || msg.includes('memory')) {
    return 'File audio terlalu berat untuk ukuran memori cloud saat ini. Mohon gunakan durasi yang lebih pendek.';
  }

  if (msg.includes('invalid audio sync') || msg.includes('unsupported codec')) {
    return 'Format file audio tidak didukung atau korup. Coba konversi file ini sebelum diproses.';
  }

  if (msg.includes('timeout') || errorCode === 504) {
    return 'Waktu proses di cloud habis. Coba lagi dalam beberapa saat.';
  }

  return 'Gagal memproses audio di server cloud. Kami sedang menyeledikinya.';
}
