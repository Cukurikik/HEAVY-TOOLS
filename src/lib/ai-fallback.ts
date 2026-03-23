/**
 * 50. Fallback AI Logic (Retry/Cadangan)
 * Executes a primary AI function with retries. If it fails beyond maxRetries,
 * it safely falls back to a secondary AI function.
 */
export async function withAiFallback<T>(
  primaryFn: () => Promise<T>,
  fallbackFn: () => Promise<T>,
  maxRetries = 2
): Promise<T> {
  let attempt = 0
  let lastError = null

  while (attempt < maxRetries) {
    try {
      return await primaryFn()
    } catch (e) {
      lastError = e
      attempt++
      // Exponential backoff
      await new Promise(res => setTimeout(res, 1000 * Math.pow(2, attempt)))
    }
  }

  console.warn("Primary AI failed after retries, switching to fallback logic.", lastError)
  return fallbackFn()
}
