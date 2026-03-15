import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, mergeMap, retryWhen } from 'rxjs/operators';
import { CircuitBreaker } from '../services/circuit-breaker.service';

/**
 * FAULT TOLERANCE HTTP INTERCEPTOR
 * 
 * Automatically wraps all outgoing HTTP requests with:
 * 1. Circuit Breaker — blocks requests to failing endpoints
 * 2. Retry with Exponential Backoff — retries transient failures
 * 
 * Circuit breakers are created per-host to isolate failures.
 */
@Injectable()
export class FaultToleranceInterceptor implements HttpInterceptor {

  /** One circuit breaker per host to isolate failures */
  private breakers = new Map<string, CircuitBreaker>();

  /** HTTP status codes considered retryable (server-side transient errors) */
  private readonly RETRYABLE_STATUS_CODES = [408, 429, 500, 502, 503, 504];

  /** Max retry attempts */
  private readonly MAX_RETRIES = 3;
  /** Base delay in ms */
  private readonly BASE_DELAY = 1000;

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const host = this.extractHost(req.url);
    const breaker = this.getOrCreateBreaker(host);

    // Check circuit state before sending request
    const state = breaker.getState();
    if (state === 'OPEN') {
      console.warn(`[FaultTolerance] Circuit OPEN for ${host}. Request blocked: ${req.url}`);
      return throwError(() => new HttpErrorResponse({
        status: 503,
        statusText: 'Service Unavailable',
        url: req.url,
        error: `Circuit breaker OPEN for ${host}. Service temporarily blocked.`,
      }));
    }

    return next.handle(req).pipe(
      // Retry with exponential backoff on transient errors
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error: HttpErrorResponse, attempt: number) => {
            if (
              attempt >= this.MAX_RETRIES ||
              !this.isRetryable(error)
            ) {
              return throwError(() => error);
            }

            const delay = this.calculateDelay(attempt);
            console.warn(
              `[FaultTolerance] Retry ${attempt + 1}/${this.MAX_RETRIES} for ${req.url} in ${delay}ms`
            );
            return timer(delay);
          })
        )
      ),
      // Record success/failure in circuit breaker
      catchError((error: HttpErrorResponse) => {
        breaker.execute(() => Promise.reject(error)).catch(() => {});
        return throwError(() => error);
      })
    );
  }

  private getOrCreateBreaker(host: string): CircuitBreaker {
    if (!this.breakers.has(host)) {
      this.breakers.set(host, new CircuitBreaker(host, {
        failureThreshold: 5,
        resetTimeoutMs: 30000,
        successThreshold: 2,
      }));
    }
    return this.breakers.get(host)!;
  }

  private extractHost(url: string): string {
    try {
      return new URL(url).host;
    } catch {
      return 'localhost';
    }
  }

  private isRetryable(error: HttpErrorResponse): boolean {
    // Network errors (status 0) are always retryable
    if (error.status === 0) return true;
    return this.RETRYABLE_STATUS_CODES.includes(error.status);
  }

  private calculateDelay(attempt: number): number {
    const delay = this.BASE_DELAY * Math.pow(2, attempt);
    // Add jitter: ±25%
    const jitter = delay * 0.25;
    return Math.floor(delay + (Math.random() * jitter * 2 - jitter));
  }

  /** Get health metrics for all tracked hosts */
  getCircuitMetrics() {
    const metrics: Record<string, unknown>[] = [];
    this.breakers.forEach(breaker => {
      metrics.push(breaker.getMetrics());
    });
    return metrics;
  }
}
