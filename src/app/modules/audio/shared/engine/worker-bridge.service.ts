import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import type { WorkerMessage } from '../types/audio.types';

@Injectable({ providedIn: 'root' })
export class AudioWorkerBridgeService {
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
      if (worker) { try { worker.terminate(); } catch { /**/ } }
      worker = null;
    };

    try { worker = workerFactory(); }
    catch {
      subject.error({
        type: 'error', errorCode: 'WORKER_CRASHED',
        message: 'Worker could not be started.'
      });
      return subject.asObservable();
    }

    timeoutId = setTimeout(() => {
      if (!done) {
        cleanup();
        subject.next({
          type: 'error', errorCode: 'FFMPEG_TIMEOUT',
          message: 'Processing timed out after 60 seconds.'
        });
        subject.complete();
      }
    }, 60_000);

    worker.onmessage = (event: MessageEvent<WorkerMessage<TOutput>>) => {
      const msg = event.data;
      subject.next(msg);
      if (msg.type === 'complete' || msg.type === 'error') {
        cleanup();
        subject.complete();
      }
    };

    worker.onerror = (err: ErrorEvent) => {
      if (!done) {
        cleanup();
        subject.next({
          type: 'error', errorCode: 'WORKER_CRASHED',
          message: err.message
        });
        subject.complete();
      }
    };

    worker.postMessage({ type: 'start', config });
    return subject.asObservable();
  }

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
