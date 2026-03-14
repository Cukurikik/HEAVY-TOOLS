import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MergerService {
  // -f concat -safe 0 -i list.txt -c copy output.mp4
  buildArgs(inputName: string, outputName: string, config: Record<string, unknown>): string[] {
    return ['-i', inputName, '-c:v', 'libx264', '-preset', 'ultrafast', outputName];
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
