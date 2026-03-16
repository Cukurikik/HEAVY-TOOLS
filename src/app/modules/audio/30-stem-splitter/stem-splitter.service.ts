import { Injectable, inject } from '@angular/core';
import { AudioContextService } from '../shared/engine/audio-context.service';
import { OfflineRendererService } from '../shared/engine/offline-renderer.service';
import { FFmpegAudioService } from '../shared/engine/ffmpeg-audio.service';
import type { AudioMeta, WaveformData } from '../shared/types/audio.types';

@Injectable({ providedIn: 'root' })
export class StemSplitterService {
  private audioCtx = inject(AudioContextService);
  private renderer = inject(OfflineRendererService);
  private ffmpeg = inject(FFmpegAudioService);

  async decodeAndAnalyze(file: File): Promise<{ meta: AudioMeta; waveformData: WaveformData }> {
    const buffer = await this.audioCtx.decodeFile(file);
    const peaks = this.audioCtx.buildWaveformPeaks(buffer);
    const meta: AudioMeta = {
      filename: file.name, fileSizeMB: file.size / 1048576,
      duration: buffer.duration, sampleRate: buffer.sampleRate,
      channels: buffer.numberOfChannels, bitDepth: 16,
      bitrate: 0, codec: 'pcm', hasVideo: false
    };
    const waveformData: WaveformData = { peaks, duration: buffer.duration, sampleRate: buffer.sampleRate };
    return { meta, waveformData };
  }

  async processAudio(file: File): Promise<Blob> {
    const buffer = await this.audioCtx.decodeFile(file);
    const wavData = this.renderer.encodeToWav(buffer);
    return new Blob([new Uint8Array(wavData as unknown as ArrayBuffer)], { type: 'audio/wav' });
  }
}
