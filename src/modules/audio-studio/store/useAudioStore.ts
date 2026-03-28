import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { idbStorage } from "@/lib/idb-storage";
import { useSettingsStore } from "@/store/useSettingsStore";
import type { AudioToolCommand } from "../core/command-matrix";

// ═══════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════

export interface AudioTask {
  id: string;
  file: File | null;
  files: File[]; // Secondary inputs (e.g. for Merger)
  operation: AudioToolCommand | "idle";
  status: "idle" | "loading" | "processing" | "success" | "error";
  progress: number;
  options: Record<string, unknown>;
  resultUrl?: string;
  error?: string;
}

export interface AudioStore {
  task: AudioTask;
  ffmpegLogs: string[];
  setFile: (file: File) => void;
  addFiles: (files: File[]) => void;
  setOperation: (operation: AudioToolCommand) => void;
  setOptions: (options: Record<string, unknown>) => void;
  processAudio: () => Promise<void>;
  reset: () => void;
}

const initialTask: AudioTask = {
  id: "",
  file: null,
  files: [],
  operation: "idle",
  status: "idle",
  progress: 0,
  options: {},
};

// ═══════════════════════════════════════════════════
// Zustand Store (IDB Persisted & Native WASM Spawn)
// ═══════════════════════════════════════════════════

export const useAudioStore = create<AudioStore>()(
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

      processAudio: async () => {
        const { task } = get();

        // 1. Voice-Recorder (Analogous to Screen Recorder, handling natively without FFmpeg immediately if needed, but here we route generally)
        // If Voice Recorder implementation was native browser it would go here. For now, we assume all pass through WASM or Native.

        if (!task.file || task.operation === "idle") return;

        set((state) => ({
          task: { ...state.task, status: "processing", progress: 0, error: undefined },
          ffmpegLogs: [],
        }));

        try {
          // ═══════════════════════════════════════════════════
          // Client WASM Tools (Background Thread API)
          // ═══════════════════════════════════════════════════
          
          const worker = new Worker(new URL('@/workers/audio.worker.ts', import.meta.url));

          worker.onmessage = (e: MessageEvent) => {
            const { type, status, progress, message, resultUrls, error } = e.data;

            if (type === 'STATUS') {
              // Internal status tracking ignored by UI
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
                  error: error || "Audio DSP Processing failed.",
                },
              }));
              worker.terminate();
            }
          };

          worker.onerror = (err) => {
            console.error("Audio Worker generic error:", err);
            set((state) => ({
              task: {
                ...state.task,
                status: "error",
                error: "Background Worker Crash. Memory limit or absolute isolation failure.",
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
            type: 'PROCESS_AUDIO',
            payload: {
              toolSlug: task.operation,
              file: task.file,
              secondaryFiles: task.files, // Essential for mergers
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
          console.error("Audio orchestrator root error:", error);
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
      name: 'audio-store',
      storage: createJSONStorage(() => idbStorage),
      // Prevent serializing browser-locked Files/Blobs into IDB Strings which breaks instances heavily!
      partialize: (state) => ({ task: { ...state.task, file: null, files: [] } }),
    }
  )
);

// ═══════════════════════════════════════════════════
// BroadcastChannel: Cross-Tab Synchronization
// ═══════════════════════════════════════════════════

if (typeof window !== 'undefined') {
  const channel = new BroadcastChannel('omni-audio-store-sync');
  let isApplyingRemoteState = false;

  useAudioStore.subscribe((state) => {
    if (!isApplyingRemoteState) {
      // Don't sync the heavy File objects over BroadcastChannel (cloning errors)
      channel.postMessage({
        type: 'SYNC',
        payload: { task: { ...state.task, file: null, files: [] } },
      });
    }
  });

  channel.onmessage = (event) => {
    if (event.data?.type === 'SYNC') {
      isApplyingRemoteState = true;
      useAudioStore.setState(event.data.payload, false);
      // Wait for React batching
      queueMicrotask(() => {
        isApplyingRemoteState = false;
      });
    }
  };
}
