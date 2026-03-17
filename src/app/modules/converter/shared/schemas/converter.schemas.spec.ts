import { describe, it, expect } from 'vitest';
import { fileSchema, ProcessingStatusSchema, ConverterErrorCodeSchema } from './converter.schemas';

describe('converter.schemas', () => {
  describe('fileSchema', () => {
    it('should validate a file within the size limit', () => {
      const schema = fileSchema(1); // 1MB limit
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      const result = schema.safeParse(file);
      expect(result.success).toBe(true);
    });

    it('should reject a file exceeding the size limit', () => {
      const schema = fileSchema(1); // 1MB limit
      // Create a file larger than 1MB
      const content = new Array(1024 * 1024 + 10).join('a');
      const file = new File([content], 'large.txt', { type: 'text/plain' });
      const result = schema.safeParse(file);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('File must be 1 MB or smaller');
      }
    });

    it('should accept a file of any mime type when mimePrefix is not provided', () => {
      const schema = fileSchema(1); // No mimePrefix
      const file1 = new File(['content'], 'test.txt', { type: 'text/plain' });
      const file2 = new File(['content'], 'image.png', { type: 'image/png' });

      expect(schema.safeParse(file1).success).toBe(true);
      expect(schema.safeParse(file2).success).toBe(true);
    });

    it('should accept a file matching the provided mimePrefix', () => {
      const schema = fileSchema(1, 'image/');
      const file = new File(['content'], 'image.png', { type: 'image/png' });
      const result = schema.safeParse(file);
      expect(result.success).toBe(true);
    });

    it('should reject a file not matching the provided mimePrefix', () => {
      const schema = fileSchema(1, 'image/');
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      const result = schema.safeParse(file);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('File must be image/ type');
      }
    });

    it('should reject non-File inputs', () => {
      const schema = fileSchema(1);
      const result = schema.safeParse('not a file');
      expect(result.success).toBe(false);
    });
  });

  describe('ProcessingStatusSchema', () => {
    it('should accept valid statuses', () => {
      const validStatuses = ['idle', 'loading', 'processing', 'done', 'error'];
      for (const status of validStatuses) {
        expect(ProcessingStatusSchema.safeParse(status).success).toBe(true);
      }
    });

    it('should reject invalid statuses', () => {
      expect(ProcessingStatusSchema.safeParse('invalid').success).toBe(false);
      expect(ProcessingStatusSchema.safeParse('').success).toBe(false);
      expect(ProcessingStatusSchema.safeParse(null).success).toBe(false);
      expect(ProcessingStatusSchema.safeParse(123).success).toBe(false);
    });
  });

  describe('ConverterErrorCodeSchema', () => {
    it('should accept valid error codes', () => {
      const validErrorCodes = [
        'FILE_TOO_LARGE', 'INVALID_FILE_TYPE', 'UNSUPPORTED_FORMAT',
        'CONVERSION_FAILED', 'FFMPEG_LOAD_FAILED', 'FFMPEG_TIMEOUT',
        'WORKER_CRASHED', 'WORKER_TIMEOUT', 'WASM_NOT_AVAILABLE',
        'NETWORK_ERROR', 'INVALID_PARAMS', 'OUTPUT_TOO_LARGE',
        'COLOR_PARSE_ERROR', 'ENCODING_ERROR', 'UNKNOWN_ERROR'
      ];
      for (const code of validErrorCodes) {
        expect(ConverterErrorCodeSchema.safeParse(code).success).toBe(true);
      }
    });

    it('should reject invalid error codes', () => {
      expect(ConverterErrorCodeSchema.safeParse('SOME_OTHER_ERROR').success).toBe(false);
      expect(ConverterErrorCodeSchema.safeParse('file_too_large').success).toBe(false);
      expect(ConverterErrorCodeSchema.safeParse('').success).toBe(false);
      expect(ConverterErrorCodeSchema.safeParse(undefined).success).toBe(false);
    });
  });
});
