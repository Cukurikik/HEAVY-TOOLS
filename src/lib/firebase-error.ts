/**
 * 59. Firebase Cloud Error Handler
 * Translates FFmpeg or GCP Cloud Function error codes into user-friendly UI alerts.
 */
export function handleFirebaseEncodeError(errorCode: string | number, rawMessage: string) {
  if (typeof errorCode === 'number' && errorCode === 137) {
      return "Tugas terlalu berat, memori cloud tidak cukup. Coba kurangi resolusi atau bitrate.";
  }
  
  const msg = rawMessage.toLowerCase();
  if (msg.includes('invalid data found')) {
      return "File video korup atau format tidak didukung oleh Cloud Engine.";
  }
  if (msg.includes('timeout')) {
      return "Waktu proses di cloud habis (timeout). Gunakan durasi video yang lebih pendek.";
  }
  
  return "Terjadi kegagalan server cloud. Silakan coba lagi nanti.";
}
