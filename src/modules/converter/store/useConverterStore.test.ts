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
    expect(task).toEqual({
      id: '',
      file: null,
      operation: 'idle',
      status: 'idle',
      progress: 0,
    });
  });

  it('should set file and generate a new id', () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });

    // Mock crypto.randomUUID
    const mockUUID = '123e4567-e89b-12d3-a456-426614174000';
    vi.stubGlobal('crypto', {
      randomUUID: () => mockUUID,
    });

    useConverterStore.getState().setFile(file);
    const { task } = useConverterStore.getState();

    expect(task.file).toBe(file);
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
      useConverterStore.getState().setFile(file);
      await useConverterStore.getState().processConversion();

      const { task } = useConverterStore.getState();
      expect(task.status).toBe('idle');
    });

    it('should simulate processing correctly', async () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      useConverterStore.getState().setFile(file);
      useConverterStore.getState().setOperation('document');

      const processPromise = useConverterStore.getState().processConversion();

      // Immediately after calling processConversion, it should be 'processing' with 0 progress
      expect(useConverterStore.getState().task.status).toBe('processing');
      expect(useConverterStore.getState().task.progress).toBe(0);

      // Advance timers to trigger the setTimeout intervals
      for (let i = 0; i <= 100; i += 10) {
        await vi.advanceTimersByTimeAsync(120);
        expect(useConverterStore.getState().task.progress).toBe(i);
        if (i < 100) {
            expect(useConverterStore.getState().task.status).toBe('processing');
        }
      }

      await processPromise;

      const { task } = useConverterStore.getState();
      expect(task.status).toBe('success');
      expect(task.progress).toBe(100);
    });
  });

  it('should reset state correctly', () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    useConverterStore.getState().setFile(file);
    useConverterStore.getState().setOperation('document');

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
});
