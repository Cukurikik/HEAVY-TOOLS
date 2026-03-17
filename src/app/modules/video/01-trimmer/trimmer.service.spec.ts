import { describe, it, expect } from 'vitest';
import { TrimmerService } from './trimmer.service';

describe('TrimmerService', () => {
  const service = new TrimmerService();

  describe('validate', () => {
    it('should return null for valid start and end times', () => {
      expect(service.validate(10, 20)).toBeNull();
      expect(service.validate(0, 0.1)).toBeNull();
    });

    it('should return error when end time is less than or equal to start time', () => {
      expect(service.validate(20, 10)).toBe('End time must be after start time');
      expect(service.validate(10, 10)).toBe('End time must be after start time');
    });

    it('should return error when duration is less than 0.1 seconds', () => {
      expect(service.validate(10, 10.05)).toBe('Clip must be at least 0.1 seconds');
      expect(service.validate(0, 0.09)).toBe('Clip must be at least 0.1 seconds');
    });
  });

  describe('buildArgs', () => {
    it('should build correct FFmpeg arguments', () => {
      const args = service.buildArgs('input.mp4', 10, 25, 'mp4');
      expect(args).toEqual([
        '-ss', '10',
        '-i', 'input.mp4',
        '-t', '15',
        '-c', 'copy',
        'output.mp4'
      ]);
    });

    it('should handle different formats and times', () => {
      const args = service.buildArgs('test.mkv', 0, 10.5, 'avi');
      expect(args).toEqual([
        '-ss', '0',
        '-i', 'test.mkv',
        '-t', '10.5',
        '-c', 'copy',
        'output.avi'
      ]);
    });
  });

  describe('formatTime', () => {
    it('should format seconds into M:SS.S format', () => {
      expect(service.formatTime(0)).toBe('0:00.0');
      expect(service.formatTime(5.5)).toBe('0:05.5');
      expect(service.formatTime(60)).toBe('1:00.0');
      expect(service.formatTime(65.23)).toBe('1:05.2');
      expect(service.formatTime(125)).toBe('2:05.0');
    });
  });
});
