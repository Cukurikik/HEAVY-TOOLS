// ============================================================
// CONVERTER ERROR MESSAGES
// File: src/app/modules/converter/shared/errors/converter.errors.ts
// ============================================================

import { ConverterErrorCode } from '../types/converter.types';

/** Human-readable error messages for each error code */
export const CONVERTER_ERROR_MESSAGES: Record<ConverterErrorCode, string> = {
  FILE_TOO_LARGE: 'The file exceeds the maximum allowed size.',
  INVALID_FILE_TYPE: 'This file type is not supported for this operation.',
  UNSUPPORTED_FORMAT: 'The selected output format is not supported for this input.',
  CONVERSION_FAILED: 'Conversion failed unexpectedly. Please try again.',
  FFMPEG_LOAD_FAILED: 'Failed to load the FFmpeg engine. Please refresh the page.',
  FFMPEG_TIMEOUT: 'FFmpeg processing timed out. The file may be too large.',
  WORKER_CRASHED: 'The processing worker crashed unexpectedly.',
  WORKER_TIMEOUT: 'Processing timed out. Try a smaller file or simpler settings.',
  WASM_NOT_AVAILABLE: 'WebAssembly is not available in your browser.',
  NETWORK_ERROR: 'A network error occurred while loading resources.',
  INVALID_PARAMS: 'Invalid parameters provided. Please check your settings.',
  OUTPUT_TOO_LARGE: 'The output file would be too large to process.',
  COLOR_PARSE_ERROR: 'Could not parse the provided color value.',
  ENCODING_ERROR: 'Text encoding/decoding failed.',
  UNKNOWN_ERROR: 'An unknown error occurred. Please try again.',
};

/** Get human-readable error message for a given error code */
export function getConverterErrorMessage(code: ConverterErrorCode): string {
  return CONVERTER_ERROR_MESSAGES[code] ?? CONVERTER_ERROR_MESSAGES['UNKNOWN_ERROR'];
}
