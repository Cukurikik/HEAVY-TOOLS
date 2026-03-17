import { TestBed } from '@angular/core/testing';
import { ConverterFFmpegService } from './ffmpeg.service';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Define the mock functions so we can control them in tests, properly hoisted
const { loadMock, FFmpegConstructorMock, toBlobURLMock } = vi.hoisted(() => {
  const loadMock = vi.fn().mockResolvedValue(undefined);
  return {
    loadMock,
    FFmpegConstructorMock: vi.fn().mockImplementation(function() {
      return { load: loadMock };
    }),
    toBlobURLMock: vi.fn().mockResolvedValue('blob:url'),
  };
});

// Mock the dynamic imports
vi.mock('@ffmpeg/ffmpeg', () => {
  return {
    FFmpeg: FFmpegConstructorMock,
  };
});

vi.mock('@ffmpeg/util', () => {
  return {
    toBlobURL: toBlobURLMock,
  };
});

describe('ConverterFFmpegService', () => {
  let service: ConverterFFmpegService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConverterFFmpegService]
    });
    service = TestBed.inject(ConverterFFmpegService);

    // Reset mocks to their default success states before each test
    loadMock.mockReset();
    loadMock.mockResolvedValue(undefined);

    toBlobURLMock.mockReset();
    toBlobURLMock.mockResolvedValue('blob:url');
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

  describe('load()', () => {
    it('should correctly load the FFmpeg instance and set isReady to true', async () => {
      expect(service.isReady()).toBe(false);

      const loadPromise = service.load();
      await loadPromise;

      expect(service.isReady()).toBe(true);
      expect(service.getInstance()).toBeTruthy();
      expect(toBlobURLMock).toHaveBeenCalledTimes(2);
      expect(loadMock).toHaveBeenCalledTimes(1);
    });

    it('should not try to load again if already loaded or currently loading', async () => {
      // First load call
      const promise1 = service.load();
      // Second load call immediately (while loading)
      // Because the method is declared async, it returns a NEW Promise every time
      // that resolves to the value of the internal promise.
      // So we can just await both and verify it only calls load once.
      const promise2 = service.load();

      await promise1;

      // Third call (after loaded)
      const promise3 = service.load();

      await promise3;

      // Still only one FFmpeg instantiation and load
      expect(loadMock).toHaveBeenCalledTimes(1);
    });

    it('should handle load failure, reset loadPromise, and throw an Error', async () => {
      // Make the load fail
      const testError = new Error('Network error');
      loadMock.mockRejectedValueOnce(testError);

      expect(service.isReady()).toBe(false);

      // The promise should reject
      await expect(service.load()).rejects.toThrow('FFmpeg WASM load failed: Error: Network error');

      // isReady should remain false
      expect(service.isReady()).toBe(false);
      expect(service.getInstance()).toBeNull();

      // Ensure loadPromise is reset to null (meaning another call will try again)
      // If it wasn't reset, this would not call loadMock again, but since it IS reset:

      loadMock.mockResolvedValueOnce(undefined); // Success on retry
      await service.load();

      expect(service.isReady()).toBe(true);
      expect(service.getInstance()).toBeTruthy();
      expect(loadMock).toHaveBeenCalledTimes(2); // One failed, one success
    });

    it('should handle toBlobURL failure, reset loadPromise, and throw an Error', async () => {
      const utilError = new Error('URL creation failed');
      toBlobURLMock.mockRejectedValueOnce(utilError);

      await expect(service.load()).rejects.toThrow('FFmpeg WASM load failed: Error: URL creation failed');

      expect(service.isReady()).toBe(false);

      // Try again and succeed
      toBlobURLMock.mockResolvedValue('blob:url');
      loadMock.mockResolvedValueOnce(undefined);

      await service.load();
      expect(service.isReady()).toBe(true);
      expect(toBlobURLMock).toHaveBeenCalledTimes(3); // 1 failed + 2 for success retry
    });
  });
});
