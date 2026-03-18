import { create } from "zustand";
import { VideoTask, VideoOperation } from "../types";
import { getFFmpeg } from "@/app/video-titan/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

interface VideoStore {
  task: VideoTask;
  setFile: (file: File) => void;
  setOperation: (operation: VideoOperation) => void;
  setOptions: (options: any) => void;
  processVideo: () => Promise<void>;
  reset: () => void;
}

export const useVideoStore = create<VideoStore>((set, get) => ({
  task: {
    id: "",
    file: null,
    operation: "idle",
    status: "idle",
    progress: 0,
    options: {},
  },
  setFile: (file) =>
    set((state) => ({
      task: { ...state.task, file, id: crypto.randomUUID(), status: "idle", progress: 0, resultUrl: undefined },
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
    if (!task.file || task.operation === "idle") return;

    set((state) => ({
      task: { ...state.task, status: "processing", progress: 0 },
    }));

    try {
      const ffmpeg = await getFFmpeg();
      const inputExt = task.file.name.substring(task.file.name.lastIndexOf("."));
      const inputName = "input" + inputExt;
      let outputName = "output.mp4";
      let outputMimeType = "video/mp4";

      ffmpeg.on("log", ({ message }) => {
        console.log(message);
      });

      ffmpeg.on("progress", ({ progress }) => {
        set((state) => ({
          task: { ...state.task, progress: Math.round(progress * 100) },
        }));
      });

      await ffmpeg.writeFile(inputName, await fetchFile(task.file));

      let args: string[] = [];
      const options = task.options || {};

      switch (task.operation) {
        case "converter":
          const format = options.format || "mp4";
          outputName = `output.${format}`;
          outputMimeType = `video/${format}`;
          args = ["-i", inputName, outputName];
          break;
        case "compressor":
          const crf = options.crf || "28";
          args = ["-i", inputName, "-vcodec", "libx264", "-crf", crf.toString(), outputName];
          break;
        case "cutter":
          const start = options.start || "00:00:00";
          const end = options.end || "00:00:10";
          args = ["-i", inputName, "-ss", start, "-to", end, "-c", "copy", outputName];
          break;
        case "merger":
          // For simplicity, we'd need multiple files. This is a placeholder for a single file merge (no-op)
          args = ["-i", inputName, "-c", "copy", outputName];
          break;
        case "remove-audio":
          args = ["-i", inputName, "-an", "-vcodec", "copy", outputName];
          break;
        case "extract-audio":
          const audioFormat = options.format || "mp3";
          outputName = `output.${audioFormat}`;
          outputMimeType = `audio/${audioFormat}`;
          args = ["-i", inputName, "-vn", "-acodec", audioFormat === "mp3" ? "libmp3lame" : "pcm_s16le", outputName];
          break;
        case "speed":
          const speed = options.speed || 1;
          const setpts = 1 / speed;
          const atempo = speed; // Note: atempo only supports 0.5 to 2.0. Need chaining for others.
          args = ["-i", inputName, "-filter_complex", `[0:v]setpts=${setpts}*PTS[v];[0:a]atempo=${atempo}[a]`, "-map", "[v]", "-map", "[a]", outputName];
          break;
        case "reverse":
          args = ["-i", inputName, "-vf", "reverse", "-af", "areverse", outputName];
          break;
        case "rotate":
          const degrees = options.degrees || "90";
          let transpose = "1"; // 90 clockwise
          if (degrees === "180") transpose = "2,transpose=2";
          if (degrees === "270") transpose = "2"; // 90 counter-clockwise
          args = ["-i", inputName, "-vf", `transpose=${transpose}`, outputName];
          break;
        case "crop":
          const cropW = options.width || "iw/2";
          const cropH = options.height || "ih/2";
          args = ["-i", inputName, "-vf", `crop=${cropW}:${cropH}`, outputName];
          break;
        case "resize":
          const resW = options.width || "1280";
          const resH = options.height || "720";
          args = ["-i", inputName, "-vf", `scale=${resW}:${resH}`, outputName];
          break;
        case "frame-extractor":
          outputName = "frame_%03d.jpg";
          outputMimeType = "image/jpeg";
          args = ["-i", inputName, "-vf", "fps=1", outputName];
          break;
        case "gif-generator":
          outputName = "output.gif";
          outputMimeType = "image/gif";
          args = ["-i", inputName, "-vf", "fps=10,scale=320:-1:flags=lanczos", outputName];
          break;
        case "thumbnail":
          outputName = "thumbnail.jpg";
          outputMimeType = "image/jpeg";
          args = ["-i", inputName, "-ss", "00:00:01", "-vframes", "1", outputName];
          break;
        case "filters":
          const brightness = options.brightness || 0;
          const contrast = options.contrast || 1;
          args = ["-i", inputName, "-vf", `eq=brightness=${brightness}:contrast=${contrast}`, outputName];
          break;
        case "noise-reduction":
          args = ["-i", inputName, "-vf", "hqdn3d", outputName];
          break;
        case "stabilization":
          args = ["-i", inputName, "-vf", "deshake", outputName];
          break;
        case "metadata":
          const title = options.title || "Untitled";
          args = ["-i", inputName, "-metadata", `title=${title}`, "-c", "copy", outputName];
          break;
        case "watermark":
          const text = options.text || "OMNI-TOOL";
          args = ["-i", inputName, "-vf", `drawtext=text='${text}':x=10:y=10:fontsize=24:fontcolor=white`, outputName];
          break;
        case "hls-generator":
          const segTime = options.segmentTime || 10;
          outputName = "master.m3u8";
          outputMimeType = "application/x-mpegURL";
          args = [
            "-i", inputName,
            "-profile:v", "baseline",
            "-level", "3.0",
            "-s", "640x360",
            "-start_number", "0",
            "-hls_time", segTime.toString(),
            "-hls_list_size", "0",
            "-f", "hls",
            outputName
          ];
          break;
        case "subtitle":
          const subText = options.subtitleText || "Sample Subtitle";
          // Create a temporary .srt file
          const srtContent = `1\n00:00:00,000 --> 00:00:10,000\n${subText}`;
          await ffmpeg.writeFile("sub.srt", srtContent);
          args = ["-i", inputName, "-vf", "subtitles=sub.srt", outputName];
          break;
        case "encryption":
          // Placeholder: Just a bitstream noise filter as "fake" encryption
          args = ["-i", inputName, "-bsf:v", "noise=amount=10", outputName];
          break;
        case "scene-detection":
          // Placeholder: Just return the original video
          args = ["-i", inputName, "-c", "copy", outputName];
          break;
        case "upscaling":
          // Placeholder: Just a scale filter as basic upscale
          args = ["-i", inputName, "-vf", "scale=iw*2:ih*2", outputName];
          break;
        case "downloader":
          // Placeholder: Just return original video
          args = ["-i", inputName, "-c", "copy", outputName];
          break;
        case "batch":
          // Placeholder: Just return original video
          args = ["-i", inputName, "-c", "copy", outputName];
          break;
        case "auto-subtitle":
          // Placeholder: Just return original video
          args = ["-i", inputName, "-c", "copy", outputName];
          break;
        default:
          args = ["-i", inputName, outputName];
      }

      await ffmpeg.exec(args);

      // Handle frame-extractor multiple files case (just take the first one for now)
      let finalOutputName = outputName;
      if (task.operation === "frame-extractor") {
        finalOutputName = "frame_001.jpg";
      }

      const data = await ffmpeg.readFile(finalOutputName);
      const url = URL.createObjectURL(new Blob([data as any], { type: outputMimeType }));

      set((state) => ({
        task: { ...state.task, status: "success", progress: 100, resultUrl: url },
      }));
    } catch (error) {
      console.error("FFmpeg Error:", error);
      set((state) => ({
        task: { ...state.task, status: "error", error: "Failed to process video" },
      }));
    }
  },
  reset: () =>
    set({
      task: {
        id: "",
        file: null,
        operation: "idle",
        status: "idle",
        progress: 0,
      },
    }),
}));
