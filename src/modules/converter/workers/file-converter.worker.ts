/**
 * Web Worker — File Converter (Layer 3)
 * Handles: Image, Video, Audio, Document, HEIC, Font, eBook,
 *          RAW, Vector, CAD converters
 *
 * Offloads heavy file I/O and format conversion from main thread.
 */

import { processImageConverter } from '../engines/image-converter.engine';
import { processVideoConverter } from '../engines/video-converter.engine';
import { processAudioConverter } from '../engines/audio-converter.engine';
import { processDocumentConverter } from '../engines/document-converter.engine';
import { processHeicConverter } from '../engines/heic-converter.engine';
import { processFontConverter } from '../engines/font-converter.engine';
import { processEbookConverter } from '../engines/ebook-converter.engine';
import { processRawConverter } from '../engines/raw-converter.engine';
import { processVectorConverter } from '../engines/vector-converter.engine';
import { processCadConverter } from '../engines/cad-converter.engine';

const ENGINE_MAP: Record<string, Function> = {
  'image-converter': processImageConverter,
  'video-converter': processVideoConverter,
  'audio-converter': processAudioConverter,
  'document-converter': processDocumentConverter,
  'heic-converter': processHeicConverter,
  'font-converter': processFontConverter,
  'ebook-converter': processEbookConverter,
  'raw-converter': processRawConverter,
  'vector-converter': processVectorConverter,
  'cad-converter': processCadConverter,
};

self.onmessage = async (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type !== 'PROCESS') return;

  try {
    const engine = ENGINE_MAP[payload.operation];
    if (!engine) {
      throw new Error(`[file-converter.worker] No engine for operation: ${payload.operation}`);
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
    } else if (Array.isArray(result)) {
      // Multiple output files (e.g., archive extraction)
      const serialized = [];
      const transfers: ArrayBuffer[] = [];
      for (const item of result) {
        if (item instanceof Blob) {
          const buf = await item.arrayBuffer();
          serialized.push({ buffer: buf, type: item.type });
          transfers.push(buf);
        } else {
          serialized.push({ value: String(item) });
        }
      }
      self.postMessage({ type: 'DONE', result: serialized, resultType: 'blobArray' }, transfers);
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
