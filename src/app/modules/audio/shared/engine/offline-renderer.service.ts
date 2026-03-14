import { Injectable, inject } from '@angular/core';
import { AudioContextService } from './audio-context.service';

@Injectable({ providedIn: 'root' })
export class OfflineRendererService {
  private audioCtx = inject(AudioContextService);

  async decodeFile(file: File): Promise<AudioBuffer> {
    return this.audioCtx.decodeFile(file);
  }

  async render(
    buffer: AudioBuffer,
    buildChain: (ctx: OfflineAudioContext, source: AudioBufferSourceNode) => void
  ): Promise<AudioBuffer> {
    const offline = new OfflineAudioContext(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
    const source = offline.createBufferSource();
    source.buffer = buffer;
    buildChain(offline, source);
    source.start(0);
    return offline.startRendering();
  }

  encodeToWav(buffer: AudioBuffer): Uint8Array {
    const numCh = buffer.numberOfChannels;
    const length = buffer.length * numCh * 2 + 44;
    const out = new ArrayBuffer(length);
    const view = new DataView(out);
    const writeStr = (o: number, s: string) => {
      for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i));
    };
    writeStr(0, 'RIFF');
    view.setUint32(4, length - 8, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numCh, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * numCh * 2, true);
    view.setUint16(32, numCh * 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, 'data');
    view.setUint32(40, length - 44, true);
    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let ch = 0; ch < numCh; ch++) {
        const s = Math.max(-1, Math.min(1, buffer.getChannelData(ch)[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        offset += 2;
      }
    }
    return new Uint8Array(out);
  }
}
