import { generalQueue, aiQueue, Job, JobStatus } from './InMemoryQueue';
import { ImageTask } from '../types';

let generalWorker: Worker | null = null;
let aiWorker: Worker | null = null;
let heicWorker: Worker | null = null;

// Initialize workers on client side only
if (typeof window !== 'undefined') {
  generalWorker = new Worker(new URL('../workers/image-processor.worker.ts', import.meta.url), { type: 'module' });
  aiWorker = new Worker(new URL('../workers/ai-model.worker.ts', import.meta.url), { type: 'module' });
  heicWorker = new Worker(new URL('../workers/heic.worker.ts', import.meta.url), { type: 'module' });

  // Hook up General Queue Processor
  generalQueue.setProcessor((job, updateProgress) => {
    return new Promise((resolve, reject) => {
      if (!generalWorker) return reject('Worker not initialized');
      
      const onMessage = (e: MessageEvent) => {
        if (e.data.id !== job.id) return;
        if (e.data.type === 'PROGRESS') {
          updateProgress(e.data.progress);
        } else if (e.data.type === 'DONE') {
          generalWorker!.removeEventListener('message', onMessage);
          resolve(e.data.payload);
        } else if (e.data.type === 'ERROR') {
          generalWorker!.removeEventListener('message', onMessage);
          reject(new Error(e.data.error));
        }
      };

      generalWorker.addEventListener('message', onMessage);
      generalWorker.postMessage({ id: job.id, type: 'PROCESS', payload: job.payload });
    });
  });

  // Hook up AI Queue Processor
  aiQueue.setProcessor((job, updateProgress) => {
    return new Promise((resolve, reject) => {
      if (!aiWorker) return reject('AI Worker not initialized');
      
      const onMessage = (e: MessageEvent) => {
        if (e.data.id !== job.id) return;
        if (e.data.type === 'PROGRESS') {
          updateProgress(e.data.progress);
        } else if (e.data.type === 'DONE') {
          aiWorker!.removeEventListener('message', onMessage);
          resolve(e.data.payload);
        } else if (e.data.type === 'ERROR') {
          aiWorker!.removeEventListener('message', onMessage);
          reject(new Error(e.data.error));
        }
      };

      aiWorker.addEventListener('message', onMessage);
      aiWorker.postMessage({ id: job.id, type: 'PROCESS', payload: job.payload });
    });
  });
}

// Helper to wait for job completion
export const processTask = (payload: any, isAI: boolean = false): Promise<any> => {
  return new Promise((resolve, reject) => {
    const queue = isAI ? aiQueue : generalQueue;
    const job = queue.addJob(payload);
    
    const onFinished = (j: Job) => {
      if (j.id === job.id) {
        queue.removeListener('jobFinished', onFinished);
        if (j.status === 'completed') resolve(j.result);
        else reject(new Error(j.error || 'Job failed'));
      }
    };
    
    queue.on('jobFinished', onFinished);
  });
};
