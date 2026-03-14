import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AudioReplacerService {
  // -i video.mp4 -i audio.mp3 -c:v copy -map 0:v -map 1:a output.mp4
  buildArgs(inputName: string, outputName: string, ): string[] {
    return ['-i', inputName, outputName];
  }
  formatTime(s: number): string {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }
}
