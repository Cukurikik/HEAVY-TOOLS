/**
 * Web Worker — Hash & Encoding (Layer 3)
 * Handles: Hash Generator, Base64, Hex Encoder, Number System,
 *          Encoding Converter, Color Converter, Unit Converter,
 *          Currency Converter, Timezone Converter, QR Generator,
 *          Barcode Generator
 *
 * Uses Web Crypto API `subtle.digest()` for hashing.
 * Offloads encoding/generation from main thread.
 */

import { processHashGenerator } from '../engines/hash-generator.engine';
import { processBase64 } from '../engines/base64.engine';
import { processHexEncoder } from '../engines/hex-encoder.engine';
import { processNumberSystem } from '../engines/number-system.engine';
import { processEncodingConverter } from '../engines/encoding-converter.engine';
import { processColorConverter } from '../engines/color-converter.engine';
import { processUnitConverter } from '../engines/unit-converter.engine';
import { processCurrencyConverter } from '../engines/currency-converter.engine';
import { processTimezoneConverter } from '../engines/timezone-converter.engine';
import { processQrGenerator } from '../engines/qr-generator.engine';
import { processBarcodeGenerator } from '../engines/barcode-generator.engine';

const ENGINE_MAP: Record<string, Function> = {
  'hash-generator': processHashGenerator,
  'base64': processBase64,
  'hex-encoder': processHexEncoder,
  'number-system': processNumberSystem,
  'encoding-converter': processEncodingConverter,
  'color-converter': processColorConverter,
  'unit-converter': processUnitConverter,
  'currency-converter': processCurrencyConverter,
  'timezone-converter': processTimezoneConverter,
  'qr-generator': processQrGenerator,
  'barcode-generator': processBarcodeGenerator,
};

self.onmessage = async (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type !== 'PROCESS') return;

  try {
    const engine = ENGINE_MAP[payload.operation];
    if (!engine) {
      throw new Error(`[hash.worker] No engine for operation: ${payload.operation}`);
    }

    const onProgress = (p: number) => {
      self.postMessage({ type: 'PROGRESS', progress: Math.min(Math.round(p), 99) });
    };

    const result = await engine(payload.task, onProgress);

    if (result instanceof Blob) {
      const buffer = await result.arrayBuffer();
      self.postMessage(
        { type: 'DONE', result: buffer, resultType: 'blob', mimeType: result.type },
        [buffer]
      );
    } else {
      self.postMessage({ type: 'DONE', result: String(result), resultType: 'string' });
    }
  } catch (error: any) {
    self.postMessage({
      type: 'ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
