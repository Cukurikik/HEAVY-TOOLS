import type { PdfErrorCode } from '../types/pdf.types';

export const PdfErrorMessages: Record<PdfErrorCode, string> = {
  FILE_TOO_LARGE: 'File exceeds the 500 MB size limit',
  INVALID_FILE_TYPE: 'Only PDF files are accepted',
  FILE_CORRUPTED: 'The PDF file appears to be corrupted or invalid',
  PASSWORD_REQUIRED: 'This PDF is encrypted — please enter the password',
  INCORRECT_PASSPHRASE: 'Incorrect password — please try again',
  PERMISSION_DENIED: 'This PDF has restrictions that prevent this operation',
  PAGE_OUT_OF_RANGE: 'The specified page range is invalid or out of bounds',
  MERGE_FAILED: 'Failed to merge PDF files. Some files may be corrupted or encrypted.',
  SPLIT_FAILED: 'Failed to split PDF. The document may have missing resources.',
  COMPRESS_FAILED: 'Compression failed. Ghostscript encountered a fatal error.',
  OCR_FAILED: 'Text extraction failed. The document might just be images or have corrupted fonts.',
  OCR_MODEL_MISSING: 'Failed to load Tesseract.js language models.',
  GHOSTSCRIPT_LOAD_FAILED: 'Failed to load the Ghostscript WASM binary.',
  GHOSTSCRIPT_TIMEOUT: 'Ghostscript operation timed out (exceeded 5 minutes).',
  PDFLIB_ERROR: 'pdf-lib encountered a structural error while parsing the file.',
  RENDER_FAILED: 'PDF.js rendering crashed on this specific page.',
  FORM_FIELD_NOT_FOUND: 'The specified form field does not exist in this document.',
  SIGNATURE_FAILED: 'Failed to digitally sign document. Check credentials.',
  WORKER_CRASHED: 'The background worker crashed due to an Out-of-Memory (OOM) error.',
  WORKER_TIMEOUT: 'The background worker took too long to respond.',
  UNKNOWN_ERROR: 'An unknown error occurred during processing.' };

export const PdfErrorRetryable: Record<PdfErrorCode, boolean> = {
  GHOSTSCRIPT_LOAD_FAILED: true,
  GHOSTSCRIPT_TIMEOUT: true,
  WORKER_CRASHED: true,
  WORKER_TIMEOUT: true,
  FILE_CORRUPTED: false,
  PASSWORD_REQUIRED: false,
  INCORRECT_PASSPHRASE: true,
  FILE_TOO_LARGE: false,
  INVALID_FILE_TYPE: false,
  PERMISSION_DENIED: false,
  PAGE_OUT_OF_RANGE: true,
  MERGE_FAILED: false,
  SPLIT_FAILED: false,
  COMPRESS_FAILED: false,
  OCR_FAILED: true,
  OCR_MODEL_MISSING: true,
  PDFLIB_ERROR: false,
  RENDER_FAILED: false,
  FORM_FIELD_NOT_FOUND: false,
  SIGNATURE_FAILED: false,
  UNKNOWN_ERROR: true };

export function getPdfError(code: PdfErrorCode): { message: string, retryable: boolean } {
  return {
    message: PdfErrorMessages[code] || PdfErrorMessages['UNKNOWN_ERROR'],
    retryable: PdfErrorRetryable[code] ?? true
  };
}
