import { describe, it, expect } from 'vitest';
import {
  buildTrimmerArgs,
  getTrimmerOutputName,
  getTrimmerMimeType,
} from './trimmer.engine';

describe('Trimmer Engine', () => {
  describe('buildTrimmerArgs', () => {
    it('should build arguments with provided start and end times', () => {
      const input = 'input.mp3';
      const output = 'output.mp3';
      const opts = { start: '00:01:00', end: '00:02:00' };

      const args = buildTrimmerArgs(input, output, opts);

      expect(args).toEqual([
        '-i',
        'input.mp3',
        '-ss',
        '00:01:00',
        '-to',
        '00:02:00',
        '-c',
        'copy',
        'output.mp3',
      ]);
    });

    it('should use default start and end times if not provided', () => {
      const input = 'input.mp3';
      const output = 'output.mp3';
      const opts = {};

      const args = buildTrimmerArgs(input, output, opts);

      expect(args).toEqual([
        '-i',
        'input.mp3',
        '-ss',
        '00:00:00',
        '-to',
        '00:00:10',
        '-c',
        'copy',
        'output.mp3',
      ]);
    });

    it('should use default start and end times if provided as empty strings', () => {
      const input = 'input.mp3';
      const output = 'output.mp3';
      const opts = { start: '', end: '' };

      const args = buildTrimmerArgs(input, output, opts);

      expect(args).toEqual([
        '-i',
        'input.mp3',
        '-ss',
        '00:00:00',
        '-to',
        '00:00:10',
        '-c',
        'copy',
        'output.mp3',
      ]);
    });
  });

  describe('getTrimmerOutputName', () => {
    it('should return the correct output name', () => {
      expect(getTrimmerOutputName()).toBe('output.mp3');
    });
  });

  describe('getTrimmerMimeType', () => {
    it('should return the correct MIME type', () => {
      expect(getTrimmerMimeType()).toBe('audio/mpeg');
    });
  });
});
