import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAudioStore } from '../useAudioStore';

// Mock getFFmpeg and fetchFile
vi.mock('@/app/video-titan/lib/ffmpeg', () => ({
  getFFmpeg: vi.fn(),
}));

vi.mock('@ffmpeg/util', () => ({
  fetchFile: vi.fn(),
}));

// Mock URL
global.URL.createObjectURL = vi.fn(() => 'blob:test-url');

// Mock crypto
if (!global.crypto) {
  global.crypto = {
    randomUUID: vi.fn(() => 'test-uuid-1234')
  } as any;
}

// Ensure clean state before each test
const initialStoreState = useAudioStore.getState();

describe('useAudioStore', () => {
  beforeEach(() => {
    useAudioStore.setState(initialStoreState, true);
    vi.clearAllMocks();
  });

  it('should have initial state', () => {
    const { task } = useAudioStore.getState();
    expect(task).toEqual({
      id: '',
      file: null,
      files: [],
      operation: 'idle',
      options: {},
      status: 'idle',
      progress: 0,
      resultUrl: '',
      error: '',
    });
  });

  it('should set file', () => {
    const file = new File([''], 'test.mp3', { type: 'audio/mp3' });
    useAudioStore.getState().setFile(file);

    const { task } = useAudioStore.getState();
    expect(task.file).toBe(file);
    expect(task.id).toBeDefined(); // Actually we mocked crypto to return a string
    expect(task.status).toBe('idle');
    expect(task.resultUrl).toBe('');
    expect(task.error).toBe('');
  });

  it('should add files', () => {
    const file1 = new File([''], 'test1.mp3', { type: 'audio/mp3' });
    const file2 = new File([''], 'test2.mp3', { type: 'audio/mp3' });

    useAudioStore.getState().addFiles([file1, file2]);
    const { task } = useAudioStore.getState();
    expect(task.files).toEqual([file1, file2]);
    expect(task.file).toBe(file1);

    const file3 = new File([''], 'test3.mp3', { type: 'audio/mp3' });
    useAudioStore.getState().addFiles([file3]);
    const task2 = useAudioStore.getState().task;
    expect(task2.files).toEqual([file1, file2, file3]);
  });

  it('should set operation', () => {
    useAudioStore.getState().setOperation('trimmer');
    expect(useAudioStore.getState().task.operation).toBe('trimmer');
  });

  it('should set options', () => {
    useAudioStore.getState().setOptions({ duration: 5 });
    expect(useAudioStore.getState().task.options).toEqual({ duration: 5 });

    useAudioStore.getState().setOptions({ format: 'wav' });
    expect(useAudioStore.getState().task.options).toEqual({ duration: 5, format: 'wav' });
  });

  it('should reset store to initial state', () => {
    useAudioStore.getState().setOperation('trimmer');
    useAudioStore.getState().setOptions({ duration: 5 });

    useAudioStore.getState().reset();
    const { task } = useAudioStore.getState();

    expect(task).toEqual(initialStoreState.task);
  });

  describe('processAudio', () => {
    // Tests for processAudio will be added here
    it('should handle voice recorder correctly', async () => {
      const mockStream = { getTracks: vi.fn(() => [{ stop: vi.fn() }]) };
      const mockRecorder = {
        start: vi.fn(),
        stop: vi.fn(),
        ondataavailable: null,
        onstop: null,
      };

      Object.defineProperty(global.navigator, 'mediaDevices', {
        value: {
          getUserMedia: vi.fn().mockResolvedValue(mockStream),
        },
        configurable: true
      });

      global.MediaRecorder = vi.fn().mockImplementation(function() { return mockRecorder; }) as any;

      const RealBlob = global.Blob;
      global.Blob = function(content: any[], options: any) {
        return new RealBlob(content, options);
      } as any;

      const store = useAudioStore.getState();
      store.setOperation('voice-recorder');
      store.setOptions({ duration: 0.01 });

      // Use fake timers to control execution of setTimeout in processAudio
      vi.useFakeTimers();

      // We need to wait for the async processAudio up to a point
      const processPromise = store.processAudio();

      expect(useAudioStore.getState().task.status).toBe('processing');
      expect(useAudioStore.getState().task.progress).toBe(0);

      // We can flush promises so the getUserMedia resolves
      await vi.advanceTimersByTimeAsync(1); // Small jump just for Promise ticks to resolve

      // Trigger the onstop
      if (mockRecorder.onstop) {
        (mockRecorder.onstop as any)();
      }

      // Finish any remaining timers
      await vi.runAllTimersAsync();

      await processPromise;

      if (useAudioStore.getState().task.status === 'error') {
        console.error(useAudioStore.getState().task.error);
      }

      expect(useAudioStore.getState().task.status).toBe('success');
      expect(useAudioStore.getState().task.progress).toBe(100);
      expect(useAudioStore.getState().task.resultUrl).toBe('blob:test-url');

      vi.useRealTimers();
    });

    it('should handle waveform-visualizer correctly', async () => {
      const mockFile = new File(['dummy content'], 'test.mp3', { type: 'audio/mp3' });
      mockFile.arrayBuffer = vi.fn().mockResolvedValue(new ArrayBuffer(10));

      const mockAudioBuffer = {
        numberOfChannels: 1,
        sampleRate: 44100,
        length: 100,
        getChannelData: vi.fn().mockReturnValue(new Float32Array(100)),
      };

      const mockAudioContext = {
        decodeAudioData: vi.fn().mockResolvedValue(mockAudioBuffer),
      };

      global.OfflineAudioContext = vi.fn().mockImplementation(function() { return mockAudioContext; }) as any;

      const RealDataView = global.DataView;
      global.DataView = function(buffer: ArrayBuffer) {
        const dv = new RealDataView(buffer);
        // Add stub methods if necessary to avoid crash in audioBufferToWav
        return dv;
      } as any;

      const store = useAudioStore.getState();
      store.setFile(mockFile);
      store.setOperation('waveform-visualizer');

      await store.processAudio();

      if (useAudioStore.getState().task.status === 'error') {
        console.error(useAudioStore.getState().task.error);
      }

      expect(useAudioStore.getState().task.status).toBe('success');
      expect(useAudioStore.getState().task.progress).toBe(100);
      expect(useAudioStore.getState().task.resultUrl).toBe('blob:test-url');

      global.DataView = RealDataView;
    });

    it('should handle trimmer correctly with FFmpeg', async () => {
      const { getFFmpeg } = await import('@/app/video-titan/lib/ffmpeg');
      const { fetchFile } = await import('@ffmpeg/util');

      const mockFFmpeg = {
        on: vi.fn(),
        off: vi.fn(),
        writeFile: vi.fn(),
        exec: vi.fn().mockResolvedValue(0),
        readFile: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
      };

      vi.mocked(getFFmpeg).mockResolvedValue(mockFFmpeg as any);
      vi.mocked(fetchFile).mockResolvedValue(new Uint8Array([0]) as any);

      const mockFile = new File(['dummy content'], 'test.mp3', { type: 'audio/mp3' });

      const store = useAudioStore.getState();
      store.setFile(mockFile);
      store.setOperation('trimmer');
      store.setOptions({ start: '00:00:01', end: '00:00:05' });

      await store.processAudio();

      expect(getFFmpeg).toHaveBeenCalled();
      expect(mockFFmpeg.writeFile).toHaveBeenCalledWith('input_audio.mp3', expect.anything());
      expect(mockFFmpeg.exec).toHaveBeenCalledWith(['-i', 'input_audio.mp3', '-ss', '00:00:01', '-to', '00:00:05', 'output.mp3']);
      expect(mockFFmpeg.readFile).toHaveBeenCalledWith('output.mp3');

      expect(useAudioStore.getState().task.status).toBe('success');
      expect(useAudioStore.getState().task.progress).toBe(100);
      expect(useAudioStore.getState().task.resultUrl).toBe('blob:test-url');
    });

    it('should handle FFmpeg failure', async () => {
      const { getFFmpeg } = await import('@/app/video-titan/lib/ffmpeg');
      const { fetchFile } = await import('@ffmpeg/util');

      const mockFFmpeg = {
        on: vi.fn(),
        off: vi.fn(),
        writeFile: vi.fn(),
        exec: vi.fn().mockResolvedValue(1), // FFmpeg fail
        readFile: vi.fn(),
      };

      vi.mocked(getFFmpeg).mockResolvedValue(mockFFmpeg as any);
      vi.mocked(fetchFile).mockResolvedValue(new Uint8Array([0]) as any);

      const mockFile = new File(['dummy content'], 'test.mp3', { type: 'audio/mp3' });

      const store = useAudioStore.getState();
      store.setFile(mockFile);
      store.setOperation('trimmer');

      await store.processAudio();

      expect(useAudioStore.getState().task.status).toBe('error');
      expect(useAudioStore.getState().task.error).toContain('FFmpeg failed with code 1');
    });
  });
});
