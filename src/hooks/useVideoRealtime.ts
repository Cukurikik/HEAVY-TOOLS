import { useEffect, useState } from 'react'
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

/**
 * Frontend hook to listen to Video Realtime events via Supabase.
 */
export function useVideoRealtime(userId: string) {
  const [activeJobs, setActiveJobs] = useState<Record<string, any>>({})
  const [onlineUsers, setOnlineUsers] = useState<number>(1)
  
  // const supabase = createClientComponentClient()

  useEffect(() => {
    if (!userId) return

    const channelName = `video-processing-${userId}`
    
    // 71. Supabase Realtime Channel
    // const channel = supabase.channel(channelName, {
    //   config: {
    //     presence: { key: userId },
    //   },
    // })

    // 77. Presence Tracking Video
    // channel.on('presence', { event: 'sync' }, () => {
    //   const state = channel.presenceState()
    //   setOnlineUsers(Object.keys(state).length)
    //   // If onlineUsers > 1, show a warning: "You have Omni-Tool open in multiple tabs. Conflicts may occur."
    // })

    // Listen to video processing events
    // channel.on('broadcast', { event: 'PROGRESS' }, (payload) => {
    //   setActiveJobs(prev => ({ ...prev, [payload.jobId]: payload }))
    // })
    
    // channel.on('broadcast', { event: 'COMPLETE' }, (payload) => {
    //   // Show success toast
    //   // Play sound
    //   // Set job to 100%
    // })

    // 78. Connection Recovery Logic
    // channel.subscribe((status, err) => {
    //   if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
    //     console.warn('Realtime disconnected. Attempting to recover in 5s...')
    //     setTimeout(() => channel.subscribe(), 5000)
    //   }
    // })

    return () => {
      // supabase.removeChannel(channel)
    }
  }, [userId])

  return { activeJobs, onlineUsers }
}
