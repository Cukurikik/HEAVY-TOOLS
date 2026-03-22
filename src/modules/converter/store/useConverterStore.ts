import { create } from "zustand";
import { ConverterTask } from "../types";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

interface ConverterStore {
  task: ConverterTask;
  ffmpeg: FFmpeg | null;
  isFfmpegLoaded: boolean;
  loadFfmpeg: () => Promise<void>;
  setFile: (file: File) => void;
  setOperation: (operation: ConverterTask["operation"]) => void;
  processConversion: () => Promise<void>;
  reset: () => void;
}

export const useConverterStore = create<ConverterStore>((set, get) => ({
  task: {
    id: "",
    file: null,
    operation: "idle",
    status: "idle",
    progress: 0,
  },
  ffmpeg: null,
  isFfmpegLoaded: false,
  loadFfmpeg: async () => {
    const { isFfmpegLoaded } = get();
    if (isFfmpegLoaded) return;

    try {
      const ffmpeg = new FFmpeg();
      ffmpeg.on("progress", ({ progress }) => {
        set((state) => ({
          task: { ...state.task, progress: Math.round(progress * 100) },
        }));
      });

      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
      await ffmpeg.load({
        coreURL: `${baseURL}/ffmpeg-core.js`,
        wasmURL: `${baseURL}/ffmpeg-core.wasm`,
      });

      set({ ffmpeg, isFfmpegLoaded: true });
    } catch (error) {
      console.error("Error loading FFmpeg:", error);
      set((state) => ({
        task: { ...state.task, status: "error", error: "Failed to load processing engine. Ensure you are online and refresh the page." }
      }));
    }
  },
  setFile: (file) =>
    set((state) => ({
      task: { ...state.task, file, id: crypto.randomUUID(), status: "idle", error: undefined, outputUrl: undefined, outputName: undefined, progress: 0 },
    })),
  setOperation: (operation) =>
    set((state) => ({
      task: { ...state.task, operation },
    })),
  processConversion: async () => {
    const { task, ffmpeg, isFfmpegLoaded, loadFfmpeg } = get();
    if (!task.file || task.operation === "idle") return;

    if (!isFfmpegLoaded || !ffmpeg) {
      await loadFfmpeg();
    }

    // Check again after attempt to load
    const currentStore = get();
    if (!currentStore.isFfmpegLoaded || !currentStore.ffmpeg) {
       return; // error already set in loadFfmpeg
    }

    set((state) => ({
      task: { ...state.task, status: "processing", progress: 0, error: undefined },
    }));

    try {
      const activeFfmpeg = currentStore.ffmpeg;
      const inputFile = task.file;
      const inputFileName = "input_" + inputFile.name.replace(/[^a-zA-Z0-9.]/g, "");

      let outputExt = "";
      let outputMime = "";
      let args: string[] = [];

      switch (task.operation) {
        case "video":
          outputExt = "mp4";
          outputMime = "video/mp4";
          args = ["-i", inputFileName, "-c:v", "libx264", "-preset", "fast", "-crf", "28", "-c:a", "aac", "-b:a", "128k"];
          break;
        case "audio":
          outputExt = "mp3";
          outputMime = "audio/mpeg";
          args = ["-i", inputFileName, "-c:a", "libmp3lame", "-q:a", "2"];
          break;
        case "image":
          outputExt = "jpg";
          outputMime = "image/jpeg";
          args = ["-i", inputFileName];
          break;
        case "document":
          // Since FFmpeg doesn't reliably convert documents, we mock it or fail safely
          // It's likely the UI shouldn't allow document conversion using FFmpeg,
          // but if it's there we throw an unsupported error
          throw new Error("Document conversion is not supported by the current media engine.");
        default:
          throw new Error("Invalid operation.");
      }

      const outputFileName = `output_${Date.now()}.${outputExt}`;
      args.push(outputFileName);

      // Write file to virtual FS
      await activeFfmpeg.writeFile(inputFileName, await fetchFile(inputFile));

      // Execute command
      await activeFfmpeg.exec(args);

      // Read result
      const data = await activeFfmpeg.readFile(outputFileName);
      const outputBlob = new Blob([new Uint8Array(data as any)], { type: outputMime });
      const outputUrl = URL.createObjectURL(outputBlob);

      // Cleanup FS
      await activeFfmpeg.deleteFile(inputFileName);
      await activeFfmpeg.deleteFile(outputFileName);

      set((state) => ({
        task: {
          ...state.task,
          status: "success",
          progress: 100,
          outputUrl,
          outputName: `converted_${inputFile.name.split('.')[0]}.${outputExt}`
        },
      }));
    } catch (error: any) {
      console.error("Conversion failed:", error);
      set((state) => ({
        task: {
          ...state.task,
          status: "error",
          error: error?.message || "An unexpected error occurred during conversion."
        },
      }));
    }
  },
  reset: () => {
    const { task } = get();
    if (task.outputUrl) {
      URL.revokeObjectURL(task.outputUrl);
    }
    set({
      task: {
        id: "",
        file: null,
        operation: "idle",
        status: "idle",
        progress: 0,
      },
    });
  },
}));
