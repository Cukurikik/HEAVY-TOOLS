import { describe, it, expect, beforeEach } from 'vitest';
import { VideoConverterService } from './video-converter.service';

describe('VideoConverterService', () => {
  let service: VideoConverterService;

  beforeEach(() => {
    service = new VideoConverterService();
  });

  describe('buildFFmpegArgs', () => {
    it('should build args for webm output format', () => {
      const config = { outputFormat: 'webm', crf: 23, encodingSpeed: 'medium', resolution: 'original' };
      const args = service.buildFFmpegArgs(config);
      expect(args).toEqual([
        '-i', 'input',
        '-c:v', 'libvpx-vp9',
        '-c:a', 'libopus',
        'output.webm'
      ]);
    });

    it('should build args for gif output format', () => {
      const config = { outputFormat: 'gif', crf: 23, encodingSpeed: 'medium', resolution: 'original' };
      const args = service.buildFFmpegArgs(config);
      expect(args).toEqual([
        '-i', 'input',
        '-vf', 'fps=10,scale=320:-1',
        'output.gif'
      ]);
    });

    it('should build args for mp4/default output format', () => {
      const config = { outputFormat: 'mp4', crf: 28, encodingSpeed: 'fast', resolution: 'original' };
      const args = service.buildFFmpegArgs(config);
      expect(args).toEqual([
        '-i', 'input',
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-preset', 'fast',
        '-crf', '28',
        'output.mp4'
      ]);
    });

    it('should include resolution scaling if resolution is provided and not original', () => {
      const config = { outputFormat: 'mp4', crf: 23, encodingSpeed: 'medium', resolution: '1280:-1' };
      const args = service.buildFFmpegArgs(config);
      expect(args).toEqual([
        '-i', 'input',
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-preset', 'medium',
        '-crf', '23',
        '-vf', 'scale=1280:-1',
        'output.mp4'
      ]);
    });

    it('should not include resolution scaling if resolution is original', () => {
      const config = { outputFormat: 'mp4', crf: 23, encodingSpeed: 'medium', resolution: 'original' };
      const args = service.buildFFmpegArgs(config);
      expect(args).not.toContain('-vf');
      expect(args).toEqual([
        '-i', 'input',
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-preset', 'medium',
        '-crf', '23',
        'output.mp4'
      ]);
    });
  });

  describe('estimateOutputSize', () => {
    it('should calculate estimated size in MB correctly', () => {
      const size = service.estimateOutputSize(60, 5000000); // 60 seconds, 5Mbps
      // 60 * 5000000 / 8 / 1048576 = 35.762786865234375
      expect(size).toBeCloseTo(35.76, 2);
    });

    it('should return 0 for 0 duration or bitrate', () => {
      expect(service.estimateOutputSize(0, 5000000)).toBe(0);
      expect(service.estimateOutputSize(60, 0)).toBe(0);
    });
  });

  describe('parseFFmpegProgress', () => {
    it('should return percentage based on frame output', () => {
      const stderr = 'frame=  150 fps= 30 q=28.0 size=    2048kB time=00:00:05.00 bitrate=3355.4kbits/s speed=   1x';
      const percentage = service.parseFFmpegProgress(stderr, 300);
      expect(percentage).toBe(50);
    });

    it('should cap progress at 100%', () => {
      const stderr = 'frame=  350 fps= 30 q=28.0 size=    2048kB time=00:00:05.00 bitrate=3355.4kbits/s speed=   1x';
      const percentage = service.parseFFmpegProgress(stderr, 300);
      expect(percentage).toBe(100);
    });

    it('should return 0 if there is no frame match in stderr', () => {
      const stderr = 'Input #0, mov,mp4,m4a,3gp,3g2,mj2, from "input.mp4":';
      const percentage = service.parseFFmpegProgress(stderr, 300);
      expect(percentage).toBe(0);
    });

    it('should return 0 if totalFrames is 0 to avoid division by zero', () => {
      const stderr = 'frame=  150 fps= 30 q=28.0 size=    2048kB time=00:00:05.00 bitrate=3355.4kbits/s speed=   1x';
      const percentage = service.parseFFmpegProgress(stderr, 0);
      expect(percentage).toBe(0);
    });

    it('should return 0 if totalFrames is negative', () => {
      const stderr = 'frame=  150 fps= 30 q=28.0 size=    2048kB time=00:00:05.00 bitrate=3355.4kbits/s speed=   1x';
      const percentage = service.parseFFmpegProgress(stderr, -100);
      expect(percentage).toBe(0);
    });
  });
});
