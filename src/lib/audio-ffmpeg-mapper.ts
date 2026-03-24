/**
 * 55. FFmpeg Audio Parameter Mapper
 * Converts UI state variables (Zod validated options) into precise FFmpeg audio filter 
 * JSON payloads expected by the Serverless Cloud workers.
 */
export function mapToAudioCloudParams(operation: string, options: any, fileUrl: string) {
  const payload: any = {
    inputUrl: fileUrl,
    operationType: operation,
  }

  switch (operation) {
    case 'audio-converter':
      payload.targetFormat = options?.format || 'mp3'
      payload.bitrate = options?.bitrate || '320k'
      break
    case 'audio-normalizer':
      // LUFS normalization
      payload.targetLUFS = options?.targetLufs || -14.0
      payload.truePeak = options?.truePeak || -1.0
      break
    case 'time-stretcher':
      // Rubberband or atempo
      payload.tempoRatio = options?.tempo || 1.0
      payload.pitchPreserve = options?.preservePitch ?? true
      break
    default:
      payload.rawFilter = options?.filterChain || ''
  }

  return payload;
}
