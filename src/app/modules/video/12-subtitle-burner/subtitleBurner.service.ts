import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SubtitleBurnerService {
  // -vf subtitles=subs.srt output.mp4
  buildArgs(inputName: string, outputName: string, config: Record<string, unknown>): string[] {
    return ['-i', inputName, outputName];
  }
  formatTime(s: number): string {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }
}
