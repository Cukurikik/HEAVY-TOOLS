// ============================================================
// WORKER BRIDGE SERVICE — Generic Worker ↔ NgRx bridge
// File: src/app/modules/converter/shared/engine/worker-bridge.service.ts
// ============================================================

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkerMessage } from '../types/converter.types';

@Injectable({ providedIn: 'root' })
export class ConverterWorkerBridgeService {

  /**
   * Spawns a Web Worker, sends config, and returns an Observable stream
   * of WorkerMessage events (progress, complete, error).
   */
  process<TConfig, TResult>(
    workerFactory: () => Worker,
    config: TConfig
  ): Observable<WorkerMessage<TResult>> {
    return new Observable<WorkerMessage<TResult>>((subscriber) => {
      let worker: Worker | null = null;
      try {
        worker = workerFactory();
      } catch (err) {
        subscriber.next({
          type: 'error',
          errorCode: 'WORKER_CRASHED',
          message: 'Failed to create Web Worker: ' + String(err),
        });
        subscriber.complete();
        return;
      }

      worker.onmessage = (event: MessageEvent<WorkerMessage<TResult>>) => {
        const msg = event.data;
        subscriber.next(msg);
        if (msg.type === 'complete' || msg.type === 'error') {
          subscriber.complete();
        }
      };

      worker.onerror = (error: ErrorEvent) => {
        subscriber.next({
          type: 'error',
          errorCode: 'WORKER_CRASHED',
          message: error.message || 'Worker encountered an unexpected error',
        });
        subscriber.complete();
      };

      // Send config to worker — transfer File as-is (structured clone)
      worker.postMessage(config);

      // Teardown: terminate worker on unsubscribe
      return () => {
        if (worker) {
          worker.terminate();
          worker = null;
        }
      };
    });
  }

  /**
   * Read a File as ArrayBuffer for transfer to Worker
   */
  async buildTransferable(file: File): Promise<ArrayBuffer> {
    return file.arrayBuffer();
  }
}
