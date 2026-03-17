import { TestBed } from '@angular/core/testing';
import { AudioWorkerBridgeService } from './worker-bridge.service';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import type { WorkerMessage } from '../types/audio.types';

describe('AudioWorkerBridgeService', () => {
  let service: AudioWorkerBridgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AudioWorkerBridgeService]
    });
    service = TestBed.inject(AudioWorkerBridgeService);

    // Setup generic mock for URL methods
    const mockURL = {
      createObjectURL: vi.fn().mockReturnValue('blob:mock'),
      revokeObjectURL: vi.fn()
    };

    vi.stubGlobal('URL', Object.assign(function URL() {}, mockURL));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit WORKER_CRASHED error when workerFactory throws during initialization', () => {
    const workerFactory = () => {
      throw new Error('Simulated failure');
    };

    let emittedError: any = null;
    service.process(workerFactory, {}).subscribe({
      error: (err) => {
        emittedError = err;
      }
    });

    expect(emittedError).toBeTruthy();
    expect(emittedError.type).toBe('error');
    expect(emittedError.errorCode).toBe('WORKER_CRASHED');
    expect(emittedError.message).toBe('Worker could not be started.');
  });

  it('should initialize worker, post start message, and handle completion', () => {
    const mockWorker = {
      postMessage: vi.fn(),
      terminate: vi.fn(),
      onmessage: null as any,
      onerror: null as any
    };

    const workerFactory = () => mockWorker as any as Worker;
    const config = { someConfig: true };

    const emittedMessages: WorkerMessage<any>[] = [];
    let isCompleted = false;

    service.process(workerFactory, config).subscribe({
      next: (msg) => emittedMessages.push(msg),
      complete: () => { isCompleted = true; },
      error: () => {}
    });

    // Check start message posted
    expect(mockWorker.postMessage).toHaveBeenCalledWith({ type: 'start', config });

    // Simulate progress message
    mockWorker.onmessage({ data: { type: 'progress', value: 50 } } as any);
    expect(emittedMessages.length).toBe(1);
    expect(emittedMessages[0].type).toBe('progress');

    // Simulate complete message
    mockWorker.onmessage({ data: { type: 'complete', data: 'result' } } as any);
    expect(emittedMessages.length).toBe(2);
    expect(emittedMessages[1].type).toBe('complete');

    // Check cleanup happened
    expect(isCompleted).toBe(true);
    expect(mockWorker.terminate).toHaveBeenCalled();
  });

  it('should emit WORKER_CRASHED when worker emits error event', () => {
    const mockWorker = {
      postMessage: vi.fn(),
      terminate: vi.fn(),
      onmessage: null as any,
      onerror: null as any
    };

    const workerFactory = () => mockWorker as any as Worker;

    const emittedMessages: WorkerMessage<any>[] = [];
    let isCompleted = false;

    service.process(workerFactory, {}).subscribe({
      next: (msg) => emittedMessages.push(msg),
      complete: () => { isCompleted = true; }
    });

    // Simulate worker error
    mockWorker.onerror({ message: 'Worker crashed internally' } as ErrorEvent);

    expect(emittedMessages.length).toBe(1);
    expect(emittedMessages[0].type).toBe('error');
    expect(emittedMessages[0].errorCode).toBe('WORKER_CRASHED');
    expect(emittedMessages[0].message).toBe('Worker crashed internally');

    expect(isCompleted).toBe(true);
    expect(mockWorker.terminate).toHaveBeenCalled();
  });

  it('should download a blob', async () => {
    const mockBlob = new Blob(['test'], { type: 'text/plain' });
    const mockA = {
      href: '',
      download: '',
      click: vi.fn()
    };

    vi.spyOn(document, 'createElement').mockReturnValue(mockA as any);
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => null as any);
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => null as any);

    vi.useFakeTimers();

    service.downloadBlob(mockBlob, 'test.txt');

    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(mockA.href).toBe('blob:mock');
    expect(mockA.download).toBe('test.txt');
    expect(mockA.click).toHaveBeenCalled();

    // Verify revoke object URL occurs after 150ms timeout
    vi.advanceTimersByTime(150);
    expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock');

    vi.useRealTimers();
  });

  it('should timeout after 60 seconds if not complete', async () => {
    const mockWorker = {
      postMessage: vi.fn(),
      terminate: vi.fn(),
      onmessage: null as any,
      onerror: null as any
    };

    const workerFactory = () => mockWorker as any as Worker;

    const emittedMessages: WorkerMessage<any>[] = [];
    let isCompleted = false;

    vi.useFakeTimers();

    service.process(workerFactory, {}).subscribe({
      next: (msg) => emittedMessages.push(msg),
      complete: () => { isCompleted = true; }
    });

    // Advance time by 60 seconds
    vi.advanceTimersByTime(60_000);

    expect(emittedMessages.length).toBe(1);
    expect(emittedMessages[0].type).toBe('error');
    expect(emittedMessages[0].errorCode).toBe('FFMPEG_TIMEOUT');
    expect(emittedMessages[0].message).toBe('Processing timed out after 60 seconds.');

    expect(isCompleted).toBe(true);
    expect(mockWorker.terminate).toHaveBeenCalled();

    vi.useRealTimers();
  });
});
