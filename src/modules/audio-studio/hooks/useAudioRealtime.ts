'use client'

import { useEffect, useState } from 'react'
import { supabaseClient } from '@/lib/supabase-client'

export function useAudioRealtime(userId: string) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastEvent, setLastEvent] = useState<any>(null)

  useEffect(() => {
    if (!userId) return;

    const channelName = `audio-processing-${userId}`
    let mounted = true;

    const channel = supabaseClient.channel(channelName)
      .on('broadcast', { event: 'START' }, (payload) => {
        if(mounted) setLastEvent(payload)
      })
      .on('broadcast', { event: 'PROGRESS' }, (payload) => {
        if(mounted) setLastEvent(payload)
      })
      .on('broadcast', { event: 'COMPLETE' }, (payload) => {
        if(!mounted) return;
        setLastEvent(payload)
        triggerToast(`Proses Audio Selesai!`, 'success') 
      })
      .on('broadcast', { event: 'ERROR' }, (payload) => {
        if(!mounted) return;
        setLastEvent(payload)
        triggerToast(`Gagal Memproses Audio: ${payload.payload?.message || 'Unknown error'}`, 'error')
      })
      .subscribe((status) => {
        if(!mounted) return;
        if (status === 'SUBSCRIBED') setIsConnected(true)
        if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
           setIsConnected(false)
           console.error("Audio WebSockets Disconnected. Falling back to SSE or polling.")
        }
      })

    return () => { 
      mounted = false;
      supabaseClient.removeChannel(channel) 
    }
  }, [userId])

  const triggerToast = (msg: string, type: string) => {
    // Hooks into Zustand or Sonner toast visually
    console.log(`[TOAST ${type}]`, msg)
  }

  return { isConnected, lastEvent }
}
