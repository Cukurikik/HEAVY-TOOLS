/**
 * PrivacyEngine
 * Central "Brain" for ensuring the user's Telemetry and Consent policies are strictly followed.
 */
export class PrivacyEngine {
  /**
   * Evaluates whether an error log or ping is legally allowed to leave the client device.
   */
  static isTelemetryAllowed(userConsentMap: Record<string, boolean>, specificKey: 'analyticsConsent' | 'crashReports'): boolean {
    // If the user hasn't explicitly set true, implicitly deny. Default deny.
    return !!userConsentMap[specificKey];
  }

  /**
   * Safely dispatches a generic payload, instantly rejecting if privacy settings forbid it.
   */
  static dispatchAnonymousPing(payload: any, userConsentMap: Record<string, boolean>) {
    if (!this.isTelemetryAllowed(userConsentMap, 'analyticsConsent')) {
      // Silently kill the process to respect User Privacy 100%
      return;
    }

    // Strip PII (Personally Identifiable Information) before dispatching
    const safePayload = this.stripSensitiveData(payload);

    try {
      // Beacon API is better for telemetry as it doesn't block unloads
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/telemetry/collect', JSON.stringify(safePayload));
      } else {
        fetch('/api/telemetry/collect', {
          method: 'POST',
          body: JSON.stringify(safePayload),
          keepalive: true,
        }).catch(() => {});
      }
    } catch (e) {
      // Ignore network errors on telemetry
    }
  }

  /**
   * A regex-powered sanitizer to ensure no accidental file paths, IP addresses, or emails leak.
   */
  private static stripSensitiveData(payload: any): any {
    const stringified = JSON.stringify(payload);
    // Redact Emails
    let sanitized = stringified.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]');
    // Redact IPs
    sanitized = sanitized.replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '[REDACTED_IP]');
    
    return JSON.parse(sanitized);
  }
}
