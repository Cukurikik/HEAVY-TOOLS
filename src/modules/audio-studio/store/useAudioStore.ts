"use client";

import { create } from "zustand";
import { AudioTask, AudioOperation } from "../types";

// ═══════════════════════════════════════════════════
// Initial State
// ═══════════════════════════════════════════════════

const INITIAL_TASK: AudioTask = {
  id: "",
  file: null,
  files: [],
  operation: "idle",
  options: {},
  status: "idle",
  progress: 0,
  resultUrl: "",
  error: "",
};

interface AudioStore {
  task: AudioTask;
  ffmpegLogs: string[];
  setFile: (file: File) => void;
  addFiles: (files: File[]) => void;
  setOperation: (operation: AudioTask["operation"]) => void;
  setOptions: (options: Record<string, unknown>) => void;
  processAudio: () => Promise<void>;
  reset: () => void;
}

// ═══════════════════════════════════════════════════
// Track WORKERFS mount state
// ═══════════════════════════════════════════════════
let isMounted = false;

// ═══════════════════════════════════════════════════
// MediaRecorder Handler (Voice/Audio Recorder)
// ═══════════════════════════════════════════════════

async function handleRecording(
  set: (fn: (state: { task: AudioTask }) => Partial<{ task: AudioTask }>) => void,
  options: Record<string, unknown>
) {
  try {
    set(() => ({
      task: { ...INITIAL_TASK, operation: "voice-recorder" as AudioOperation, status: "processing", progress: 10 },
    }));

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      stream.getTracks().forEach((t) => t.stop());
      set((s) => ({ task: { ...s.task, status: "success", progress: 100, resultUrl: url } }));
    };
    recorder.start();
    const duration = (options.duration as number) || 10;
    set((s) => ({ task: { ...s.task, progress: 50 } }));
    await new Promise((r) => setTimeout(r, duration * 1000));
    if (recorder.state !== "inactive") recorder.stop();
  } catch (err) {
    console.error("Audio Recording Error:", err);
    set((s) => ({
      task: { ...s.task, status: "error", error: err instanceof Error ? err.message : "Recording failed. Check microphone permissions." },
    }));
  }
}

// ═══════════════════════════════════════════════════
// Web Audio API Analysis Handler (BPM/Key/Waveform/Spectrum)
// ═══════════════════════════════════════════════════

async function handleAnalysis(
  set: (fn: (state: { task: AudioTask }) => Partial<{ task: AudioTask }>) => void,
  file: File
) {
  try {
    set((s) => ({ task: { ...s.task, status: "processing", progress: 10, error: "" } }));
    const audioCtx = new OfflineAudioContext(2, 44100 * 30, 44100);
    const arrayBuffer = await file.arrayBuffer();
    set((s) => ({ task: { ...s.task, progress: 40 } }));
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    set((s) => ({ task: { ...s.task, progress: 70 } }));
    const wavBlob = audioBufferToWav(audioBuffer);
    const url = URL.createObjectURL(wavBlob);
    set((s) => ({ task: { ...s.task, status: "success", progress: 100, resultUrl: url } }));
  } catch (err) {
    console.error("Audio Analysis Error:", err);
    set((s) => ({
      task: { ...s.task, status: "error", error: "Audio analysis failed. Please try a different file." },
    }));
  }
}

// ═══════════════════════════════════════════════════
// Zustand Store
// ═══════════════════════════════════════════════════

export const useAudioStore = create<AudioStore>((set, get) => ({
  task: { ...INITIAL_TASK },
  ffmpegLogs: [],

  setFile: (file) =>
    set((state) => ({
      task: {
        ...state.task,
        file,
        id: crypto.randomUUID(),
        status: "idle",
        progress: 0,
        resultUrl: "",
        error: "",
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
        resultUrl: "",
        error: "",
      },
    })),

  setOperation: (operation) =>
    set((state) => ({
      task: { ...state.task, operation, options: {} },
    })),

  setOptions: (newOpts) =>
    set((state) => ({
      task: { ...state.task, options: { ...state.task.options, ...newOpts } },
    })),

  processAudio: async () => {
    const { task } = get();

    // Voice/Audio Recorder → MediaRecorder API
    if (task.operation === "voice-recorder" || task.operation === "audio-recorder") {
      await handleRecording(set as any, task.options);
      return;
    }

    // Analysis tools → Web Audio API
    if (["waveform-visualizer", "spectrum-analyzer", "bpm-detector", "key-finder"].includes(task.operation)) {
      if (!task.file) return;
      await handleAnalysis(set as any, task.file);
      return;
    }

    // All other tools → FFmpeg WASM with dynamic engine dispatch
    if (!task.file || task.operation === "idle") return;

    set((state) => ({
      task: { ...state.task, status: "processing", progress: 0, error: "" },
      ffmpegLogs: [],
    }));

    let ffmpeg: any = null;

    try {
      const { getFFmpeg } = await import("../../video-engine/lib/ffmpeg-core");
      const engines = await import("../engines");

      const onProgress = (progress: number) => {
        set((state) => ({ task: { ...state.task, progress: Math.min(Math.round(progress * 100), 99) } }));
      };

      const onLog = (message: string) => {
        set((state) => ({ ffmpegLogs: [...state.ffmpegLogs, message] }));
      };

      ffmpeg = await getFFmpeg(onProgress, onLog);

      // Safely unmount if left from a crashed run
      if (isMounted) {
        try { await ffmpeg.unmount('/opt'); } catch (_) {}
        isMounted = false;
      }

      try { await ffmpeg.createDir('/opt'); } catch (_) {}

      // Mount file via WORKERFS (zero-copy)
      // @ts-ignore
      await ffmpeg.mount('WORKERFS', { files: task.file ? [task.file] : task.files }, '/opt');
      isMounted = true;

      const fileToProcess = task.file || task.files[0];
      const inputName = '/opt/' + fileToProcess.name;

      // Dynamic engine dispatch — same pattern as video store
      const engineKeyParts = task.operation.split('-');
      const engineKey = engineKeyParts.map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join('');

      const buildFn = (engines as any)[`build${engineKey}Args`];
      const getOutput = (engines as any)[`get${engineKey}OutputName`];
      const getMime = (engines as any)[`get${engineKey}MimeType`];

      if (!buildFn) throw new Error(`Audio engine not found for: ${task.operation}`);

      const outputName = getOutput(task.options);
      const args = await buildFn(inputName, outputName, task.options, ffmpeg, task.files);

      const ret = await ffmpeg.exec(args);
      if (ret !== 0) {
        throw new Error(`FFmpeg process failed with code ${ret}. Check your audio file or settings.`);
      }

      const outputData = await ffmpeg.readFile(outputName) as Uint8Array;

      // Unmount + cleanup
      try { await ffmpeg.unmount('/opt'); isMounted = false; } catch (_) {}
      try { await ffmpeg.deleteFile(outputName); } catch (_) {}
      try { await ffmpeg.deleteFile('concat.txt'); } catch (_) {}

      const blob = new Blob([outputData.buffer as ArrayBuffer], {
        type: getMime ? getMime(task.options) : 'audio/mpeg'
      });
      const url = URL.createObjectURL(blob);

      set((state) => ({
        task: { ...state.task, status: "success", progress: 100, resultUrl: url },
      }));
    } catch (error) {
      console.error("Audio processing error:", error);

      if (ffmpeg && isMounted) {
        try { await ffmpeg.unmount('/opt'); } catch (_) {}
        isMounted = false;
      }

      set((state) => ({
        task: {
          ...state.task,
          status: "error",
          error: error instanceof Error ? error.message : "Processing failed. Please try again.",
        },
      }));
    }
  },

  reset: () =>
    set({
      task: { ...INITIAL_TASK },
      ffmpegLogs: [],
    }),
}));

// ═══════════════════════════════════════════════════
// WAV Encoder (for analysis tools)
// ═══════════════════════════════════════════════════

function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1;
  const bitDepth = 16;
  const blockAlign = (numChannels * bitDepth) / 8;
  const byteRate = sampleRate * blockAlign;
  const dataSize = buffer.length * blockAlign;
  const headerSize = 44;
  const arrayBuffer = new ArrayBuffer(headerSize + dataSize);
  const view = new DataView(arrayBuffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(ch)[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}
