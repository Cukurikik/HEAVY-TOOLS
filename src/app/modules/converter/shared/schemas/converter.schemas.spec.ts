import { describe, it, expect } from 'vitest';
import { fileSchema, ProcessingStatusSchema, ConverterErrorCodeSchema } from './converter.schemas';

describe('converter.schemas', () => {
  describe('fileSchema', () => {
    it('should validate a file within size limits', () => {
      const schema = fileSchema(1); // 1 MB
      const file = new File(['a'.repeat(500 * 1024)], 'test.txt', { type: 'text/plain' });
      const result = schema.safeParse(file);
      expect(result.success).toBe(true);
    });

    it('should fail validation for a file exceeding size limits', () => {
      const maxSizeMB = 1;
      const schema = fileSchema(maxSizeMB);
      const file = new File(['a'.repeat(maxSizeMB * 1024 * 1024 + 1)], 'test.txt', { type: 'text/plain' });
      const result = schema.safeParse(file);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(`File must be ${maxSizeMB} MB or smaller`);
      }
    });

    it('should validate a file exactly at the size limit', () => {
      const maxSizeMB = 1;
      const schema = fileSchema(maxSizeMB);
      const file = new File(['a'.repeat(maxSizeMB * 1024 * 1024)], 'test.txt', { type: 'text/plain' });
      const result = schema.safeParse(file);
      expect(result.success).toBe(true);
    });

    it('should validate a file with matching mime type prefix', () => {
      const schema = fileSchema(1, 'image/');
      const file = new File(['image-content'], 'test.png', { type: 'image/png' });
      const result = schema.safeParse(file);
      expect(result.success).toBe(true);
    });

    it('should fail validation for a file with non-matching mime type prefix', () => {
      const mimePrefix = 'image/';
      const schema = fileSchema(1, mimePrefix);
      const file = new File(['text-content'], 'test.txt', { type: 'text/plain' });
      const result = schema.safeParse(file);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(`File must be ${mimePrefix} type`);
      }
    });
  });

  describe('ProcessingStatusSchema', () => {
    it('should validate correct status values', () => {
      expect(ProcessingStatusSchema.safeParse('idle').success).toBe(true);
      expect(ProcessingStatusSchema.safeParse('loading').success).toBe(true);
      expect(ProcessingStatusSchema.safeParse('processing').success).toBe(true);
      expect(ProcessingStatusSchema.safeParse('done').success).toBe(true);
      expect(ProcessingStatusSchema.safeParse('error').success).toBe(true);
    });

    it('should fail on invalid status values', () => {
      expect(ProcessingStatusSchema.safeParse('invalid').success).toBe(false);
    });
  });

  describe('ConverterErrorCodeSchema', () => {
    it('should validate correct error code values', () => {
      expect(ConverterErrorCodeSchema.safeParse('FILE_TOO_LARGE').success).toBe(true);
      expect(ConverterErrorCodeSchema.safeParse('UNKNOWN_ERROR').success).toBe(true);
    });

    it('should fail on invalid error code values', () => {
      expect(ConverterErrorCodeSchema.safeParse('INVALID_ERROR_CODE').success).toBe(false);
    });
  });
});
