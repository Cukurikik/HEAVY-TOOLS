vi.mock('@ffmpeg/ffmpeg', () => ({ FFmpeg: vi.fn() }));
vi.mock('@ffmpeg/util', () => ({ fetchFile: vi.fn().mockResolvedValue(new Uint8Array()) }));
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useConverterStore } from './useConverterStore';

describe('useConverterStore', () => {
  beforeEach(() => {
    useConverterStore.getState().reset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with default state', () => {
    const { task } = useConverterStore.getState();
    const { createdAt, ...taskWithoutDate } = task;
    expect(taskWithoutDate).toEqual({
      id: '',
      files: [],
      operation: 'idle',
      status: 'idle',
      progress: 0,
      outputUrls: [],
      options: {},
      outputFormat: ''
    });
    expect(createdAt).toBeInstanceOf(Date);
  });

  it('should set file and generate a new id', () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });

    // Mock crypto.randomUUID
    const mockUUID = '123e4567-e89b-12d3-a456-426614174000';
    vi.stubGlobal('crypto', {
      randomUUID: () => mockUUID,
    });

    useConverterStore.getState().setFiles([file]);
    const { task } = useConverterStore.getState();

    expect(task.files[0]).toBe(file);
    expect(task.id).toBe(mockUUID);
    expect(task.operation).toBe('idle');
    expect(task.status).toBe('idle');
    expect(task.progress).toBe(0);

    vi.unstubAllGlobals();
  });

  it('should set operation', () => {
    useConverterStore.getState().setOperation('document');
    const { task } = useConverterStore.getState();

    expect(task.operation).toBe('document');
  });

  describe('processConversion', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should not process if file is missing', async () => {
      useConverterStore.getState().setOperation('document');
      await useConverterStore.getState().processConversion();

      const { task } = useConverterStore.getState();
      expect(task.status).toBe('idle');
    });

    it('should not process if operation is idle', async () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      useConverterStore.getState().setFiles([file]);
      useConverterStore.getState().setOperation('idle');
      await useConverterStore.getState().processConversion();

      const { task } = useConverterStore.getState();
      expect(task.status).toBe('error');
    });

    it('should simulate processing correctly', async () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      useConverterStore.getState().setFiles([file]);

      const engines = await import('../engines');
      (engines as any).processVideo = vi.fn().mockImplementation(async (task, onProgress) => {
        // use fake timer to delay so we can check the intermediate state
        return new Promise(resolve => {
          setTimeout(() => {
            onProgress(50);
            resolve('mock-url');
          }, 100);
        });
      });

      useConverterStore.getState().setOperation('video');
      const processPromise = useConverterStore.getState().processConversion();

      // Immediately after calling processConversion, it should be 'processing' with 0 progress
      expect(useConverterStore.getState().task.status).toBe('processing');
      expect(useConverterStore.getState().task.progress).toBe(0);

      await vi.advanceTimersByTimeAsync(150);
      await processPromise;

      const { task } = useConverterStore.getState();
      expect(task.status).toBe('success');
      expect(task.progress).toBe(100);
    });
  });

  it('should reset state correctly', () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    useConverterStore.getState().setFiles([file]);
    useConverterStore.getState().setOperation('document');

    useConverterStore.getState().reset();

    const { task } = useConverterStore.getState();
    const { createdAt, ...taskWithoutDate } = task;
    expect(taskWithoutDate).toEqual({
      id: '',
      files: [],
      operation: 'idle',
      status: 'idle',
      progress: 0,
      outputUrls: [],
      options: {},
      outputFormat: ''
    });
    expect(createdAt).toBeInstanceOf(Date);
  });
});
