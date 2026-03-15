/**
 * RETRY WITH EXPONENTIAL BACKOFF UTILITY
 * 
 * Automatically retries failed async operations with progressively
 * longer wait times. Includes jitter (randomized delay) to prevent
 * thundering herd problems when multiple clients retry simultaneously.
 * 
 * Works with both raw Promises and RxJS Observables.
 */

import { Observable, timer, throwError } from 'rxjs';
import { mergeMap, retryWhen } from 'rxjs/operators';

export interface RetryConfig {
  /** Maximum number of retry attempts */
  maxRetries: number;
  /** Initial delay in milliseconds before first retry */
  baseDelayMs: number;
  /** Multiplier applied to delay after each retry (exponential growth) */
  multiplier: number;
  /** Maximum delay cap in milliseconds */
  maxDelayMs: number;
  /** Add random jitter to prevent thundering herd */
  jitter: boolean;
  /** Optional: only retry on specific error types */
  retryableErrors?: string[];
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,   // 1 second
  multiplier: 2,        // double each time: 1s → 2s → 4s
  maxDelayMs: 30000,    // cap at 30 seconds
  jitter: true,
};

/**
 * Calculate delay for a given attempt with optional jitter.
 */
function calculateDelay(attempt: number, config: RetryConfig): number {
  let delay = config.baseDelayMs * Math.pow(config.multiplier, attempt);
  delay = Math.min(delay, config.maxDelayMs);

  if (config.jitter) {
    // Add random jitter: ±25% of the calculated delay
    const jitterRange = delay * 0.25;
    delay = delay + (Math.random() * jitterRange * 2 - jitterRange);
  }

  return Math.floor(delay);
}

/**
 * Check if an error is retryable based on config.
 */
function isRetryable(error: unknown, config: RetryConfig): boolean {
  if (!config.retryableErrors || config.retryableErrors.length === 0) {
    return true; // Retry all errors if no filter specified
  }
  const errorMessage = error instanceof Error ? error.message : String(error);
  return config.retryableErrors.some(re => errorMessage.includes(re));
}

// ============================================================
//  PROMISE-BASED RETRY
// ============================================================

/**
 * Wraps an async function with exponential backoff retry logic.
 * 
 * @example
 * const data = await retryWithBackoff(
 *   () => fetch('/api/data').then(r => r.json()),
 *   { maxRetries: 3, baseDelayMs: 1000 }
 * );
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  config?: Partial<RetryConfig>
): Promise<T> {
  const mergedConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let lastError: unknown;

  for (let attempt = 0; attempt <= mergedConfig.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt >= mergedConfig.maxRetries) break;
      if (!isRetryable(error, mergedConfig)) break;

      const delay = calculateDelay(attempt, mergedConfig);
      console.warn(
        `[RetryBackoff] Attempt ${attempt + 1}/${mergedConfig.maxRetries} failed. ` +
        `Retrying in ${delay}ms...`,
        error instanceof Error ? error.message : error
      );
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// ============================================================
//  RXJS OBSERVABLE RETRY OPERATOR
// ============================================================

/**
 * Custom RxJS operator for retrying with exponential backoff.
 * 
 * @example
 * this.http.get('/api/data').pipe(
 *   retryWithBackoff$({ maxRetries: 3 })
 * ).subscribe(data => ...);
 */
export function retryWithBackoff$<T>(
  config?: Partial<RetryConfig>
): (source: Observable<T>) => Observable<T> {
  const mergedConfig = { ...DEFAULT_RETRY_CONFIG, ...config };

  return (source: Observable<T>) =>
    source.pipe(
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error, attempt) => {
            if (attempt >= mergedConfig.maxRetries || !isRetryable(error, mergedConfig)) {
              return throwError(() => error);
            }

            const delay = calculateDelay(attempt, mergedConfig);
            console.warn(
              `[RetryBackoff$] Attempt ${attempt + 1}/${mergedConfig.maxRetries} failed. ` +
              `Retrying in ${delay}ms...`
            );
            return timer(delay);
          })
        )
      )
    );
}
