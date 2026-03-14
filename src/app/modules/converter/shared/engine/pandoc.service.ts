// ============================================================
// CONVERTER PANDOC SERVICE — Document conversion WASM wrapper
// File: src/app/modules/converter/shared/engine/pandoc.service.ts
// ============================================================

import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConverterPandocService {
  readonly isReady = signal(false);

  /** Lazy-load Pandoc WASM */
  async load(): Promise<void> {
    // Pandoc WASM binary is loaded inside the worker thread
    this.isReady.set(true);
  }

  /** Convert using engine delegation (actual work in worker) */
  async convert(
    input: string,
    from: string,
    to: string,
    
  ): Promise<string | Uint8Array> {
    // Stub — actual conversion happens in worker
    return `Converted from ${from} to ${to}: ${input.substring(0, 100)}`;
  }
}
