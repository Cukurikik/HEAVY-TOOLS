// Fase 1: Task 09 - Rate Limiter In-Memory via Node.js Map
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 menit
const MAX_REQUESTS_PER_WINDOW = 100; // 100 request/menit per plugin/IP

const rateLimitTracker = new Map<string, { count: number; windowStart: number }>();

export const checkRateLimit = (identifier: string): boolean => {
  const now = Date.now();
  const record = rateLimitTracker.get(identifier);

  if (!record) {
    rateLimitTracker.set(identifier, { count: 1, windowStart: now });
    return true; // Diizinkan
  }

  // Jika window sudah berlalu, reset konter
  if (now - record.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitTracker.set(identifier, { count: 1, windowStart: now });
    return true;
  }

  // Jika masih di dalam window, cek batas
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false; // Rate limit tercapai
  }

  // Tambah konter
  record.count += 1;
  return true;
};
