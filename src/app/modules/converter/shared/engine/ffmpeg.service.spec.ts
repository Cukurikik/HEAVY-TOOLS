import { TestBed } from '@angular/core/testing';
import { ConverterFFmpegService } from './ffmpeg.service';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock the dynamic imports
vi.mock('@ffmpeg/ffmpeg', () => {
  return {
    FFmpeg: vi.fn().mockImplementation(function() {
      return {
        load: vi.fn().mockResolvedValue(undefined),
      };
    })
  };
});

vi.mock('@ffmpeg/util', () => {
  return {
    toBlobURL: vi.fn().mockResolvedValue('blob:url'),
  };
});

describe('ConverterFFmpegService', () => {
  let service: ConverterFFmpegService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConverterFFmpegService]
    });
    service = TestBed.inject(ConverterFFmpegService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getInstance()', () => {
    it('should return null initially', () => {
      expect(service.getInstance()).toBeNull();
    });

    it('should return the FFmpeg instance after load() completes', async () => {
      // Initially null
      expect(service.getInstance()).toBeNull();

      // Call load and wait for it to complete
      await service.load();

      // After load, it should return the mocked FFmpeg instance
      const instance = service.getInstance();
      expect(instance).toBeTruthy();
      expect((instance as { load?: unknown }).load).toBeDefined();
    });
  });
});
