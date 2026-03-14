import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SlideshowService {
  // -loop 1 -i img.jpg -t 3 -vf scale=1920:1080 clip.mp4
  buildArgs(inputName: string, outputName: string, ): string[] {
    return ['-i', inputName, outputName];
  }
  formatTime(s: number): string {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }
}
