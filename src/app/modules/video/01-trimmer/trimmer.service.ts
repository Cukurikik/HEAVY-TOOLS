import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TrimmerService {
  // -ss start -i input -t duration -c copy output.mp4
  buildArgs(inputName: string, outputName: string, start: number, duration: number): string[] {
    return [
      '-ss', start.toString(),
      '-i', inputName,
      '-t', duration.toString(),
      '-c', 'copy',
      outputName
    ];
  }
  
  async getVideoMetadata(file: File): Promise<{ duration: number; width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve({
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight
        });
      };
      video.onerror = () => reject('Failed to load video metadata');
      video.src = URL.createObjectURL(file);
    });
  }

  formatTime(s: number): string {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }
}
