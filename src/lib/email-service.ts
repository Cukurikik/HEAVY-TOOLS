/**
 * 67. Quota Alert System
 * Mock email service to send a notification when the user's quota drops <= 10%.
 * Typically integrates with Resend, SendGrid, or AWS SES.
 */
export async function sendQuotaAlertEmail(userEmail: string, remainingCredits: number) {
  console.log(`[EMAIL SEND] To: ${userEmail}`);
  console.log(`[EMAIL SEND] Subject: Peringatan Kuota AI Omni-Tool Hampir Habis!`);
  console.log(`[EMAIL SEND] Body: Sisa saldo AI Anda tinggal ${remainingCredits} credits. Segera top-up sebelum habis.`);
  
  // In real implementation:
  // await resend.emails.send({ ... })
}
