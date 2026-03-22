import { create } from "zustand";
import type { VideoOperation } from "../types";

// ═══════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════

interface VideoTask {
  id: string;
  file: File | null;
  files: File[];
  operation: VideoOperation | "idle";
  status: "idle" | "loading" | "processing" | "success" | "error";
  progress: number;
  options: Record<string, unknown>;
  resultUrl?: string;
  error?: string;
}

interface VideoStore {
  task: VideoTask;
  ffmpegLogs: string[];
  setFile: (file: File) => void;
  addFiles: (files: File[]) => void;
  setOperation: (operation: VideoOperation) => void;
  setOptions: (options: Record<string, unknown>) => void;
  processVideo: () => Promise<void>;
  reset: () => void;
}

const initialTask: VideoTask = {
  id: "",
  file: null,
  files: [],
  operation: "idle",
  status: "idle",
  progress: 0,
  options: {},
};

// ═══════════════════════════════════════════════════
// Screen Recording (Browser API, no FFmpeg)
// ═══════════════════════════════════════════════════

async function handleScreenRecording(
  set: (fn: (state: { task: VideoTask; ffmpegLogs: string[] }) => Partial<{ task: VideoTask; ffmpegLogs: string[] }>) => void
) {
  try {
    set(() => ({
      task: { ...initialTask, operation: "screen-recorder" as VideoOperation, status: "processing", progress: 10 },
    }));

    // Relaxed constraints to prevent OverconstrainedError or NotAllowedError
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true, // Will still request audio, but depends on user checking the box
    });

    let mimeType = "video/webm";
    if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
      mimeType = "video/webm;codecs=vp9";
    }

    const recorder = new MediaRecorder(stream, { mimeType });

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      stream.getTracks().forEach((t) => t.stop());
      set((state) => ({
        task: { ...state.task, status: "success", progress: 100, resultUrl: url },
      }));
    };

    recorder.start();

    set((state) => ({
      task: { ...state.task, progress: 50 },
    }));

    stream.getVideoTracks()[0].onended = () => {
      if (recorder.state !== "inactive") {
        recorder.stop();
      }
    };
  } catch (err) {
    console.error("Screen recording error:", err);
    set((state) => ({
      task: {
        ...state.task,
        status: "error",
        error: err instanceof Error ? err.message : "Screen recording cancelled or not supported.",
      },
    }));
  }
}

// ═══════════════════════════════════════════════════
// Zustand Store
// ═══════════════════════════════════════════════════

export const useVideoStore = create<VideoStore>((set, get) => ({
  task: { ...initialTask },
  ffmpegLogs: [],

  setFile: (file) =>
    set((state) => ({
      task: {
        ...state.task,
        file,
        id: crypto.randomUUID(),
        status: "idle",
        progress: 0,
        resultUrl: undefined,
        error: undefined,
      },
      ffmpegLogs: [],
    })),

  addFiles: (files) =>
    set((state) => ({
      task: {
        ...state.task,
        files: [...state.task.files, ...files],
        file: state.task.file || files[0] || null,
        id: state.task.id || crypto.randomUUID(),
        status: "idle",
        progress: 0,
        resultUrl: undefined,
        error: undefined,
      },
    })),

  setOperation: (operation) =>
    set((state) => ({
      task: { ...state.task, operation, options: {} },
    })),

  setOptions: (options) =>
    set((state) => ({
      task: { ...state.task, options: { ...state.task.options, ...options } },
    })),

  processVideo: async () => {
    const { task } = get();

    // Screen recorder handled separately (no FFmpeg)
    if (task.operation === "screen-recorder") {
      await handleScreenRecording(set);
      return;
    }

    if (!task.file || task.operation === "idle") return;

    set((state) => ({
      task: { ...state.task, status: "processing", progress: 0, error: undefined },
      ffmpegLogs: [],
    }));

    try {
      // ═══════════════════════════════════════════════════
      // Route Server Tools (Stabilizer)
      // ═══════════════════════════════════════════════════
      if (task.operation === "stabilizer") {
        set((state) => ({ ffmpegLogs: [...state.ffmpegLogs, "Uploading to server for stabilization..."] }));
        
        const formData = new FormData();
        formData.append("file", task.file);
        formData.append("options", JSON.stringify(task.options));

        const res = await fetch(`/api/video/${task.operation}`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to start server task");

        const jobId = data.jobId;
        set((state) => ({ ffmpegLogs: [...state.ffmpegLogs, `Server Job ID: ${jobId} queued...`] }));

        // Poll for progress
        let isDone = false;
        while (!isDone) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          const pollRes = await fetch(`/api/video/${task.operation}?jobId=${jobId}`);
          const pollData = await pollRes.json();
          
          if (!pollRes.ok) throw new Error(pollData.error || "Failed to poll server task");

          if (pollData.status === "processing") {
            set((state) => ({ task: { ...state.task, progress: pollData.progress || 50 } }));
          } else if (pollData.status === "success") {
            isDone = true;
            set((state) => ({
              task: { 
                ...state.task, 
                status: "success", 
                progress: 100, 
                resultUrl: pollData.outputPath 
              },
              ffmpegLogs: [...state.ffmpegLogs, "Stabilization complete!"],
            }));
          } else if (pollData.status === "error" || pollData.status === "failed") {
            throw new Error(pollData.error || "Server processing failed");
          }
        }
        return;
      }

      // ═══════════════════════════════════════════════════
      // Client WASM Tools (Web Worker)
      // ═══════════════════════════════════════════════════
      const worker = new Worker(new URL('../workers/ffmpeg.worker.ts', import.meta.url));
      
      worker.postMessage({
        type: 'PROCESS',
        payload: {
          operation: task.operation,
          file: task.file,
          files: task.files,
          options: task.options
        }
      });

      worker.onmessage = (e) => {
        if (e.data.type === 'PROGRESS') {
          set((state) => ({ task: { ...state.task, progress: e.data.progress } }));
        }
        if (e.data.type === 'LOG') {
          set((state) => ({ ffmpegLogs: [...state.ffmpegLogs, e.data.message] }));
        }
        if (e.data.type === 'DONE') {
          const blob = new Blob([e.data.outputData.buffer as ArrayBuffer], { type: e.data.outputMimeType || 'video/mp4' });
          const url = URL.createObjectURL(blob);
          set((state) => ({
            task: { ...state.task, status: "success", progress: 100, resultUrl: url },
          }));
          worker.terminate();
        }
        if (e.data.type === 'ERROR') {
          console.error("Video processing worker error:", e.data.error);
          set((state) => ({
            task: {
              ...state.task,
              status: "error",
              error: e.data.error || "Processing failed.",
            },
          }));
          worker.terminate();
        }
      };
      
      worker.onerror = (err) => {
        console.error("Worker generic error:", err);
        set((state) => ({
          task: {
            ...state.task,
            status: "error",
            error: "Web Worker crashed heavily. Ensure you have Web Worker support.",
          },
        }));
        worker.terminate();
      };
    } catch (error) {
      console.error("Video processing error:", error);
      set((state) => ({
        task: {
          ...state.task,
          status: "error",
          error: error instanceof Error ? error.message : "Processing failed. Please try a different file or settings.",
        },
      }));
    }
  },

  reset: () =>
    set({
      task: { ...initialTask },
      ffmpegLogs: [],
    }),
}));
