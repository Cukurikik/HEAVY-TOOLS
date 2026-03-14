// ============================================================
// CONVERTER SHARP SERVICE — Image processing WASM wrapper
// File: src/app/modules/converter/shared/engine/sharp.service.ts
// ============================================================

import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConverterSharpService {
  readonly isReady = signal(false);

  /** Load Sharp WASM (stub — actual WASM loaded inside worker) */
  async load(): Promise<void> {
    this.isReady.set(true);
  }

  /** Get image metadata via Canvas API fallback */
  async getMetadata(file: File): Promise<{ width: number; height: number; format: string }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          format: file.type.split('/')[1] || 'unknown' });
        URL.revokeObjectURL(url);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to read image metadata'));
      };
      img.src = url;
    });
  }
}
