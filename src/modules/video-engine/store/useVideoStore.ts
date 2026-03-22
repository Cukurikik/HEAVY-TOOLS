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
      const { executeVideoTask } = await import("../services/videoService");

      const onProgress = (progress: number) => {
        set((state) => ({ task: { ...state.task, progress } }));
      };

      const onLog = (log: string) => {
        set((state) => ({ ffmpegLogs: [...state.ffmpegLogs, log] }));
      };

      const { outputData, outputMimeType } = await executeVideoTask(
        {
          operation: task.operation,
          file: task.file,
          files: task.files,
          options: task.options,
        },
        onProgress,
        onLog
      );

      const blob = new Blob([outputData.buffer as ArrayBuffer], { type: outputMimeType || 'video/mp4' });
      const url = URL.createObjectURL(blob);

      set((state) => ({
        task: { ...state.task, status: "success", progress: 100, resultUrl: url },
      }));
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
