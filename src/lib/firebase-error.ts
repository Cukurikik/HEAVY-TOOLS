/**
 * 59. Firebase Cloud Error Handler
 * Translates FFmpeg or GCP Cloud Function error codes into user-friendly UI alerts.
 */
export function handleFirebaseEncodeError(errorCode: string | number | undefined, rawMessage: string | undefined): string {
  if (typeof errorCode === 'number' && errorCode === 137) {
      return "Tugas terlalu berat, memori cloud tidak cukup. Coba kurangi resolusi atau bitrate.";
  }

  const msg = (rawMessage || '').toLowerCase();

  if (errorCode === 413 || msg.includes('payload too large') || msg.includes('memory')) {
    return 'File terlalu berat untuk ukuran memori cloud saat ini. Mohon gunakan ukuran yang lebih kecil.';
  }

  if (msg.includes('unsupported codec') || msg.includes('invalid data')) {
    return 'Format file tidak didukung atau korup. Coba konversi file ini sebelum diproses.';
  }

  if (msg.includes('timeout') || errorCode === 504) {
    return 'Waktu proses di cloud habis. Coba lagi dalam beberapa saat.';
  }

  return 'Gagal memproses di server cloud. Kami sedang menyelidikinya.';
}
