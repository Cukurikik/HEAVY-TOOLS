import { describe, it, expect, beforeEach, afterEach, vi, beforeAll } from 'vitest';
import { useImageStore } from './useImageStore';

beforeAll(() => {
  if (!global.crypto) {
    global.crypto = {
      randomUUID: () => 'test-uuid-1234'
    } as any;
  } else if (!global.crypto.randomUUID) {
    global.crypto.randomUUID = () => 'test-uuid-1234';
  }
});

describe('useImageStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useImageStore.getState().reset();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should have initial state', () => {
    const state = useImageStore.getState();
    expect(state.task).toEqual({
      id: '',
      file: null,
      operation: 'idle',
      status: 'idle',
      progress: 0,
    });
  });

  it('should set file and generate id', () => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    useImageStore.getState().setFile(file);

    const state = useImageStore.getState();
    expect(state.task.file).toBe(file);
    expect(state.task.id).not.toBe('');
  });

  it('should set operation', () => {
    useImageStore.getState().setOperation('upscale');
    const state = useImageStore.getState();
    expect(state.task.operation).toBe('upscale');
  });

  it('should not process image if file is null', async () => {
    useImageStore.getState().setOperation('upscale');

    const promise = useImageStore.getState().processImage();
    await promise;

    const state = useImageStore.getState();
    expect(state.task.status).toBe('idle');
  });

  it('should not process image if operation is idle', async () => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    useImageStore.getState().setFile(file);

    const promise = useImageStore.getState().processImage();
    await promise;

    const state = useImageStore.getState();
    expect(state.task.status).toBe('idle');
  });

  it('should process image successfully', async () => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    useImageStore.getState().setFile(file);
    useImageStore.getState().setOperation('upscale');

    const promise = useImageStore.getState().processImage();

    // Initial processing state
    expect(useImageStore.getState().task.status).toBe('processing');
    expect(useImageStore.getState().task.progress).toBe(0);

    // Fast-forward timers for processing loop
    // 100 iterations of += 10 until 100 means 11 steps: 0, 10, 20, ..., 100.
    // Actually the loop in processImage is:
    // for (let i = 0; i <= 100; i += 10) { await new Promise((resolve) => setTimeout(resolve, 100)); ... }
    // It has 11 iterations. We need to advance timers inside an async flow.
    for (let i = 0; i < 11; i++) {
      await vi.advanceTimersByTimeAsync(100);
    }

    await promise;

    const state = useImageStore.getState();
    expect(state.task.status).toBe('success');
    expect(state.task.progress).toBe(100);
  });

  it('should reset state', () => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    useImageStore.getState().setFile(file);
    useImageStore.getState().setOperation('upscale');

    useImageStore.getState().reset();

    const state = useImageStore.getState();
    expect(state.task).toEqual({
      id: '',
      file: null,
      operation: 'idle',
      status: 'idle',
      progress: 0,
    });
  });
});
