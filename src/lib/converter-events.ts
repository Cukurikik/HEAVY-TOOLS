// In-memory event bus for SSE broadcasts
// In production: use Redis Pub/Sub or Supabase Realtime

const listeners = new Map<string, Set<(data: string) => void>>()

export function broadcastConverterEvent(
  userId: string, 
  event: 'START' | 'PROGRESS' | 'COMPLETE' | 'ERROR',
  payload: Record<string, unknown>
) {
  const channelListeners = listeners.get(userId)
  if (channelListeners) {
    const data = JSON.stringify({ event, ...payload, timestamp: Date.now() })
    channelListeners.forEach(cb => cb(data))
  }
}

export function registerListener(userId: string, callback: (data: string) => void) {
  if (!listeners.has(userId)) {
    listeners.set(userId, new Set())
  }
  listeners.get(userId)!.add(callback)
}

export function removeListener(userId: string, callback: (data: string) => void) {
  listeners.get(userId)?.delete(callback)
  if (listeners.get(userId)?.size === 0) {
    listeners.delete(userId)
  }
}
