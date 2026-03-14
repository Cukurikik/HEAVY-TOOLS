import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TransitionsService {
  // -filter_complex [0][1]xfade=transition=fade:duration=0.5 output.mp4
  buildArgs(inputName: string, outputName: string, config: Record<string, unknown>): string[] {
    return ['-i', inputName, outputName];
  }
  formatTime(s: number): string {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }
}
