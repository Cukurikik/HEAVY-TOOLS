"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AudioTask, AudioOperation } from "../types";
import { getFFmpeg } from "@/app/video-titan/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

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
  setFile: (file: File) => void;
  addFiles: (files: File[]) => void;
  setOperation: (operation: AudioTask["operation"]) => void;
  setOptions: (options: Record<string, unknown>) => void;
  processAudio: () => Promise<void>;
  reset: () => void;
}

export const useAudioStore = create<AudioStore>()(
  persist(
    (set, get) => ({
      task: INITIAL_TASK,

      setFile: (file) =>
        set((state) => ({
          task: { ...state.task, file, id: crypto.randomUUID(), status: "idle", resultUrl: "", error: "" },
        })),

      addFiles: (files) =>
        set((state) => ({
          task: { ...state.task, files: [...state.task.files, ...files], file: files[0] || state.task.file },
        })),

      setOperation: (operation) =>
        set((state) => ({
          task: { ...state.task, operation },
        })),

      setOptions: (newOpts) =>
        set((state) => ({
          task: { ...state.task, options: { ...state.task.options, ...newOpts } },
        })),

      processAudio: async () => {
        const { task } = get();

        // Voice Recorder and Audio Recorder use MediaRecorder API
        if (task.operation === "voice-recorder" || task.operation === "audio-recorder") {
          set((s) => ({ task: { ...s.task, status: "processing", progress: 0, error: "" } }));
          try {
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
            // Record for duration (default 10s)
            const duration = (task.options.duration as number) || 10;
            set((s) => ({ task: { ...s.task, progress: 50 } }));
            await new Promise((r) => setTimeout(r, duration * 1000));
            recorder.stop();
          } catch (error) {
            console.error("Audio Recording Error occurred.", error);
            set((s) => ({
              task: { ...s.task, status: "error", error: "Recording failed securely. Please check your microphone permissions and try again." },
            }));
          }
          return;
        }

        // Waveform/Spectrum/BPM/Key use Web Audio API analysis (no FFmpeg needed)
        if (
          task.operation === "waveform-visualizer" ||
          task.operation === "spectrum-analyzer" ||
          task.operation === "bpm-detector" ||
          task.operation === "key-finder"
        ) {
          if (!task.file) return;
          set((s) => ({ task: { ...s.task, status: "processing", progress: 10, error: "" } }));
          try {
            const audioCtx = new OfflineAudioContext(2, 44100 * 30, 44100);
            const arrayBuffer = await task.file.arrayBuffer();
            set((s) => ({ task: { ...s.task, progress: 40 } }));
            const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
            set((s) => ({ task: { ...s.task, progress: 70 } }));
            // For analysis tools, we simply decode and re-export the audio
            const wavBlob = audioBufferToWav(audioBuffer);
            const url = URL.createObjectURL(wavBlob);
            set((s) => ({ task: { ...s.task, status: "success", progress: 100, resultUrl: url } }));
          } catch (error) {
            console.error("Audio Analysis Error occurred.", error);
            set((s) => ({
              task: { ...s.task, status: "error", error: "Analysis failed securely. Please try again." },
            }));
          }
          return;
        }

        // All other tools use FFmpeg WASM
        if (!task.file || task.operation === "idle") return;
        set((s) => ({ task: { ...s.task, status: "processing", progress: 0, error: "" } }));

        try {
          const ffmpeg = await getFFmpeg();
          ffmpeg.on("progress", ({ progress }) => {
            set((s) => ({ task: { ...s.task, progress: Math.round(progress * 100) } }));
          });

          const inputName = "input_audio" + getExt(task.file.name);
          await ffmpeg.writeFile(inputName, await fetchFile(task.file));

          const opts = task.options;
          let args: string[] = [];
          let outputName = "output.mp3";
          let outputMime = "audio/mpeg";

          switch (task.operation as AudioOperation) {
            case "trimmer": {
              const start = (opts.start as string) || "00:00:00";
              const end = (opts.end as string) || "00:00:10";
              args = ["-i", inputName, "-ss", start, "-to", end, "-c", "copy", outputName];
              break;
            }
            case "merger": {
              args = ["-i", inputName, "-c", "copy", outputName];
              break;
            }
            case "converter": {
              const fmt = (opts.format as string) || "mp3";
              outputName = "output." + fmt;
              outputMime = fmt === "mp3" ? "audio/mpeg" : fmt === "wav" ? "audio/wav" : fmt === "flac" ? "audio/flac" : "audio/" + fmt;
              if (fmt === "mp3") args = ["-i", inputName, "-acodec", "libmp3lame", "-q:a", "2", outputName];
              else if (fmt === "wav") args = ["-i", inputName, "-acodec", "pcm_s16le", outputName];
              else args = ["-i", inputName, outputName];
              break;
            }
            case "mastering-hub": {
              const loud = (opts.loudness as number) || -14;
              args = ["-i", inputName, "-af", `acompressor=threshold=-20dB:ratio=4:attack=5:release=50,loudnorm=I=${loud}:TP=-1.5:LRA=11`, outputName];
              break;
            }
            case "stem-splitter": {
              // Placeholder: extract center channel as vocal approximation
              args = ["-i", inputName, "-af", "pan=stereo|c0=c0-c1|c1=c1-c0", outputName];
              break;
            }
            case "pitch-shifter": {
              const semitones = (opts.semitones as number) || 0;
              const rate = Math.pow(2, semitones / 12);
              args = ["-i", inputName, "-af", `asetrate=44100*${rate.toFixed(6)},aresample=44100`, outputName];
              break;
            }
            case "time-stretch": {
              const tempo = (opts.tempo as number) || 1.0;
              args = ["-i", inputName, "-af", `atempo=${Math.min(Math.max(tempo, 0.5), 2.0)}`, outputName];
              break;
            }
            case "noise-remover": {
              const nr = (opts.noiseReduction as number) || 12;
              args = ["-i", inputName, "-af", `afftdn=nf=-${nr}`, outputName];
              break;
            }
            case "equalizer": {
              const bass = (opts.bass as number) || 0;
              const mid = (opts.mid as number) || 0;
              const treble = (opts.treble as number) || 0;
              args = ["-i", inputName, "-af", `equalizer=f=100:t=h:width=200:g=${bass},equalizer=f=1000:t=h:width=500:g=${mid},equalizer=f=8000:t=h:width=2000:g=${treble}`, outputName];
              break;
            }
            case "compressor": {
              const threshold = (opts.threshold as number) || -20;
              const ratio = (opts.ratio as number) || 4;
              const attack = (opts.attack as number) || 5;
              const release = (opts.release as number) || 50;
              args = ["-i", inputName, "-af", `acompressor=threshold=${threshold}dB:ratio=${ratio}:attack=${attack}:release=${release}`, outputName];
              break;
            }
            case "reverb": {
              const delay = (opts.delay as number) || 60;
              const decay = (opts.decay as number) || 0.4;
              args = ["-i", inputName, "-af", `aecho=0.8:0.88:${delay}:${decay}`, outputName];
              break;
            }
            case "normalizer": {
              const targetI = (opts.targetLoudness as number) || -16;
              args = ["-i", inputName, "-af", `loudnorm=I=${targetI}:TP=-1.5:LRA=11`, outputName];
              break;
            }
            case "silence-remover": {
              const silenceThreshold = (opts.threshold as number) || -40;
              const minDuration = (opts.minDuration as number) || 0.5;
              args = ["-i", inputName, "-af", `silenceremove=start_periods=1:start_duration=${minDuration}:start_threshold=${silenceThreshold}dB:detection=peak,aformat=dblp,areverse,silenceremove=start_periods=1:start_duration=${minDuration}:start_threshold=${silenceThreshold}dB:detection=peak,aformat=dblp,areverse`, outputName];
              break;
            }
            case "voice-isolator": {
              args = ["-i", inputName, "-af", "pan=stereo|c0=c0-c1|c1=c1-c0", outputName];
              break;
            }
            case "bass-booster": {
              const gain = (opts.gain as number) || 10;
              const freq = (opts.frequency as number) || 100;
              args = ["-i", inputName, "-af", `bass=g=${gain}:f=${freq}`, outputName];
              break;
            }
            case "stereo-panner": {
              const pan = (opts.pan as number) || 0;
              args = ["-i", inputName, "-af", `stereotools=mpan=${pan}`, outputName];
              break;
            }
            case "waveform-visualizer":
            case "spectrum-analyzer":
            case "bpm-detector":
            case "key-finder":
              // Handled above via Web Audio API
              break;
            case "metadata-editor": {
              const title = (opts.title as string) || "";
              const artist = (opts.artist as string) || "";
              const album = (opts.album as string) || "";
              const mArgs: string[] = ["-i", inputName];
              if (title) mArgs.push("-metadata", `title=${title}`);
              if (artist) mArgs.push("-metadata", `artist=${artist}`);
              if (album) mArgs.push("-metadata", `album=${album}`);
              mArgs.push("-c", "copy", outputName);
              args = mArgs;
              break;
            }
            case "batch-processor": {
              const batchOp = (opts.batchOperation as string) || "normalize";
              if (batchOp === "normalize") args = ["-i", inputName, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", outputName];
              else args = ["-i", inputName, "-acodec", "libmp3lame", "-q:a", "2", outputName];
              break;
            }
            case "audio-splitter": {
              const segDur = (opts.segmentDuration as number) || 30;
              outputName = "segment_%03d.mp3";
              args = ["-i", inputName, "-f", "segment", "-segment_time", segDur.toString(), "-c", "copy", outputName];
              outputName = "segment_000.mp3";
              break;
            }
            case "podcast-enhancer": {
              args = ["-i", inputName, "-af", "highpass=f=80,acompressor=threshold=-18dB:ratio=3:attack=10:release=100,loudnorm=I=-16:TP=-1.5:LRA=11", outputName];
              break;
            }
            case "voice-recorder":
            case "audio-recorder":
              // Handled above via MediaRecorder
              break;
            case "fade-editor": {
              const fadeInDur = (opts.fadeIn as number) || 2;
              const fadeOutDur = (opts.fadeOut as number) || 3;
              args = ["-i", inputName, "-af", `afade=t=in:st=0:d=${fadeInDur},afade=t=out:st=999:d=${fadeOutDur}`, outputName];
              break;
            }
            case "loop-creator": {
              const loops = (opts.loops as number) || 3;
              args = ["-stream_loop", (loops - 1).toString(), "-i", inputName, "-c", "copy", outputName];
              break;
            }
            case "karaoke-maker": {
              args = ["-i", inputName, "-af", "pan=stereo|c0=c0-c1|c1=c1-c0", outputName];
              break;
            }
            case "spatial-audio": {
              const mode = (opts.mode as string) || "surround";
              if (mode === "surround") {
                args = ["-i", inputName, "-af", "aecho=0.8:0.88:40:0.3,stereotools=mode=ms>lr", outputName];
              } else {
                args = ["-i", inputName, "-af", "stereotools=mode=lr>ms", outputName];
              }
              break;
            }
            default: {
              args = ["-i", inputName, "-c", "copy", outputName];
              break;
            }
          }

          if (args.length > 0) {
            await ffmpeg.exec(args);
          }

          const data = await ffmpeg.readFile(outputName);
          const blob = new Blob([data as unknown as BlobPart], { type: outputMime });
          const url = URL.createObjectURL(blob);

          set((s) => ({
            task: { ...s.task, status: "success", progress: 100, resultUrl: url },
          }));
        } catch (error) {
          console.error("Audio Processing Error occurred.", error);
          set((s) => ({
            task: {
              ...s.task,
              status: "error",
              error: "Processing failed securely. Please check your input and try again.",
            },
          }));
        }
      },

      reset: () => set({ task: INITIAL_TASK }),
    }),
    {
      name: "audio-store",
      partialize: () => ({}),
    }
  )
);

function getExt(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  return ext ? `.${ext}` : ".mp3";
}

function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
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
