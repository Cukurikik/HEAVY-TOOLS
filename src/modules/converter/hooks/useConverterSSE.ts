import { useEffect, useRef, useCallback } from 'react'
import { useConverterStore } from '../store/useConverterStore'

interface SSEEvent {
  event: 'CONNECTED' | 'START' | 'PROGRESS' | 'COMPLETE' | 'ERROR'
  jobId?: string
  progress?: number
  resultUrl?: string
  error?: string
  timestamp?: number
}

/**
 * Hook to connect to the Converter SSE endpoint for real-time
 * Cloud Run conversion status updates.
 *
 * Automatically reconnects on disconnection with exponential backoff.
 */
export function useConverterSSE(userId: string | null) {
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectAttemptRef = useRef(0)
  const maxReconnectAttempts = 5

  const handleEvent = useCallback((rawData: string) => {
    try {
      const data: SSEEvent = JSON.parse(rawData)
      const store = useConverterStore.getState()

      switch (data.event) {
        case 'START':
          useConverterStore.setState((state) => {
            state.task.status = 'processing'
            state.task.progress = 0
          })
          break

        case 'PROGRESS':
          if (data.progress !== undefined) {
            useConverterStore.setState((state) => {
              state.task.progress = Math.min(Math.round(data.progress!), 99)
            })
          }
          break

        case 'COMPLETE':
          if (data.resultUrl) {
            useConverterStore.setState((state) => {
              state.task.status = 'success'
              state.task.progress = 100
              state.task.outputUrls = [data.resultUrl!]
            })
          }
          break

        case 'ERROR':
          useConverterStore.setState((state) => {
            state.task.status = 'error'
            state.task.error = data.error || 'Cloud conversion failed'
          })
          break
      }
    } catch {
      // Ignore malformed events (heartbeats, etc.)
    }
  }, [])

  useEffect(() => {
    if (!userId) return

    const connect = () => {
      const url = `/api/converter/events?userId=${encodeURIComponent(userId)}`
      const es = new EventSource(url)

      es.onmessage = (event) => {
        reconnectAttemptRef.current = 0 // Reset on successful message
        handleEvent(event.data)
      }

      es.onerror = () => {
        es.close()
        eventSourceRef.current = null

        // Exponential backoff reconnection
        if (reconnectAttemptRef.current < maxReconnectAttempts) {
          const delay = Math.pow(2, reconnectAttemptRef.current) * 1000
          reconnectAttemptRef.current++
          setTimeout(connect, delay)
        }
      }

      eventSourceRef.current = es
    }

    connect()

    return () => {
      eventSourceRef.current?.close()
      eventSourceRef.current = null
      reconnectAttemptRef.current = 0
    }
  }, [userId, handleEvent])

  const disconnect = useCallback(() => {
    eventSourceRef.current?.close()
    eventSourceRef.current = null
  }, [])

  return { disconnect, isConnected: !!eventSourceRef.current }
}
