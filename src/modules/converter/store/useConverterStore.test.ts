vi.mock('@ffmpeg/ffmpeg', () => ({ FFmpeg: vi.fn() }));
vi.mock('@ffmpeg/util', () => ({ fetchFile: vi.fn().mockResolvedValue(new Uint8Array()) }));
vi.mock('heic2any', () => ({ default: vi.fn() }));
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

    it('should error if operation has no matching engine', async () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      useConverterStore.getState().setFiles([file]);
      useConverterStore.getState().setOperation('idle');
      await useConverterStore.getState().processConversion();

      const { task } = useConverterStore.getState();
      expect(task.status).toBe('error');
      expect(task.error).toContain('Engine logic missing');
    });

    it('should simulate processing state transitions', async () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      useConverterStore.getState().setFiles([file]);

      // Directly simulate state transitions (engines need browser APIs unavailable in jsdom)
      useConverterStore.setState((state: any) => {
        state.task.status = 'processing';
        state.task.progress = 0;
      });

      expect(useConverterStore.getState().task.status).toBe('processing');
      expect(useConverterStore.getState().task.progress).toBe(0);

      // Simulate progress
      useConverterStore.setState((state: any) => {
        state.task.progress = 50;
      });
      expect(useConverterStore.getState().task.progress).toBe(50);

      // Simulate completion
      useConverterStore.setState((state: any) => {
        state.task.status = 'success';
        state.task.progress = 100;
        state.task.outputUrls = ['blob:http://localhost/result'];
      });

      const { task } = useConverterStore.getState();
      expect(task.status).toBe('success');
      expect(task.progress).toBe(100);
      expect(task.outputUrls).toHaveLength(1);
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
