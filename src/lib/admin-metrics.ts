/**
 * Admin Metrics Accumulator
 * Shared module for collecting request metrics across the application.
 */

let totalBandwidthAccum = 0;
let requestCounter = 0;
let errorCounter = 0;
let lastRequestCountReset = Date.now();

/** Report a request to the metrics accumulator */
export function reportRequest(engineType: string, bytesProcessed: number, isError: boolean) {
  requestCounter++;
  totalBandwidthAccum += bytesProcessed;
  if (isError) errorCounter++;
}

/** Get current metrics for snapshot generation */
export function getMetricsState() {
  return {
    totalBandwidthAccum,
    requestCounter,
    errorCounter,
    lastRequestCountReset,
  };
}

/** Reset the request counter */
export function resetRequestCounter() {
  requestCounter = 0;
  errorCounter = 0;
  lastRequestCountReset = Date.now();
}
