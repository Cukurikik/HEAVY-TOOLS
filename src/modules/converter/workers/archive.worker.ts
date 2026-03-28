/**
 * Web Worker — Archive (Layer 3)
 * Handles: Archive Extractor & Archive Creator
 *
 * Streams large zip/tar files without blocking UI thread.
 */

import { processArchiveExtractor } from '../engines/archive-extractor.engine';
import { processArchiveCreator } from '../engines/archive-creator.engine';

const ENGINE_MAP: Record<string, Function> = {
  'archive-extractor': processArchiveExtractor,
  'archive-creator': processArchiveCreator,
};

self.onmessage = async (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type !== 'PROCESS') return;

  try {
    const engine = ENGINE_MAP[payload.operation];
    if (!engine) {
      throw new Error(`[archive.worker] No engine for operation: ${payload.operation}`);
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
      // Extraction produces multiple files
      const serialized = [];
      const transfers: ArrayBuffer[] = [];
      for (const item of result) {
        if (item instanceof Blob) {
          const buf = await item.arrayBuffer();
          serialized.push({ buffer: buf, type: item.type, name: (item as any).name });
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
