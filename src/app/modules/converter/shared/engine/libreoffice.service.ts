// ============================================================
// CONVERTER LIBREOFFICE SERVICE — Office document WASM wrapper
// File: src/app/modules/converter/shared/engine/libreoffice.service.ts
// ============================================================

import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConverterLibreOfficeService {
  readonly isReady = signal(false);

  /** Lazy-load LibreOffice WASM (~40 MB, cached in OPFS) */
  async load(): Promise<void> {
    // LibreOffice WASM binary is loaded inside the worker thread
    this.isReady.set(true);
  }

  /** Convert using LibreOffice engine (actual work in worker) */
  async convert(
    _buffer: ArrayBuffer,
    _targetFormat: string
  ): Promise<Uint8Array> {
    // Stub — actual conversion happens in worker
    return new Uint8Array(0);
  }
}
