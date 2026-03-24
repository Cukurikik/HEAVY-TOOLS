/**
 * 77. System Notification Action (Audio Done)
 * 78. Email Alert Notifier (Audio Selesai)
 * Handles outbound asynchronous notifications.
 */

export async function sendAudioDoneEmail(userEmail: string, audioTitle: string, downloadUrl: string) {
  console.log(`[EMAIL DISPATCH] To: ${userEmail}`);
  console.log(`Subject: Audio Processing Selesai - ${audioTitle}`);
  console.log(`Body: File audio kamu berhasil diproses. Download di sini: ${downloadUrl}`);
  // e.g. await resend.emails.send({...})
}

export async function sendAudioDonePushNotification(fcmToken: string, audioTitle: string) {
  console.log(`[FCM PUSH] Sending push to device... Title: ${audioTitle} is ready.`);
  // e.g. await admin.messaging().send({ token: fcmToken, notification: { title: 'Audio Selesai', body: '...' } })
}
