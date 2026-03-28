import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { idbStorage } from "@/lib/idb-storage";
import { useSettingsStore } from "@/store/useSettingsStore";
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
// Track mount state to prevent double-mount crashes
// ═══════════════════════════════════════════════════
let isMounted = false;

// ═══════════════════════════════════════════════════
// Zustand Store
// ═══════════════════════════════════════════════════

export const useVideoStore = create<VideoStore>()(
  persist(
    (set, get) => ({
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
      // Client WASM Tools (Background Thread API)
      // Delegating the 29 Tool array mathematically mapping to the FFmpeg Worker.
      // ═══════════════════════════════════════════════════
      
      const worker = new Worker(new URL('@/workers/ffmpeg.worker.ts', import.meta.url));

      worker.onmessage = (e: MessageEvent) => {
        const { type, status, progress, message, resultUrls, error } = e.data;

        if (type === 'STATUS') {
          // Status tracking
        } else if (type === 'LOG') {
          set((state) => ({ ffmpegLogs: [...state.ffmpegLogs, message] }));
        } else if (type === 'PROGRESS') {
          set((state) => ({ task: { ...state.task, progress } }));
        } else if (type === 'SUCCESS') {
          set((state) => ({
            task: { ...state.task, status: "success", progress: 100, resultUrl: resultUrls[0] },
          }));
          worker.terminate();
        } else if (type === 'ERROR') {
          set((state) => ({
            task: {
              ...state.task,
              status: "error",
              error: error || "Processing failed.",
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
            error: "Background Worker Crash. Memory limit or isolation failure.",
          },
        }));
        worker.terminate();
      };

      // ⚡ Access Global Settings from the Settings Brain
      const settings = useSettingsStore.getState().settings || {};
      const workerPoolLimit = settings['jumlah-maksimal-web-worker-pool-auto-os-cores'] ?? 50; 
      const hardwareAcceleration = settings['pilihan-hardware-acceleration-auto-webgpu-str'] ?? 'Auto';

      // Blast payload to the isolated worker thread
      worker.postMessage({
        type: 'PROCESS_VIDEO',
        payload: {
          toolSlug: task.operation,
          file: task.file,
          options: {
            ...task.options,
            _omniEngineConfig: {
               workerPoolLimit,
               hardwareAcceleration,
            }
          }
        }
      });

    } catch (error) {
      console.error("Video orchestrator error:", error);
      set((state) => ({
        task: {
          ...state.task,
          status: "error",
          error: error instanceof Error ? error.message : "Engine spawn failure.",
        },
      }));
    }
  },

  reset: () =>
    set({
      task: { ...initialTask },
      ffmpegLogs: [],
    }),
    }),
    {
      name: 'video-store',
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => ({ task: { ...state.task, file: null, files: [] } }),
    }
  )
);

// ═══════════════════════════════════════════════════
// BroadcastChannel: Cross-Tab Synchronization
// ═══════════════════════════════════════════════════

if (typeof window !== 'undefined') {
  const channel = new BroadcastChannel('omni-video-store-sync');
  let isApplyingRemoteState = false;

  useVideoStore.subscribe((state) => {
    if (!isApplyingRemoteState) {
      channel.postMessage({
        type: 'SYNC',
        payload: { task: { ...state.task, file: null, files: [] } },
      });
    }
  });

  channel.onmessage = (event) => {
    if (event.data?.type === 'SYNC') {
      isApplyingRemoteState = true;
      useVideoStore.setState(event.data.payload, false);
      queueMicrotask(() => {
        isApplyingRemoteState = false;
      });
    }
  };
}
