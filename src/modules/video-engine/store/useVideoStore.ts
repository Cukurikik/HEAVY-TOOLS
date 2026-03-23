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
// Track mount state to prevent double-mount crashes
// ═══════════════════════════════════════════════════
let isMounted = false;

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

    // BUG FIX: Track ffmpeg reference for cleanup in finally block
    let ffmpeg: any = null;

    try {
      // ═══════════════════════════════════════════════════
      // Client WASM Tools (Background Thread)
      // All 29 non-screen-recorder tools use FFmpeg WASM
      // ═══════════════════════════════════════════════════
      const { getFFmpeg } = await import('../lib/ffmpeg-core');
      const engines = await import('../engines');

      const onProgress = (progress: number) => {
        set((state) => ({ task: { ...state.task, progress: Math.min(Math.round(progress * 100), 99) } }));
      };
      
      const onLog = (message: string) => {
        set((state) => ({ ffmpegLogs: [...state.ffmpegLogs, message] }));
      };

      // Spawns native worker safely, or returns warm singleton instance
      ffmpeg = await getFFmpeg(onProgress, onLog);

      // BUG FIX: Safely unmount previous mount if it was left behind from a crashed run
      if (isMounted) {
        try { await ffmpeg.unmount('/opt'); } catch (_) {}
        isMounted = false;
      }

      try {
        await ffmpeg.createDir('/opt');
      } catch (e) { /* Ignore if exists */ }

      // Mounting files as Blobs using WORKERFS zero-copy feature
      // @ts-ignore
      await ffmpeg.mount('WORKERFS', { files: task.file ? [task.file] : task.files }, '/opt');
      isMounted = true;

      const fileToProcess = task.file || task.files[0];
      const inputName = '/opt/' + fileToProcess.name;
      
      const engineKeyParts = task.operation.split('-');
      const engineKey = engineKeyParts.map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join('');
      
      const buildFn = (engines as any)[`build${engineKey}Args`];
      const getOutput = (engines as any)[`get${engineKey}OutputName`];
      const getMime = (engines as any)[`get${engineKey}MimeType`];
      
      if (!buildFn) throw new Error(`Engine not found for operation: ${task.operation}`);

      const outputName = getOutput(task.options);
      const args = await buildFn(inputName, outputName, task.options, ffmpeg, task.files);
      
      const ret = await ffmpeg.exec(args);
      if (ret !== 0) {
        throw new Error(`FFmpeg process failed with code ${ret}. File may be corrupted or settings are invalid.`);
      }

      const outputData = await ffmpeg.readFile(outputName) as Uint8Array;

      // BUG FIX: Unmount BEFORE creating blob (moved to finally block as safety net)
      try { await ffmpeg.unmount('/opt'); isMounted = false; } catch (_) {}

      // BUG FIX: Clean up temporary files written by engines (subtitles, metadata, concat, etc.)
      try { await ffmpeg.deleteFile(outputName); } catch (_) {}
      try { await ffmpeg.deleteFile('sub.srt'); } catch (_) {}
      try { await ffmpeg.deleteFile('metadata.txt'); } catch (_) {}
      try { await ffmpeg.deleteFile('palette.png'); } catch (_) {}
      try { await ffmpeg.deleteFile('concat.txt'); } catch (_) {}

      const blob = new Blob([outputData.buffer as ArrayBuffer], { type: getMime ? getMime(task.options) : 'video/mp4' });
      const url = URL.createObjectURL(blob);
      
      set((state) => ({
        task: { ...state.task, status: "success", progress: 100, resultUrl: url },
      }));
    } catch (error) {
      console.error("Video processing error:", error);

      // BUG FIX: ALWAYS unmount on error to prevent "mount point already exists" on retry
      if (ffmpeg && isMounted) {
        try { await ffmpeg.unmount('/opt'); } catch (_) {}
        isMounted = false;
      }

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
