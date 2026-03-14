// ============================================================
// CONVERTER SHARED ZOD SCHEMAS
// File: src/app/modules/converter/shared/schemas/converter.schemas.ts
// ============================================================

import { z } from 'zod';

/** Validates a File object with max size constraint */
export function fileSchema(maxSizeMB: number, mimePrefix?: string) {
  let schema = z.instanceof(File).refine(
    (f) => f.size <= maxSizeMB * 1024 * 1024,
    { message: `File must be ${maxSizeMB} MB or smaller` }
  );
  if (mimePrefix) {
    schema = schema.refine(
      (f) => f.type.startsWith(mimePrefix),
      { message: `File must be ${mimePrefix} type` }
    ) as unknown as typeof schema;
  }
  return schema;
}

/** Base processing status enum */
export const ProcessingStatusSchema = z.enum([
  'idle', 'loading', 'processing', 'done', 'error'
]);

/** Base error code enum */
export const ConverterErrorCodeSchema = z.enum([
  'FILE_TOO_LARGE', 'INVALID_FILE_TYPE', 'UNSUPPORTED_FORMAT',
  'CONVERSION_FAILED', 'FFMPEG_LOAD_FAILED', 'FFMPEG_TIMEOUT',
  'WORKER_CRASHED', 'WORKER_TIMEOUT', 'WASM_NOT_AVAILABLE',
  'NETWORK_ERROR', 'INVALID_PARAMS', 'OUTPUT_TOO_LARGE',
  'COLOR_PARSE_ERROR', 'ENCODING_ERROR', 'UNKNOWN_ERROR'
]);
