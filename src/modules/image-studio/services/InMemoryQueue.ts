import { EventEmitter } from 'events';

export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface Job<T = any> {
  id: string;
  payload: T;
  priority: number;
  status: JobStatus;
  progress: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  result?: any;
}

export type JobHandler<T> = (job: Job<T>, updateProgress: (progress: number) => void) => Promise<any>;

export class InMemoryQueue<T = any> extends EventEmitter {
  private queue: Job<T>[] = [];
  private activeJobs: Map<string, Job<T>> = new Map();
  private concurrencyLimit: number;
  private processor?: JobHandler<T>;

  constructor(concurrencyLimit: number = 5) {
    super();
    this.concurrencyLimit = concurrencyLimit;
  }

  setProcessor(handler: JobHandler<T>) {
    this.processor = handler;
  }

  addJob(payload: T, priority: number = 0): Job<T> {
    const job: Job<T> = {
      id: crypto.randomUUID(),
      payload,
      priority,
      status: 'queued',
      progress: 0,
      createdAt: new Date(),
    };
    
    this.queue.push(job);
    this.queue.sort((a, b) => b.priority - a.priority); // Higher priority first
    
    this.emit('jobAdded', job);
    this.processNext();
    
    return job;
  }

  getJob(id: string): Job<T> | undefined {
    return this.activeJobs.get(id) || this.queue.find(j => j.id === id);
  }

  private async processNext() {
    if (!this.processor) return;
    if (this.activeJobs.size >= this.concurrencyLimit) return;
    if (this.queue.length === 0) return;

    const job = this.queue.shift()!;
    job.status = 'processing';
    job.startedAt = new Date();
    this.activeJobs.set(job.id, job);
    
    this.emit('jobStarted', job);

    const updateProgress = (progress: number) => {
      job.progress = progress;
      this.emit('jobProgress', job);
    };

    try {
      const result = await this.processor(job, updateProgress);
      job.result = result;
      job.status = 'completed';
      job.progress = 100;
    } catch (error) {
      job.status = 'failed';
      job.error = error instanceof Error ? error.message : String(error);
    } finally {
      job.completedAt = new Date();
      this.activeJobs.delete(job.id);
      this.emit('jobFinished', job);
      this.processNext();
    }
  }
  
  get length() {
    return this.queue.length;
  }
  
  get activeCount() {
    return this.activeJobs.size;
  }
}

export const generalQueue = new InMemoryQueue<any>(5);
export const aiQueue = new InMemoryQueue<any>(1);
