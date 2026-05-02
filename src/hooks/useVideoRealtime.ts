import { useState } from 'react'

/**
 * Frontend hook to listen to Video Realtime events via Supabase.
 */
export function useVideoRealtime(_userId: string) {
  const [activeJobs] = useState<Record<string, any>>({})
  const [onlineUsers] = useState<number>(1)

  return { activeJobs, onlineUsers }
}
