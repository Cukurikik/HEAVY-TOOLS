export interface WebhookPayload {
  event: 'render:complete' | 'ai:generation:complete' | 'system:crash' | 'upload:success';
  timestamp: string;
  data: any;
}

/**
 * WebhookDispatcher
 * The core "Brain" responsible for pushing event notifications to external servers or email pipelines based on settings.
 */
export class WebhookDispatcher {
  
  /**
   * Primary dispatcher method. Checks if user enabled webhooks, then loops through attached URLs and sends the payload.
   */
  static async dispatch(
    payload: WebhookPayload, 
    userId: string,
    enabledWebhooks: { url: string, secret: string, active: boolean }[]
  ): Promise<void> {
    
    const activeHooks = enabledWebhooks.filter(h => h.active);
    if (!activeHooks.length) return; // Silent execution if none exist

    console.log(`[WebhookDispatcher] Firing event '${payload.event}' to ${activeHooks.length} endpoints.`);

    const firePromises = activeHooks.map(async hook => {
      try {
        await fetch(hook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Omni-Tool-Event': payload.event,
            // Simple HMAC or Bearer would reside here
            'Authorization': `Bearer ${hook.secret}`,
          },
          body: JSON.stringify(payload),
          // Short timeout so background workers don't lock forever
          signal: AbortSignal.timeout(5000) 
        });
      } catch (err) {
        console.warn(`[WebhookDispatcher] Endpoint ${hook.url} failed to receive payload.`);
      }
    });

    // Execute fire-and-forget
    Promise.allSettled(firePromises);
  }

  /**
   * Core logic for Email Alert generation using standard API endpoints (e.g. Resend, SendGrid)
   */
  static async dispatchEmailAlert(templateName: string, config: { userEmail: string, emailEnabled: boolean, data: any }) {
    if (!config.emailEnabled) return;
    
    // Logic for internal server call to send Emails
    try {
      await fetch('/api/telemetry/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: config.userEmail,
          template: templateName,
          payload: config.data,
        })
      });
    } catch (err) {
      console.error('[EmailDispatcher] Failed to send email alert: ', err);
    }
  }
}
