import { describe, it, expect, vi, beforeEach } from 'vitest';

const addEventListenerSpy = vi.fn();
const postMessageSpy = vi.fn();

vi.stubGlobal('addEventListener', addEventListenerSpy);
vi.stubGlobal('self', { postMessage: postMessageSpy });

describe('Compressor Worker', () => {
  let workerListener: (event: MessageEvent) => void;

  beforeEach(async () => {
    postMessageSpy.mockClear();

    // Since static imports execute before vi.stubGlobal, we MUST use a dynamic import.
    // In Angular's esbuild compiler, dynamic imports of local files are resolved correctly IF
    // they are a module and don't use arbitrary string expressions.
    // Instead of `Date.now()`, we can just import it directly since it's the first time we load it in tests!
    await import('./compressor.worker');

    expect(addEventListenerSpy).toHaveBeenCalledWith('message', expect.any(Function));

    // We grab the listener
    const lastCall = addEventListenerSpy.mock.calls[addEventListenerSpy.mock.calls.length - 1];
    workerListener = lastCall[1];
  });

  it('should emit progress and complete on successful processing', () => {
    const mockInputData = new Float32Array([0.1, 0.2, 0.3]);
    const mockEvent = {
      data: {
        config: {
          inputData: mockInputData
        }
      }
    } as MessageEvent;

    // Trigger listener
    workerListener(mockEvent);

    // Assert happy path emissions
    expect(postMessageSpy).toHaveBeenCalledTimes(2);
    expect(postMessageSpy).toHaveBeenNthCalledWith(1, { type: 'progress', value: 50 });
    expect(postMessageSpy).toHaveBeenNthCalledWith(2, { type: 'complete', data: mockInputData });
  });

  it('should emit error when config is missing (causing TypeError)', () => {
    const mockEvent = {} as MessageEvent;

    // Trigger listener
    workerListener(mockEvent);

    // Assert error handling
    expect(postMessageSpy).toHaveBeenCalledTimes(1);

    // Check that we got an error message back with the WORKER_CRASHED code
    const errorCallArgs = postMessageSpy.mock.calls[0][0];
    expect(errorCallArgs.type).toBe('error');
    expect(errorCallArgs.errorCode).toBe('WORKER_CRASHED');
    expect(typeof errorCallArgs.message).toBe('string');
    // Ensure it's not the fallback "Unknown worker error" if it's a TypeError
    expect(errorCallArgs.message.length).toBeGreaterThan(0);
  });
});
