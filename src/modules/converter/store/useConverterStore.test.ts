import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useConverterStore } from './useConverterStore';

describe('useConverterStore', () => {
  beforeEach(() => {
    useConverterStore.getState().reset();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with default state', () => {
    const { task } = useConverterStore.getState();
    expect(task).toEqual({
      id: '',
      file: null,
      operation: 'idle',
      status: 'idle',
      progress: 0,
    });
  });

  it('should set file correctly', () => {
    const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
    useConverterStore.getState().setFile(mockFile);

    const { task } = useConverterStore.getState();
    expect(task.file).toBe(mockFile);
    expect(task.id).not.toBe('');
  });

  it('should set operation correctly', () => {
    useConverterStore.getState().setOperation('video');

    const { task } = useConverterStore.getState();
    expect(task.operation).toBe('video');
  });

  it('should reset state correctly', () => {
    const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
    useConverterStore.getState().setFile(mockFile);
    useConverterStore.getState().setOperation('audio');

    useConverterStore.getState().reset();

    const { task } = useConverterStore.getState();
    expect(task).toEqual({
      id: '',
      file: null,
      operation: 'idle',
      status: 'idle',
      progress: 0,
    });
  });

  it('should not process conversion if file is null', async () => {
    useConverterStore.getState().setOperation('video');

    const processPromise = useConverterStore.getState().processConversion();
    await processPromise;

    const { task } = useConverterStore.getState();
    expect(task.status).toBe('idle');
  });

  it('should not process conversion if operation is idle', async () => {
    const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
    useConverterStore.getState().setFile(mockFile);

    const processPromise = useConverterStore.getState().processConversion();
    await processPromise;

    const { task } = useConverterStore.getState();
    expect(task.status).toBe('idle');
  });

  it('should process conversion successfully', async () => {
    const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
    useConverterStore.getState().setFile(mockFile);
    useConverterStore.getState().setOperation('video');

    const processPromise = useConverterStore.getState().processConversion();

    // Status should be processing immediately
    expect(useConverterStore.getState().task.status).toBe('processing');
    expect(useConverterStore.getState().task.progress).toBe(0);

    // Advance timers for each iteration (10 iterations of 120ms)
    // plus the initial loop wait
    for (let i = 0; i <= 100; i += 10) {
      await vi.advanceTimersByTimeAsync(120);
      expect(useConverterStore.getState().task.progress).toBe(i);
    }

    await processPromise;

    const { task } = useConverterStore.getState();
    expect(task.status).toBe('success');
    expect(task.progress).toBe(100);
  });
});
