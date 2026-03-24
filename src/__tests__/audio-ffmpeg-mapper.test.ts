import { describe, it, expect } from 'vitest'
import { mapToAudioCloudParams } from '../lib/audio-ffmpeg-mapper'

describe('Audio FFmpeg Mapper', () => {
  it('should map audio-converter accurately', () => {
    const output = mapToAudioCloudParams('audio-converter', { format: 'flac', bitrate: '1411k' }, 'http://test.wav')
    expect(output.operationType).toBe('audio-converter')
    expect(output.targetFormat).toBe('flac')
    expect(output.bitrate).toBe('1411k')
  })

  it('should fallback to rawFilter if unknown', () => {
    const output = mapToAudioCloudParams('custom-fx', { filterChain: 'aecho=0.8:0.9:1000:0.3' }, 'http://test.wav')
    expect(output.rawFilter).toBe('aecho=0.8:0.9:1000:0.3')
  })
})
