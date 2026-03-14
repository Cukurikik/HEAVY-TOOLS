import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AudioContextService {
  private ctx: AudioContext | null = null;
  readonly state = signal<'suspended' | 'running' | 'closed'>('suspended');

  get context(): AudioContext {
    if (!this.ctx) { this.ctx = new AudioContext({ sampleRate: 48000 }); }
    return this.ctx;
  }

  async resume(): Promise<void> {
    if (this.context.state === 'suspended') await this.context.resume();
    this.state.set('running');
  }

  createAnalyser(fftSize = 2048): AnalyserNode {
    const a = this.context.createAnalyser();
    a.fftSize = fftSize; a.smoothingTimeConstant = 0.8;
    return a;
  }

  createOfflineContext(channels: number, sampleRate: number, duration: number): OfflineAudioContext {
    return new OfflineAudioContext(channels, Math.ceil(sampleRate * duration), sampleRate);
  }

  async decodeFile(file: File): Promise<AudioBuffer> {
    const arrayBuf = await file.arrayBuffer();
    return this.context.decodeAudioData(arrayBuf);
  }

  buildWaveformPeaks(buffer: AudioBuffer, points = 2000): Float32Array {
    const ch = buffer.getChannelData(0);
    const peaks = new Float32Array(points);
    const blockSize = Math.floor(ch.length / points);
    for (let i = 0; i < points; i++) {
      let max = 0;
      for (let j = 0; j < blockSize; j++) {
        const abs = Math.abs(ch[i * blockSize + j]);
        if (abs > max) max = abs;
      }
      peaks[i] = max;
    }
    return peaks;
  }
}
