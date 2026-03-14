import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkerMessage } from '../types/pdf.types';

@Injectable({ providedIn: 'root' })
export class WorkerBridgeService {
  process<TConfig, TResult>(workerFactory: () => Worker, config: TConfig, transfer?: Transferable[]): Observable<WorkerMessage<TResult>> {
    return new Observable(observer => {
      const worker = workerFactory();
      
      worker.onmessage = (e) => {
        const msg = e.data as WorkerMessage<TResult>;
        observer.next(msg);
        if (msg.type === 'complete' || msg.type === 'error') {
          observer.complete();
          worker.terminate();
        }
      };
      
      worker.onerror = (err) => {
        observer.next({ type: 'error', errorCode: 'WORKER_CRASHED', message: err.message });
        observer.complete();
        worker.terminate();
      };

      worker.postMessage({ config }, transfer || []);

      return () => {
        worker.terminate();
      };
    });
  }
}
