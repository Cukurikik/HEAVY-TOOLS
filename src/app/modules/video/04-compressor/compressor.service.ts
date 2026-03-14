import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CompressorService {
  // -i input -vcodec libx264 -crf 28 output.mp4
  buildArgs(inputName: string, outputName: string, crf: number): string[] {
    return [
      '-i', inputName,
      '-vcodec', 'libx264',
      '-crf', crf.toString(),
      '-preset', 'ultrafast',
      outputName
    ];
  }
  
  formatTime(s: number): string {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }
}
