import { TestBed } from '@angular/core/testing';
import { AudioWorkerBridgeService } from './worker-bridge.service';
import { describe, it, expect, beforeEach } from 'vitest';
import type { WorkerMessage } from '../types/audio.types';

describe('AudioWorkerBridgeService', () => {
  let service: AudioWorkerBridgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AudioWorkerBridgeService]
    });
    service = TestBed.inject(AudioWorkerBridgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('process', () => {
    it('should return an observable that errors immediately if workerFactory throws', () => {
      const failingFactory = () => {
        throw new Error('Simulation of factory crash');
      };

      const observable$ = service.process(failingFactory, { test: true });

      return new Promise<void>((resolve, reject) => {
        observable$.subscribe({
          next: () => reject(new Error('Should not emit next')),
          error: (err: WorkerMessage<any>) => {
            try {
              expect(err).toEqual({
                type: 'error',
                errorCode: 'WORKER_CRASHED',
                message: 'Worker could not be started.'
              });
              resolve();
            } catch (e) {
              reject(e);
            }
          },
          complete: () => reject(new Error('Should not complete without error'))
        });
      });
    });

    it('should start worker and emit messages correctly', () => {
      let postedMessage: any = null;
      let onmessageCallback: any = null;

      const mockWorker = {
        postMessage: (msg: any) => { postedMessage = msg; },
        terminate: () => {},
        set onmessage(cb: any) { onmessageCallback = cb; },
        set onerror(cb: any) { },
      } as unknown as Worker;

      const mockFactory = () => mockWorker;

      const observable$ = service.process(mockFactory, { data: 'test' });

      const promise = new Promise<void>((resolve, reject) => {
        observable$.subscribe({
          next: (msg) => {
            try {
              expect(msg).toEqual({ type: 'progress', progress: 50 });
              resolve();
            } catch (e) {
              reject(e);
            }
          },
          error: reject
        });
      });

      expect(postedMessage).toEqual({ type: 'start', config: { data: 'test' } });

      if (onmessageCallback) {
        onmessageCallback({ data: { type: 'progress', progress: 50 } } as MessageEvent);
      } else {
        throw new Error('onmessage was not bound');
      }

      return promise;
    });
  });
});
