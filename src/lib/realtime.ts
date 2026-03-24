import { supabaseServer } from './supabase-server'

/**
 * 71. Supabase Realtime Channel utility.
 * Since we're in the Next.js server context, we use the Supabase JS Service Role client
 * to broadcast messages to connected frontend channels.
 */

export async function broadcastVideoEvent(
  userId: string,
  jobId: string,
  eventType: 'START' | 'PROGRESS' | 'COMPLETE' | 'ERROR',
  payload: any
) {
  const channelName = `video-processing-${userId}`
  console.log(`[REALTIME BROADCAST] Channel: ${channelName} | Event: ${eventType}`, payload)
  
  await supabaseServer.channel(channelName).send({
    type: 'broadcast',
    event: eventType,
    payload: { jobId, ...payload }
  })
}

export async function broadcastAudioEvent(
  userId: string,
  jobId: string,
  eventType: 'START' | 'PROGRESS' | 'COMPLETE' | 'ERROR',
  payload: any
) {
  const channelName = `audio-processing-${userId}`
  console.log(`[REALTIME AUDIO] Channel: ${channelName} | Event: ${eventType}`, payload)
  
  await supabaseServer.channel(channelName).send({
    type: 'broadcast',
    event: eventType,
    payload: { jobId, ...payload }
  })
}

export async function broadcastPresetUpdate(userId: string, presetId: string, action: 'CREATED' | 'DELETED') {
  const channelName = `video-presets-${userId}`
  console.log(`[REALTIME BROADCAST] Channel: ${channelName} | Preset ${presetId} ${action}`)
  await supabaseServer.channel(channelName).send({
    type: 'broadcast', event: 'PRESET_UPDATE', payload: { presetId, action }
  })
}

export async function broadcastQuotaUpdate(userId: string, newBalance: number) {
  const channelName = `user-quota-${userId}`
  console.log(`[REALTIME BROADCAST] Channel: ${channelName} | New Balance: ${newBalance}`)
  await supabaseServer.channel(channelName).send({
    type: 'broadcast', event: 'QUOTA_UPDATE', payload: { newBalance }
  })
}
