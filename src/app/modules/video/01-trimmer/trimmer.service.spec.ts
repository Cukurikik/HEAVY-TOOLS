import { describe, it, expect, beforeEach } from 'vitest';
import { TrimmerService } from './trimmer.service';

describe('TrimmerService', () => {
  let service: TrimmerService;

  beforeEach(() => {
    service = new TrimmerService();
  });

  describe('validate', () => {
    it('should return null for valid start and end times', () => {
      expect(service.validate(0, 10)).toBeNull();
      expect(service.validate(1.5, 2.0)).toBeNull();
      expect(service.validate(10, 10.1)).toBeNull();
    });

    it('should return "End time must be after start time" when end is less than start', () => {
      expect(service.validate(10, 5)).toBe('End time must be after start time');
    });

    it('should return "End time must be after start time" when end is equal to start', () => {
      expect(service.validate(5, 5)).toBe('End time must be after start time');
    });

    it('should return "Clip must be at least 0.1 seconds" when duration is less than 0.1', () => {
      expect(service.validate(0, 0.05)).toBe('Clip must be at least 0.1 seconds');
      expect(service.validate(1.0, 1.09)).toBe('Clip must be at least 0.1 seconds');
    });

    it('should handle zero values correctly', () => {
      expect(service.validate(0, 0.1)).toBeNull();
      expect(service.validate(0, 0)).toBe('End time must be after start time');
    });

    it('should handle negative values (if any)', () => {
      // While start/end times in video are usually non-negative, the logic should still be robust
      expect(service.validate(-10, -5)).toBeNull();
      expect(service.validate(-5, -10)).toBe('End time must be after start time');
      expect(service.validate(-0.1, 0)).toBeNull();
      expect(service.validate(-0.05, 0)).toBe('Clip must be at least 0.1 seconds');
    });

    it('should handle floating point precision issues', () => {
      // 0.3 - 0.2 is 0.09999999999999998 in IEEE 754
      // Let's see if the current logic handles it (it might fail if it's strictly < 0.1)
      expect(service.validate(0.2, 0.3)).toBeNull();
    });
  });

  describe('buildArgs', () => {
    it('should build correct ffmpeg arguments', () => {
      const args = service.buildArgs('input.mp4', 10, 15, 'mp4');
      expect(args).toEqual([
        '-ss', '10',
        '-i', 'input.mp4',
        '-t', '5',
        '-c', 'copy',
        'output.mp4'
      ]);
    });
  });

  describe('formatTime', () => {
    it('should format seconds correctly', () => {
      expect(service.formatTime(0)).toBe('0:00.0');
      expect(service.formatTime(65)).toBe('1:05.0');
      expect(service.formatTime(125.5)).toBe('2:05.5');
    });
  });
});
