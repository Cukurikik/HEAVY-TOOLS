import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VideoToGifService {
  // -vf fps=10,scale=480:-1,palettegen palette.png
  buildArgs(inputName: string, outputName: string, config: Record<string, unknown>): string[] {
    return ['-i', inputName, outputName];
  }
  formatTime(s: number): string {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }
}
