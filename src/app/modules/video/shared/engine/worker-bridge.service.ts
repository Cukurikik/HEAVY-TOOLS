// ============================================================
// WORKER BRIDGE SERVICE — Generic Worker ↔ NgRx bridge
// File: src/app/modules/video/shared/engine/worker-bridge.service.ts
// ============================================================

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import type { WorkerMessage } from '../types/video.types';

@Injectable({ providedIn: 'root' })
export class WorkerBridgeService {
  /**
   * Creates a Worker using the provided factory, sends it a config,
   * and returns an Observable of typed WorkerMessage events.
   * Includes a 15-second watchdog that emits FFMPEG_TIMEOUT if the worker
   * doesn't complete in time.
   */
  process<TConfig, TOutput>(
    workerFactory: () => Worker,
    config: TConfig
  ): Observable<WorkerMessage<TOutput>> {
    const subject = new Subject<WorkerMessage<TOutput>>();
    let worker: Worker | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let done = false;

    const cleanup = () => {
      done = true;
      if (timeoutId !== null) clearTimeout(timeoutId);
      if (worker) { try { worker.terminate(); } catch { /* ignore */ } }
      worker = null;
    };

    try {
      worker = workerFactory();
    } catch {
      subject.error({ type: 'error', errorCode: 'WORKER_INIT_FAILED', message: 'Worker could not be started.' });
      return subject.asObservable();
    }

    // 15-second watchdog
    timeoutId = setTimeout(() => {
      if (!done) {
        cleanup();
        subject.next({ type: 'error', errorCode: 'FFMPEG_TIMEOUT', message: 'Operation timed out after 15 seconds.' });
        subject.complete();
      }
    }, 15_000);

    worker.onmessage = (event: MessageEvent<WorkerMessage<TOutput>>) => {
      const msg = event.data;
      subject.next(msg);
      if (msg.type === 'complete') {
        cleanup();
        subject.complete();
      } else if (msg.type === 'error') {
        cleanup();
        subject.complete();
      }
    };

    worker.onerror = (err: ErrorEvent) => {
      if (!done) {
        cleanup();
        subject.next({ type: 'error', errorCode: 'WORKER_CRASHED', message: err.message });
        subject.complete();
      }
    };

    // Send config to worker
    worker.postMessage({ type: 'start', config });

    return subject.asObservable();
  }

  /** Read File as ArrayBuffer for Transferable zero-copy usage */
  async buildTransferable(file: File): Promise<{ buffer: ArrayBuffer }> {
    const buffer = await file.arrayBuffer();
    return { buffer };
  }

  /** Download a Blob with deferred URL revoke (Firefox/Safari fix) */
  downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 150);
  }
}
