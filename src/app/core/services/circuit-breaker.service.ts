/**
 * OMNI CIRCUIT BREAKER SERVICE
 * 
 * Prevents cascading failures by monitoring service health.
 * States: CLOSED (normal) → OPEN (blocked) → HALF_OPEN (testing recovery).
 * 
 * When failure count exceeds threshold, the circuit "opens" and all
 * subsequent requests are immediately rejected without hitting the
 * failing service. After a cooldown period, the circuit enters
 * HALF_OPEN state to test if the service has recovered.
 */

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerConfig {
  /** Number of consecutive failures before opening the circuit */
  failureThreshold: number;
  /** Milliseconds to wait before transitioning from OPEN to HALF_OPEN */
  resetTimeoutMs: number;
  /** Number of successful calls in HALF_OPEN to close the circuit */
  successThreshold: number;
}

const DEFAULT_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 5,
  resetTimeoutMs: 30000,  // 30 seconds
  successThreshold: 2,
};

export class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime = 0;
  private readonly config: CircuitBreakerConfig;
  private readonly name: string;

  constructor(name: string, config?: Partial<CircuitBreakerConfig>) {
    this.name = name;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /** Get current circuit state */
  getState(): CircuitState {
    this.checkAutoReset();
    return this.state;
  }

  /** Get circuit health metrics */
  getMetrics() {
    return {
      name: this.name,
      state: this.getState(),
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime,
    };
  }

  /**
   * Execute a function through the circuit breaker.
   * If the circuit is OPEN, immediately rejects.
   * If CLOSED or HALF_OPEN, executes the function and monitors result.
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    this.checkAutoReset();

    if (this.state === 'OPEN') {
      throw new Error(
        `[CircuitBreaker:${this.name}] Circuit is OPEN. ` +
        `Service unavailable. Will retry after ${this.config.resetTimeoutMs}ms cooldown.`
      );
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  /** Force the circuit to a specific state (for testing/manual override) */
  forceState(state: CircuitState): void {
    this.state = state;
    if (state === 'CLOSED') {
      this.failureCount = 0;
      this.successCount = 0;
    }
  }

  // -----------------------------------------------------------
  // Private methods
  // -----------------------------------------------------------

  private onSuccess(): void {
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= this.config.successThreshold) {
        this.state = 'CLOSED';
        this.failureCount = 0;
        this.successCount = 0;
        console.log(`[CircuitBreaker:${this.name}] Circuit CLOSED. Service recovered.`);
      }
    } else {
      // Reset failure count on success in CLOSED state
      this.failureCount = 0;
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.state === 'HALF_OPEN') {
      // Any failure in HALF_OPEN immediately reopens
      this.state = 'OPEN';
      this.successCount = 0;
      console.warn(`[CircuitBreaker:${this.name}] Circuit re-OPENED from HALF_OPEN. Service still failing.`);
    } else if (this.failureCount >= this.config.failureThreshold) {
      this.state = 'OPEN';
      console.warn(
        `[CircuitBreaker:${this.name}] Circuit OPENED after ${this.failureCount} failures. ` +
        `Blocking all requests for ${this.config.resetTimeoutMs}ms.`
      );
    }
  }

  /** Auto-transition from OPEN to HALF_OPEN after cooldown */
  private checkAutoReset(): void {
    if (this.state === 'OPEN') {
      const elapsed = Date.now() - this.lastFailureTime;
      if (elapsed >= this.config.resetTimeoutMs) {
        this.state = 'HALF_OPEN';
        this.successCount = 0;
        console.log(`[CircuitBreaker:${this.name}] Circuit HALF_OPEN. Testing service recovery...`);
      }
    }
  }
}
