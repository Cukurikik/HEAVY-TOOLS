import { Injectable } from '@angular/core';

/**
 * GRACEFUL DEGRADATION SERVICE
 * 
 * Manages fallback strategies for feature modules.
 * When a feature fails (API down, Worker crash, resource unavailable),
 * this service provides a cached or static fallback instead of
 * showing an error page.
 * 
 * Philosophy: "Something is always better than nothing."
 */

export interface FallbackEntry<T = unknown> {
  /** Static fallback data to use when the feature fails */
  fallbackData: T;
  /** Human-readable message explaining the degraded state */
  message: string;
  /** Timestamp when the fallback was last updated with real data */
  lastUpdated: number;
}

@Injectable({ providedIn: 'root' })
export class GracefulDegradationService {

  /** Registry of fallback strategies per feature key */
  private fallbackRegistry = new Map<string, FallbackEntry>();

  /** Track which features are currently in degraded mode */
  private degradedFeatures = new Set<string>();

  /**
   * Register a fallback for a feature.
   * Call this during app initialization or when fresh data is available.
   * 
   * @example
   * this.degradation.registerFallback('ai-recommendations', {
   *   fallbackData: popularProducts,
   *   message: 'AI recommendations temporarily unavailable. Showing popular items.',
   * });
   */
  registerFallback<T>(featureKey: string, entry: Omit<FallbackEntry<T>, 'lastUpdated'>): void {
    this.fallbackRegistry.set(featureKey, {
      ...entry,
      lastUpdated: Date.now(),
    });
  }

  /**
   * Update the fallback cache with fresh data.
   * Call this whenever the feature successfully fetches real data.
   */
  updateFallbackData<T>(featureKey: string, data: T): void {
    const entry = this.fallbackRegistry.get(featureKey);
    if (entry) {
      entry.fallbackData = data;
      entry.lastUpdated = Date.now();
    }
  }

  /**
   * Execute a function with graceful degradation.
   * If the primary function fails, returns fallback data instead.
   * 
   * @example
   * const data = await this.degradation.withFallback(
   *   'ai-recommendations',
   *   () => this.aiService.getRecommendations(userId)
   * );
   */
  async withFallback<T>(featureKey: string, fn: () => Promise<T>): Promise<T> {
    try {
      const result = await fn();
      // On success, update cached fallback and clear degraded flag
      this.updateFallbackData(featureKey, result);
      this.degradedFeatures.delete(featureKey);
      return result;
    } catch (error) {
      console.warn(
        `[GracefulDegradation] Feature "${featureKey}" failed. Using fallback.`,
        error instanceof Error ? error.message : error
      );

      const fallback = this.fallbackRegistry.get(featureKey);
      if (fallback) {
        this.degradedFeatures.add(featureKey);
        return fallback.fallbackData as T;
      }

      // No fallback registered — rethrow
      throw error;
    }
  }

  /**
   * Check if a feature is currently running in degraded mode.
   */
  isDegraded(featureKey: string): boolean {
    return this.degradedFeatures.has(featureKey);
  }

  /**
   * Get the degradation message for a feature.
   */
  getDegradationMessage(featureKey: string): string | null {
    if (!this.isDegraded(featureKey)) return null;
    return this.fallbackRegistry.get(featureKey)?.message ?? null;
  }

  /**
   * Get all currently degraded features.
   */
  getDegradedFeatures(): string[] {
    return Array.from(this.degradedFeatures);
  }

  /**
   * Get the age (in ms) of the fallback data for a feature.
   */
  getFallbackAge(featureKey: string): number | null {
    const entry = this.fallbackRegistry.get(featureKey);
    if (!entry) return null;
    return Date.now() - entry.lastUpdated;
  }
}
