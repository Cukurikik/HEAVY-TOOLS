import { TestBed } from '@angular/core/testing';
import { FFmpegAudioService } from './ffmpeg-audio.service';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// We track the callback registered by the service in global scope.
// Using inline factory vi.mock works around the Angular vitest-mock-patch bug.
let logCallback: ((event: { message: string }) => void) | null = null;
let mockExecImplementation: (args: string[]) => Promise<void> = async () => {};

const mockLoad = vi.fn().mockResolvedValue(undefined);
const mockExec = vi.fn().mockImplementation((args: string[]) => mockExecImplementation(args));
const mockWriteFile = vi.fn().mockResolvedValue(undefined);
const mockReadFile = vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3]));
const mockDeleteFile = vi.fn().mockResolvedValue(undefined);
const mockOn = vi.fn().mockImplementation((event: string, callback: any) => {
  if (event === 'log') logCallback = callback;
});

vi.mock('@ffmpeg/ffmpeg', () => {
  return {
    FFmpeg: vi.fn().mockImplementation(function() {
      return {
        load: mockLoad,
        exec: mockExec,
        writeFile: mockWriteFile,
        readFile: mockReadFile,
        deleteFile: mockDeleteFile,
        on: mockOn,
      };
    })
  };
});

vi.mock('@ffmpeg/util', () => {
  return {
    fetchFile: vi.fn().mockResolvedValue(new Uint8Array([0])),
    toBlobURL: vi.fn().mockResolvedValue('blob:url'),
  };
});

describe('FFmpegAudioService', () => {
  let service: FFmpegAudioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FFmpegAudioService]
    });
    service = TestBed.inject(FFmpegAudioService);

    // Reset default mock behavior
    logCallback = null;
    mockExecImplementation = async (args: string[]) => {
      // Default behavior for getMetadata tests: emit valid log if null output is used
      if (args.includes('null') && logCallback) {
        logCallback({ message: '  Duration: 00:01:05.50, start: 0.000000, bitrate: N/A' });
        logCallback({ message: '  Stream #0:0: Audio: pcm_s16le, 44100 Hz, 2 channels, s16, 1411 kb/s' });
      }
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('load()', () => {
    it('should initialize and load the FFmpeg instance', async () => {
      expect(service.loading()).toBe(false);
      const ff = await service.load();
      expect(ff).toBeTruthy();
      expect(service.loading()).toBe(false);
      expect(mockLoad).toHaveBeenCalledTimes(1);
    });

    it('should return the already loaded instance on subsequent calls', async () => {
      const ff1 = await service.load();
      const ff2 = await service.load();
      expect(ff1).toBe(ff2);
      expect(mockLoad).toHaveBeenCalledTimes(1);
    });
  });

  describe('runCommand()', () => {
    it('should execute a command with the provided arguments', async () => {
      await service.runCommand(['-version']);
      expect(mockExec).toHaveBeenCalledWith(['-version']);
    });
  });

  describe('writeInputFile()', () => {
    it('should write a file using fetchFile', async () => {
      const file = new File(['test'], 'test.wav', { type: 'audio/wav' });
      await service.writeInputFile('test.wav', file);
      expect(mockWriteFile).toHaveBeenCalledWith('test.wav', expect.any(Uint8Array));
    });
  });

  describe('readOutputFile()', () => {
    it('should read a file and return a Uint8Array', async () => {
      const data = await service.readOutputFile('out.wav');
      expect(mockReadFile).toHaveBeenCalledWith('out.wav');
      expect(data).toBeInstanceOf(Uint8Array);
      expect(data.length).toBeGreaterThan(0);
    });
  });

  describe('deleteFile()', () => {
    it('should delete the specified file', async () => {
      await service.deleteFile('test.wav');
      expect(mockDeleteFile).toHaveBeenCalledWith('test.wav');
    });
  });

  describe('getMetadata()', () => {
    it('should extract metadata from an audio file', async () => {
      const file = new File(['dummy'], 'test.mp3', { type: 'audio/mpeg' });

      const meta = await service.getMetadata(file);

      expect(mockWriteFile).toHaveBeenCalledWith('probe_in', expect.any(Uint8Array));
      expect(mockExec).toHaveBeenCalledWith(['-i', 'probe_in', '-f', 'null', '/dev/null']);
      expect(mockDeleteFile).toHaveBeenCalledWith('probe_in');

      expect(meta).toBeTruthy();
      expect(meta.filename).toBe('test.mp3');
      expect(meta.duration).toBe(65.5);
      expect(meta.sampleRate).toBe(44100);
      expect(meta.channels).toBe(2);
    });

    it('should handle missing duration gracefully', async () => {
      // Override mockExec to emit no logs
      mockExecImplementation = async () => {};

      const file = new File(['dummy'], 'empty.mp3', { type: 'audio/mpeg' });

      const meta = await service.getMetadata(file);

      expect(meta).toBeTruthy();
      expect(meta.filename).toBe('empty.mp3');
      expect(meta.duration).toBe(0); // Should fallback to 0
      expect(meta.sampleRate).toBe(44100); // Should fallback to 44100
    });
  });
});
