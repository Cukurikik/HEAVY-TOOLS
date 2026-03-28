/**
 * Web Worker — Data Converter (Layer 3)
 * Handles: JSON↔YAML, CSV↔JSON, XML↔JSON, Markdown↔HTML,
 *          Subtitle, Spreadsheet, Magic Byte Detector
 *
 * Offloads text/data parsing from main thread to prevent UI freeze.
 */

import { processJsonYaml } from '../engines/json-yaml.engine';
import { processCsvJson } from '../engines/csv-json.engine';
import { processXmlJson } from '../engines/xml-json.engine';
import { processMarkdownHtml } from '../engines/markdown-html.engine';
import { processSubtitleConverter } from '../engines/subtitle-converter.engine';
import { processSpreadsheetConverter } from '../engines/spreadsheet-converter.engine';
import { processMagicByteDetector } from '../engines/magic-byte-detector.engine';

const ENGINE_MAP: Record<string, Function> = {
  'json-yaml': processJsonYaml,
  'csv-json': processCsvJson,
  'xml-json': processXmlJson,
  'markdown-html': processMarkdownHtml,
  'subtitle-converter': processSubtitleConverter,
  'spreadsheet-converter': processSpreadsheetConverter,
  'magic-byte-detector': processMagicByteDetector,
};

self.onmessage = async (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type !== 'PROCESS') return;

  try {
    const engine = ENGINE_MAP[payload.operation];
    if (!engine) {
      throw new Error(`[data-converter.worker] No engine for operation: ${payload.operation}`);
    }

    const onProgress = (p: number) => {
      self.postMessage({ type: 'PROGRESS', progress: Math.min(Math.round(p), 99) });
    };

    const result = await engine(payload.task, onProgress);

    // Serialize result — can be Blob, string, or array
    if (result instanceof Blob) {
      const buffer = await result.arrayBuffer();
      self.postMessage(
        { type: 'DONE', result: buffer, resultType: 'blob', mimeType: result.type },
        [buffer]  // Transfer ownership for zero-copy
      );
    } else if (Array.isArray(result)) {
      self.postMessage({ type: 'DONE', result, resultType: 'array' });
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
