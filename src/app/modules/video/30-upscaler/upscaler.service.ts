import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UpscalerService {
  // ONNX Real-ESRGAN frame-by-frame inference
  buildArgs(inputName: string, outputName: string, ): string[] {
    return ['-i', inputName, outputName];
  }
  formatTime(s: number): string {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }
}
