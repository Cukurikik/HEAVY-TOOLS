import { NextRequest, NextResponse } from 'next/server'
import { serverlessAudioClient } from '@/lib/serverless-audio'
import { mapToAudioCloudParams } from '@/lib/audio-ffmpeg-mapper'

/**
 * 52. API cloud-audio-encode
 * Central router forwarding heavy WASM-breaking jobs to the serverless proxy.
 */
export async function POST(request: NextRequest) {
  try {
    const { audioUrl, operation, options, durationSeconds } = await request.json()

    // 60. Cost Limiter Cloud (Audio)
    if (durationSeconds > 3600) { // Limit to 60 minutes
      return NextResponse.json({ 
        error: 'Durasi audio melebihi batas 60 menit untuk pemrosesan cloud gratis. Upgrade ke PRO.' 
      }, { status: 413 })
    }

    // 55. FFmpeg Audio Parameter Mapper
    const serverlessParams = mapToAudioCloudParams(operation, options, audioUrl)

    // Trigger proxy
    const result = await serverlessAudioClient.runJob(operation, serverlessParams)

    return NextResponse.json({ success: true, jobId: result.jobId })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error allocating cloud audio encode' }, { status: 500 })
  }
}
