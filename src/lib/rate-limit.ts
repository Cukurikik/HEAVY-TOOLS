/**
 * 48. Rate Limiting AI Video
 * In-memory rate limiter using a simple Map with TTL.
 * No external dependencies (Redis removed).
 */

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

// Cleanup stale entries every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, value] of rateLimitMap) {
      if (now > value.resetAt) {
        rateLimitMap.delete(key)
      }
    }
  }, 10 * 60 * 1000)
}

export async function checkRateLimit(userId: string, limit: number = 5): Promise<boolean> {
  const now = Date.now()
  const key = `ratelimit:ai:video:${userId}`
  const entry = rateLimitMap.get(key)

  if (!entry || now > entry.resetAt) {
    // First request or expired — reset counter
    rateLimitMap.set(key, { count: 1, resetAt: now + 24 * 60 * 60 * 1000 })
    return true
  }

  entry.count++
  return entry.count <= limit
}
