// Requires `web-push` package
// import webpush from 'web-push'

/**
 * 79. Web Push Notification
 * Setup VAPID keys for sending native OS push notifications.
 * Typically these keys are generated once using `webpush.generateVAPIDKeys()` 
 * and stored in environment variables.
 */

/*
webpush.setVapidDetails(
  'mailto:support@omni-tool.app',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)
*/

export async function sendPushNotification(subscription: any, payload: any) {
  try {
    console.log(`[PUSH NOTIFICATION] Sending to client component...`)
    console.log(JSON.stringify(payload))
    
    // await webpush.sendNotification(subscription, JSON.stringify(payload))
    return { success: true }
  } catch (error) {
    console.error('Error sending push notification', error)
    return { error: 'Push failed' }
  }
}
