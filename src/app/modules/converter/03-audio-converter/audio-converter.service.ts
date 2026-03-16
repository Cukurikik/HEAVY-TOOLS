// ============================================================
// FEATURE 03 — AUDIO FORMAT CONVERTER — Service
// ============================================================
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AudioConverterService {
  /** Detect input format from filename and MIME type */
  detectFormat(file: File): string {
    const parts = file.name.split('.');
    const ext = parts.length > 1 ? parts.pop()?.toLowerCase() ?? '' : '';
    const mimeSubtype = file.type.split('/').pop() || '';
    const mimeExt = mimeSubtype.split('.').pop();
    return ext || mimeExt || 'unknown';
  }

  /** Generate semantic output filename */
  generateOutputFilename(inputName: string, format: string): string {
    const base = inputName.replace(/\.[^.]+$/, '');
    return `exia_audio_converter_${base}.${format}`;
  }

  /** Validate that input format can be converted to output format */
  isConversionSupported(inputFormat: string, outputFormat: string): boolean {
    if (inputFormat === outputFormat) return false;
    return true; // All format combinations supported by default
  }
}
