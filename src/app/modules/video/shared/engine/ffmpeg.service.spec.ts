import { TestBed } from '@angular/core/testing';
import { FFmpegService } from './ffmpeg.service';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Define the mock instance outside so it can be accessed in tests
const mockFFmpegInstance = {
  load: vi.fn().mockResolvedValue(undefined),
  writeFile: vi.fn().mockResolvedValue(undefined),
  on: vi.fn(),
  exec: vi.fn().mockResolvedValue(undefined),
  deleteFile: vi.fn().mockImplementation(() => {}),
  readFile: vi.fn().mockResolvedValue(new Uint8Array(0)),
};

// Mock the dynamic imports
vi.mock('@ffmpeg/ffmpeg', () => {
  return {
    FFmpeg: vi.fn().mockImplementation(function() {
      return mockFFmpegInstance;
    })
  };
});

vi.mock('@ffmpeg/util', () => {
  return {
    toBlobURL: vi.fn().mockResolvedValue('blob:url'),
    fetchFile: vi.fn().mockResolvedValue(new Uint8Array(0)),
  };
});

describe('FFmpegService', () => {
  let service: FFmpegService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FFmpegService]
    });
    service = TestBed.inject(FFmpegService);

    // Reset all mocks before each test
    vi.clearAllMocks();
    mockFFmpegInstance.load.mockResolvedValue(undefined);
    mockFFmpegInstance.writeFile.mockResolvedValue(undefined);
    mockFFmpegInstance.exec.mockResolvedValue(undefined);
    mockFFmpegInstance.deleteFile.mockImplementation(() => {});
    mockFFmpegInstance.readFile.mockResolvedValue(new Uint8Array(0));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMetadata', () => {
    it('should swallow error when deleteFile fails in finally block', async () => {
      const mockFile = new File([], 'test.mp4', { type: 'video/mp4' });

      // Setup mock to throw in deleteFile
      mockFFmpegInstance.deleteFile.mockImplementation(() => {
        throw new Error('Delete failed');
      });

      // Mock log to provide some metadata
      mockFFmpegInstance.on.mockImplementation((event: string, cb: any) => {
        if (event === 'log') {
          cb({ message: 'Duration: 00:00:10.00, start: 0.000000, bitrate: 1000 kb/s' });
          cb({ message: 'Stream #0:0: Video: h264, 1920x1080, 30 fps' });
        }
      });

      // This should NOT throw despite deleteFile throwing
      const meta = await service.getMetadata(mockFile);

      expect(meta).toBeDefined();
      expect(meta.duration).toBe(10);
      expect(mockFFmpegInstance.deleteFile).toHaveBeenCalled();
    });
  });

  describe('deleteFile', () => {
    it('should swallow error when underlying FFmpeg deleteFile fails', async () => {
      // Ensure it is loaded so this.ffmpeg is not null
      await service.load();

      mockFFmpegInstance.deleteFile.mockImplementation(() => {
        throw new Error('Delete failed');
      });

      // This should NOT throw
      expect(() => service.deleteFile('somefile.mp4')).not.toThrow();
      expect(mockFFmpegInstance.deleteFile).toHaveBeenCalledWith('somefile.mp4');
    });

    it('should return early if ffmpeg is not loaded', () => {
      // @ts-ignore - reaching into private to reset for this specific test case
      service['ffmpeg'] = null;

      expect(() => service.deleteFile('somefile.mp4')).not.toThrow();
      expect(mockFFmpegInstance.deleteFile).not.toHaveBeenCalled();
    });
  });
});
