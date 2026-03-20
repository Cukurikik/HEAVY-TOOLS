/**
 * InMemoryQueue — Layer 5: Job Queue
 *
 * Zero third-party dependencies. Uses Node.js built-in:
 * - EventEmitter for job lifecycle events
 * - Map for job storage
 * - setInterval for queue polling
 *
 * Concurrency limit: 2 simultaneous jobs.
 * SSE-compatible progress streaming.
 */

import { EventEmitter } from "events";

export type JobStatus = "queued" | "processing" | "success" | "error";

export interface Job {
  id: string;
  tool: string;
  status: JobStatus;
  progress: number;
  inputPath: string;
  outputPath?: string;
  options: Record<string, unknown>;
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

type JobProcessor = (job: Job, onProgress: (pct: number) => void) => Promise<string>;

const MAX_CONCURRENCY = 2;
const POLL_INTERVAL_MS = 500;

class InMemoryQueue extends EventEmitter {
  private jobs: Map<string, Job> = new Map();
  private queue: string[] = []; // IDs waiting to be processed
  private activeCount = 0;
  private processor: JobProcessor | null = null;
  private pollTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    super();
    this.startPolling();
  }

  /**
   * Register the function that actually processes jobs.
   * Called once at app startup.
   */
  setProcessor(fn: JobProcessor): void {
    this.processor = fn;
  }

  /**
   * Add a new job to the queue.
   * Returns the job ID.
   */
  enqueue(tool: string, inputPath: string, options: Record<string, unknown> = {}): string {
    const id = crypto.randomUUID();
    const job: Job = {
      id,
      tool,
      status: "queued",
      progress: 0,
      inputPath,
      options,
      createdAt: new Date(),
    };

    this.jobs.set(id, job);
    this.queue.push(id);
    this.emit("job:queued", job);

    return id;
  }

  /**
   * Get a job by ID.
   */
  getJob(id: string): Job | undefined {
    return this.jobs.get(id);
  }

  /**
   * Get all jobs, optionally filtered by status.
   */
  getAllJobs(status?: JobStatus): Job[] {
    const all = Array.from(this.jobs.values());
    return status ? all.filter((j) => j.status === status) : all;
  }

  /**
   * Remove a completed/errored job from storage.
   */
  removeJob(id: string): boolean {
    const job = this.jobs.get(id);
    if (!job) return false;
    if (job.status === "processing") return false; // Can't remove active jobs
    this.jobs.delete(id);
    return true;
  }

  /**
   * Internal: poll the queue and process next jobs.
   */
  private startPolling(): void {
    this.pollTimer = setInterval(() => {
      this.processNext();
    }, POLL_INTERVAL_MS);
  }

  /**
   * Internal: pick the next job(s) from the queue if under concurrency limit.
   */
  private async processNext(): Promise<void> {
    while (this.activeCount < MAX_CONCURRENCY && this.queue.length > 0) {
      const jobId = this.queue.shift();
      if (!jobId) break;

      const job = this.jobs.get(jobId);
      if (!job || job.status !== "queued") continue;

      this.activeCount++;
      job.status = "processing";
      job.startedAt = new Date();
      this.emit("job:started", job);

      // Process asynchronously
      this.executeJob(job).catch(() => {
        // Error handling is inside executeJob
      });
    }
  }

  /**
   * Internal: execute a single job using the registered processor.
   */
  private async executeJob(job: Job): Promise<void> {
    if (!this.processor) {
      job.status = "error";
      job.error = "No processor registered.";
      job.completedAt = new Date();
      this.activeCount--;
      this.emit("job:error", job);
      return;
    }

    try {
      const outputPath = await this.processor(job, (pct: number) => {
        job.progress = Math.min(Math.max(pct, 0), 100);
        this.emit("job:progress", job);
      });

      job.status = "success";
      job.progress = 100;
      job.outputPath = outputPath;
      job.completedAt = new Date();
      this.emit("job:completed", job);
    } catch (err) {
      job.status = "error";
      job.error = err instanceof Error ? err.message : "Unknown processing error";
      job.completedAt = new Date();
      this.emit("job:error", job);
    } finally {
      this.activeCount--;
    }
  }

  /**
   * Cleanup: stop polling and clear all jobs.
   */
  destroy(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
    this.jobs.clear();
    this.queue = [];
    this.activeCount = 0;
    this.removeAllListeners();
  }
}

// Singleton instance — shared across all API routes
let queueInstance: InMemoryQueue | null = null;

export function getVideoQueue(): InMemoryQueue {
  if (!queueInstance) {
    queueInstance = new InMemoryQueue();
  }
  return queueInstance;
}

export { InMemoryQueue };
