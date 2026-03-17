import '@angular/compiler';
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { FFmpegAudioService } from './ffmpeg-audio.service';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

vi.mock('@ffmpeg/ffmpeg', () => {
  return {
    FFmpeg: vi.fn().mockImplementation(function() {
      return {
        load: vi.fn().mockResolvedValue(undefined),
        exec: vi.fn().mockResolvedValue(undefined),
        writeFile: vi.fn().mockResolvedValue(undefined),
        readFile: vi.fn().mockResolvedValue(new Uint8Array(10)),
        deleteFile: vi.fn().mockResolvedValue(undefined),
        on: vi.fn(),
      };
    })
  };
});

vi.mock('@ffmpeg/util', () => {
  return {
    fetchFile: vi.fn().mockResolvedValue(new Uint8Array(10)),
    toBlobURL: vi.fn().mockResolvedValue('blob:url'),
  };
});

describe('FFmpegAudioService', () => {
  let service: FFmpegAudioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FFmpegAudioService],
    });
    service = TestBed.inject(FFmpegAudioService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMetadata', () => {
    it('should handle expected exec error during getMetadata without crashing', async () => {
      // We will spy on the mock FFmpeg instance
      // We need to first load it so it creates the instance
      const ff = await service.load();

      // Setup the "on" method to trigger the log listener when registered
      vi.mocked(ff.on).mockImplementation((event: string, callback: any) => {
        if (event === 'log') {
          // Simulate some log output for duration and sample rate
          callback({ message: '  Duration: 00:01:23.45, start: 0.000000, bitrate: N/A' });
          callback({ message: '  Stream #0:0: Audio: aac (LC), 48000 Hz, stereo, fltp' });
        }
      });

      // Setup the "exec" method to throw an error, simulating ffmpeg crashing/failing
      // (which is expected because we pass 'null' format for probing)
      vi.mocked(ff.exec).mockRejectedValue(new Error('simulated ffmpeg probe crash'));

      // Create a dummy file
      const dummyFile = new File(['dummy content'], 'test.mp3', { type: 'audio/mpeg' });

      // Call the method
      const result = await service.getMetadata(dummyFile);

      // Verify that the exec was called with correct probe arguments
      expect(ff.exec).toHaveBeenCalledWith(['-i', 'probe_in', '-f', 'null', '/dev/null']);

      // Verify it parsed the duration correctly: 1m23.45s = 60 + 23.45 = 83.45
      expect(result.duration).toBe(83.45);

      // Verify it parsed sample rate correctly
      expect(result.sampleRate).toBe(48000);

      // Verify default properties
      expect(result.filename).toBe('test.mp3');
      expect(result.channels).toBe(2);
      expect(result.bitDepth).toBe(16);
      expect(result.hasVideo).toBe(false);
    });
  });
});
