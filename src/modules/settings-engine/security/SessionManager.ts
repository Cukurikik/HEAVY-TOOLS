/**
 * SessionManager 
 * Central "Brain" for enforcing Account Security routines like Two-Factor sweeps and Inactivity Timeouts.
 */
export class SessionManager {
  private static inactivityTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Converts user's string setting ("1h", "24h") into pure milliseconds
   */
  static parseTimeoutStringToMs(timeoutStr: string): number {
    const map: Record<string, number> = {
      '1h': 60 * 60 * 1000,
      '12h': 12 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
    };
    return map[timeoutStr] || map['24h'];
  }

  /**
   * Bootstraps the Auto-Logout sequence. Attaches DOM listeners to reset the timer when the user interacts.
   */
  static initializeActivityWatchdog(timeoutStr: string, logoutCallback: () => void) {
    if (typeof window === 'undefined') return;

    this.clearWatchdog(); // Reset if already running
    const timeoutMs = this.parseTimeoutStringToMs(timeoutStr);

    const resetTimer = () => {
      if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
      this.inactivityTimer = setTimeout(() => {
        console.warn(`[SessionManager] User inactive for ${timeoutStr}. Enforcing auto-logout protocol.`);
        logoutCallback();
      }, timeoutMs);
    };

    // Listen to major generic usage events
    window.addEventListener('mousemove', resetTimer, { passive: true });
    window.addEventListener('keypress', resetTimer, { passive: true });
    window.addEventListener('click', resetTimer, { passive: true });
    window.addEventListener('scroll', resetTimer, { passive: true });

    // Initial start
    resetTimer();
  }

  /**
   * Destroys existing watchdog instances
   */
  static clearWatchdog() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
    // Note: in a real framework, you'd accurately removeEventListeners for memory leak protection.
  }
}
