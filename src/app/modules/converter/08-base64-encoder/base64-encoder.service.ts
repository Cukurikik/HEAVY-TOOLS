// ============================================================
// FEATURE 08 — BASE64 ENCODER / DECODER — Service
// ============================================================
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Base64EncoderService {
  /** Detect input format from filename and MIME type */
  detectFormat(file: File): string {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    return ext || file.type.split('/').pop() || 'unknown';
  }

  /** Generate semantic output filename */
  generateOutputFilename(inputName: string, format: string): string {
    const base = inputName.replace(/\.[^.]+$/, '');
    return `exia_base64_encoder_${base}.${format}`;
  }

  /** Validate that input format can be converted to output format */
  isConversionSupported(inputFormat: string, outputFormat: string): boolean {
    if (inputFormat === outputFormat) return false;
    return true; // All format combinations supported by default
  }
}
