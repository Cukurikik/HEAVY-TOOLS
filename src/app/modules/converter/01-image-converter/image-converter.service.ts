// ============================================================
// FEATURE 01 — IMAGE CONVERTER — Service
// ============================================================
import { Injectable } from '@angular/core';
import { ImageMeta } from '../shared/types/converter.types';

@Injectable({ providedIn: 'root' })
export class ImageConverterService {
  /** Detect input format from magic bytes and MIME */
  detectInputFormat(file: File): string {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    const mime = file.type.split('/')[1] ?? ext;
    return mime || ext || 'unknown';
  }

  /** Get image metadata using browser Image API */
  async getMetadata(file: File): Promise<ImageMeta> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        resolve({
          filename: file.name,
          sizeMB: file.size / 1_048_576,
          type: file.type,
          lastModified: file.lastModified,
          width: img.naturalWidth,
          height: img.naturalHeight,
          format: this.detectInputFormat(file) });
        URL.revokeObjectURL(url);
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Cannot read image')); };
      img.src = url;
    });
  }

  /** Estimate output size in MB */
  estimateOutputSize(width: number, height: number, format: string, quality: number): number {
    const pixels = width * height;
    switch (format) {
      case 'jpeg': return (pixels * 3 * quality / 100 / 10) / 1_048_576;
      case 'png':  return (pixels * 4 / 3) / 1_048_576;
      case 'webp': return (pixels * 3 * quality / 100 / 15) / 1_048_576;
      case 'avif': return (pixels * 3 * quality / 100 / 20) / 1_048_576;
      default:     return (pixels * 3) / 1_048_576;
    }
  }

  /** Generate output filename */
  generateOutputFilename(inputName: string, format: string): string {
    const base = inputName.replace(/\.[^.]+$/, '');
    return `exia_converted_${base}.${format}`;
  }
}
