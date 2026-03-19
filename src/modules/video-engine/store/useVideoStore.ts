import { create } from "zustand";
import { VideoTask, VideoOperation } from "../types";
import { getFFmpeg } from "@/app/video-titan/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

interface VideoStore {
  task: VideoTask;
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

export const useVideoStore = create<VideoStore>((set, get) => ({
  task: { ...initialTask },

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

    // Screen recorder is handled separately (no FFmpeg)
    if (task.operation === "screen-recorder") {
      await handleScreenRecording(set);
      return;
    }

    if (!task.file || task.operation === "idle") return;

    set((state) => ({
      task: { ...state.task, status: "processing", progress: 0, error: undefined },
    }));

    try {
      const ffmpeg = await getFFmpeg();
      const inputExt = task.file.name.substring(task.file.name.lastIndexOf("."));
      const inputName = "input" + inputExt;
      let outputName = "output.mp4";
      let outputMimeType = "video/mp4";

      ffmpeg.on("progress", ({ progress }) => {
        const pct = Math.min(Math.round(progress * 100), 99);
        set((state) => ({
          task: { ...state.task, progress: pct },
        }));
      });

      await ffmpeg.writeFile(inputName, await fetchFile(task.file));

      let args: string[] = [];
      const opts = task.options || {};

      switch (task.operation) {
        // ═══════════════════════════════════════
        // 1. VIDEO TRIMMER
        // ═══════════════════════════════════════
        case "trimmer": {
          const start = (opts.start as string) || "00:00:00";
          const end = (opts.end as string) || "00:00:10";
          args = ["-i", inputName, "-ss", start, "-to", end, "-c", "copy", outputName];
          break;
        }

        // ═══════════════════════════════════════
        // 2. VIDEO MERGER
        // ═══════════════════════════════════════
        case "merger": {
          const filesToMerge = task.files.length > 0 ? task.files : [task.file];
          let concatList = "";
          for (let i = 0; i < filesToMerge.length; i++) {
            const f = filesToMerge[i];
            if (!f) continue;
            const ext = f.name.substring(f.name.lastIndexOf("."));
            const name = `merge_${i}${ext}`;
            await ffmpeg.writeFile(name, await fetchFile(f));
            concatList += `file '${name}'\n`;
          }
          await ffmpeg.writeFile("concat.txt", concatList);
          args = ["-f", "concat", "-safe", "0", "-i", "concat.txt", "-c", "copy", outputName];
          break;
        }

        // ═══════════════════════════════════════
        // 3. VIDEO CONVERTER
        // ═══════════════════════════════════════
        case "converter": {
          const format = (opts.format as string) || "mp4";
          outputName = `output.${format}`;
          outputMimeType = format === "webm" ? "video/webm" : format === "avi" ? "video/x-msvideo" : `video/${format}`;
          if (format === "webm") {
            args = ["-i", inputName, "-c:v", "libvpx-vp9", "-crf", "30", "-b:v", "0", "-c:a", "libvorbis", outputName];
          } else {
            args = ["-i", inputName, "-c:v", "libx264", "-preset", "fast", outputName];
          }
          break;
        }

        // ═══════════════════════════════════════
        // 4. VIDEO COMPRESSOR
        // ═══════════════════════════════════════
        case "compressor": {
          const crf = (opts.crf as number) || 28;
          const preset = (opts.preset as string) || "medium";
          args = ["-i", inputName, "-c:v", "libx264", "-crf", crf.toString(), "-preset", preset, outputName];
          break;
        }

        // ═══════════════════════════════════════
        // 5. VIDEO FLIPPER
        // ═══════════════════════════════════════
        case "flipper": {
          const direction = (opts.direction as string) || "horizontal";
          const filter = direction === "vertical" ? "vflip" : "hflip";
          args = ["-i", inputName, "-vf", filter, "-c:a", "copy", outputName];
          break;
        }

        // ═══════════════════════════════════════
        // 6. VIDEO ROTATOR
        // ═══════════════════════════════════════
        case "rotator": {
          const deg = (opts.degrees as string) || "90";
          let vf = "transpose=1";
          if (deg === "180") vf = "transpose=1,transpose=1";
          if (deg === "270") vf = "transpose=2";
          args = ["-i", inputName, "-vf", vf, "-c:a", "copy", outputName];
          break;
        }

        // ═══════════════════════════════════════
        // 7. VIDEO STABILIZER
        // ═══════════════════════════════════════
        case "stabilizer": {
          args = ["-i", inputName, "-vf", "deshake", "-c:a", "copy", outputName];
          break;
        }

        // ═══════════════════════════════════════
        // 8. VIDEO REVERSER
        // ═══════════════════════════════════════
        case "reverse": {
          args = ["-i", inputName, "-vf", "reverse", "-af", "areverse", outputName];
          break;
        }

        // ═══════════════════════════════════════
        // 9. SPEED CONTROLLER
        // ═══════════════════════════════════════
        case "speed-control": {
          const speed = (opts.speed as number) || 1;
          const setpts = (1 / speed).toFixed(4);
          const atempo = Math.min(Math.max(speed, 0.5), 2.0);
          args = ["-i", inputName, "-filter_complex", `[0:v]setpts=${setpts}*PTS[v];[0:a]atempo=${atempo}[a]`, "-map", "[v]", "-map", "[a]", outputName];
          break;
        }

        // ═══════════════════════════════════════
        // 10. LOOP ENGINE
        // ═══════════════════════════════════════
        case "loop-engine": {
          const loops = (opts.loops as number) || 3;
          args = ["-stream_loop", (loops - 1).toString(), "-i", inputName, "-c", "copy", outputName];
          break;
        }

        // ═══════════════════════════════════════
        // 11. PRO EDITOR
        // ═══════════════════════════════════════
        case "pro-editor": {
          const proCrf = (opts.crf as number) || 23;
          const codec = (opts.codec as string) || "libx264";
          const profile = (opts.profile as string) || "high";
          const proPreset = (opts.preset as string) || "medium";
          args = ["-i", inputName, "-c:v", codec, "-crf", proCrf.toString(), "-profile:v", profile, "-preset", proPreset, "-c:a", "aac", outputName];
          break;
        }

        // ═══════════════════════════════════════
        // 12. THUMBNAIL EXTRACTOR
        // ═══════════════════════════════════════
        case "thumbnail-extractor": {
          const timestamp = (opts.timestamp as string) || "00:00:01";
          outputName = "thumbnail.jpg";
          outputMimeType = "image/jpeg";
          args = ["-i", inputName, "-ss", timestamp, "-vframes", "1", "-q:v", "2", outputName];
          break;
        }

        // ═══════════════════════════════════════
        // 13. SUBTITLE BURNER
        // ═══════════════════════════════════════
        case "subtitle-burner": {
          const subText = (opts.subtitleText as string) || "Sample Subtitle";
          const subStart = (opts.subStart as string) || "00:00:00,000";
          const subEnd = (opts.subEnd as string) || "00:00:10,000";
          const srtContent = `1\n${subStart} --> ${subEnd}\n${subText}`;
          await ffmpeg.writeFile("sub.srt", srtContent);
          args = ["-i", inputName, "-vf", "subtitles=sub.srt", "-c:a", "copy", outputName];
          break;
        }

        // ═══════════════════════════════════════
        // 14. WATERMARK TOOL
        // ═══════════════════════════════════════
        case "watermark": {
          const text = (opts.text as string) || "HEAVY-TOOLS";
          const posX = (opts.posX as string) || "10";
          const posY = (opts.posY as string) || "10";
          const fontSize = (opts.fontSize as number) || 24;
          const fontColor = (opts.fontColor as string) || "white";
          args = ["-i", inputName, "-vf", `drawtext=text='${text}':x=${posX}:y=${posY}:fontsize=${fontSize}:fontcolor=${fontColor}:shadowcolor=black:shadowx=2:shadowy=2`, "-c:a", "copy", outputName];
          break;
        }

        // ═══════════════════════════════════════
        // 15. NOISE REDUCER
        // ═══════════════════════════════════════
        case "noise-reducer": {
          const strength = (opts.strength as string) || "7";
          args = ["-i", inputName, "-vf", `hqdn3d=${strength}`, "-c:a", "copy", outputName];
          break;
        }

        // ═══════════════════════════════════════
        // 16. COLOR GRADER
        // ═══════════════════════════════════════
        case "color-grader": {
          const brightness = (opts.brightness as number) || 0;
          const contrast = (opts.contrast as number) || 1;
          const saturation = (opts.saturation as number) || 1;
          const hue = (opts.hue as number) || 0;
          args = ["-i", inputName, "-vf", `eq=brightness=${brightness}:contrast=${contrast}:saturation=${saturation},hue=h=${hue}`, "-c:a", "copy", outputName];
          break;
        }

        // ═══════════════════════════════════════
        // 17. AI UPSCALER (Resolution)
        // ═══════════════════════════════════════
        case "resolution-upscaler": {
          const scale = (opts.scale as number) || 2;
          args = ["-i", inputName, "-vf", `scale=iw*${scale}:ih*${scale}:flags=bicubic`, "-c:a", "copy", outputName];
          break;
        }

        // ═══════════════════════════════════════
        // 18. FRAME INTERPOLATOR
        // ═══════════════════════════════════════
        case "frame-interpolator": {
          const targetFps = (opts.fps as number) || 60;
          args = ["-i", inputName, "-vf", `minterpolate=fps=${targetFps}:mi_mode=mci`, "-c:a", "copy", outputName];
          break;
        }

        // ═══════════════════════════════════════
        // 19. GIF CONVERTER
        // ═══════════════════════════════════════
        case "gif-converter": {
          const gifFps = (opts.fps as number) || 10;
          const gifScale = (opts.scale as number) || 480;
          outputName = "output.gif";
          outputMimeType = "image/gif";
          args = ["-i", inputName, "-vf", `fps=${gifFps},scale=${gifScale}:-1:flags=lanczos`, outputName];
          break;
        }

        // ═══════════════════════════════════════
        // 20. HDR TONEMAPPER
        // ═══════════════════════════════════════
        case "hdr-tonemapper": {
          args = ["-i", inputName, "-vf", "zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p", "-c:a", "copy", outputName];
          break;
        }

        // ═══════════════════════════════════════
        // 21. BLACK & WHITE
        // ═══════════════════════════════════════
        case "black-white": {
          args = ["-i", inputName, "-vf", "hue=s=0", "-c:a", "copy", outputName];
          break;
        }

        // ═══════════════════════════════════════
        // 22. SLOW MOTION
        // ═══════════════════════════════════════
        case "slow-motion": {
          const slowFactor = (opts.factor as number) || 0.5;
          const slowPts = (1 / slowFactor).toFixed(4);
          args = ["-i", inputName, "-vf", `setpts=${slowPts}*PTS`, "-an", outputName];
          break;
        }

        // ═══════════════════════════════════════
        // 23. TIMELAPSE MAKER
        // ═══════════════════════════════════════
        case "timelapse": {
          const tlSpeed = (opts.speed as number) || 10;
          const tlPts = (1 / tlSpeed).toFixed(4);
          args = ["-i", inputName, "-vf", `setpts=${tlPts}*PTS`, "-an", outputName];
          break;
        }

        // ═══════════════════════════════════════
        // 25. METADATA EDITOR
        // ═══════════════════════════════════════
        case "metadata-editor": {
          const title = (opts.title as string) || "";
          const author = (opts.author as string) || "";
          const copyright = (opts.copyright as string) || "";
          const metaArgs: string[] = ["-i", inputName];
          if (title) metaArgs.push("-metadata", `title=${title}`);
          if (author) metaArgs.push("-metadata", `artist=${author}`);
          if (copyright) metaArgs.push("-metadata", `copyright=${copyright}`);
          metaArgs.push("-c", "copy", outputName);
          args = metaArgs;
          break;
        }

        // ═══════════════════════════════════════
        // 26. BATCH PROCESSOR
        // ═══════════════════════════════════════
        case "batch-processor": {
          const batchOp = (opts.batchOperation as string) || "compress";
          const batchCrf = (opts.batchCrf as number) || 28;
          if (batchOp === "compress") {
            args = ["-i", inputName, "-c:v", "libx264", "-crf", batchCrf.toString(), "-preset", "fast", outputName];
          } else if (batchOp === "grayscale") {
            args = ["-i", inputName, "-vf", "hue=s=0", "-c:a", "copy", outputName];
          } else {
            args = ["-i", inputName, "-c", "copy", outputName];
          }
          break;
        }

        // ═══════════════════════════════════════
        // 27. CHAPTER MARKER
        // ═══════════════════════════════════════
        case "chapter-marker": {
          const chapters = (opts.chapters as string) || "00:00:00=Intro\n00:01:00=Chapter 1";
          const metadataLines = [";FFMETADATA1"];
          const chapterLines = chapters.split("\n").filter((l: string) => l.trim());
          for (let i = 0; i < chapterLines.length; i++) {
            const [time, title] = chapterLines[i].split("=");
            const parts = time.trim().split(":");
            const secs = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
            const startMs = secs * 1000;
            const endMs = i < chapterLines.length - 1 ? (() => {
              const [nt] = chapterLines[i + 1].split("=");
              const np = nt.trim().split(":");
              return (parseInt(np[0]) * 3600 + parseInt(np[1]) * 60 + parseInt(np[2])) * 1000;
            })() : startMs + 60000;
            metadataLines.push("[CHAPTER]", `TIMEBASE=1/1000`, `START=${startMs}`, `END=${endMs}`, `title=${(title || "Chapter").trim()}`);
          }
          await ffmpeg.writeFile("metadata.txt", metadataLines.join("\n"));
          args = ["-i", inputName, "-i", "metadata.txt", "-map_metadata", "1", "-c", "copy", outputName];
          break;
        }

        // ═══════════════════════════════════════
        // 28. AUDIO EXTRACTOR
        // ═══════════════════════════════════════
        case "audio-extractor": {
          const audioFmt = (opts.format as string) || "mp3";
          outputName = `output.${audioFmt}`;
          outputMimeType = audioFmt === "mp3" ? "audio/mpeg" : audioFmt === "wav" ? "audio/wav" : audioFmt === "aac" ? "audio/aac" : `audio/${audioFmt}`;
          if (audioFmt === "mp3") {
            args = ["-i", inputName, "-vn", "-acodec", "libmp3lame", "-q:a", "2", outputName];
          } else if (audioFmt === "wav") {
            args = ["-i", inputName, "-vn", "-acodec", "pcm_s16le", outputName];
          } else {
            args = ["-i", inputName, "-vn", "-c:a", "copy", outputName];
          }
          break;
        }

        // ═══════════════════════════════════════
        // 29. VIDEO SPLITTER
        // ═══════════════════════════════════════
        case "video-splitter": {
          const segDuration = (opts.segmentDuration as number) || 30;
          outputName = "segment_%03d.mp4";
          args = ["-i", inputName, "-c", "copy", "-f", "segment", "-segment_time", segDuration.toString(), "-reset_timestamps", "1", outputName];
          // We'll read the first segment
          break;
        }

        // ═══════════════════════════════════════
        // 30. ASPECT RATIO TOOL
        // ═══════════════════════════════════════
        case "aspect-ratio": {
          const ratio = (opts.ratio as string) || "16:9";
          const mode = (opts.mode as string) || "crop";
          if (mode === "crop") {
            if (ratio === "16:9") args = ["-i", inputName, "-vf", "crop=iw:iw*9/16", "-c:a", "copy", outputName];
            else if (ratio === "4:3") args = ["-i", inputName, "-vf", "crop=ih*4/3:ih", "-c:a", "copy", outputName];
            else if (ratio === "1:1") args = ["-i", inputName, "-vf", "crop=min(iw\\,ih):min(iw\\,ih)", "-c:a", "copy", outputName];
            else if (ratio === "9:16") args = ["-i", inputName, "-vf", "crop=ih*9/16:ih", "-c:a", "copy", outputName];
            else args = ["-i", inputName, "-vf", "crop=iw:iw*9/16", "-c:a", "copy", outputName];
          } else {
            // Letterbox / pad
            if (ratio === "16:9") args = ["-i", inputName, "-vf", "pad=iw:iw*9/16:(ow-iw)/2:(oh-ih)/2:black", "-c:a", "copy", outputName];
            else if (ratio === "4:3") args = ["-i", inputName, "-vf", "pad=ih*4/3:ih:(ow-iw)/2:(oh-ih)/2:black", "-c:a", "copy", outputName];
            else if (ratio === "1:1") args = ["-i", inputName, "-vf", "pad=max(iw\\,ih):max(iw\\,ih):(ow-iw)/2:(oh-ih)/2:black", "-c:a", "copy", outputName];
            else if (ratio === "9:16") args = ["-i", inputName, "-vf", "pad=ih*9/16:ih:(ow-iw)/2:(oh-ih)/2:black", "-c:a", "copy", outputName];
            else args = ["-i", inputName, "-vf", "pad=iw:iw*9/16:(ow-iw)/2:(oh-ih)/2:black", "-c:a", "copy", outputName];
          }
          break;
        }

        default:
          args = ["-i", inputName, "-c", "copy", outputName];
      }

      let ffmpegLogs = "";
      const logCallback = ({ message }: { message: string }) => {
        ffmpegLogs += message + "\n";
      };
      ffmpeg.on("log", logCallback);

      if (args.length > 0) {
        const ret = await ffmpeg.exec(args);
        ffmpeg.off("log", logCallback);
        if (ret !== 0) {
          console.error("FFmpeg Video Logs:", ffmpegLogs);
          throw new Error(`FFmpeg failed with code ${ret}.`);
        }
      } else {
        ffmpeg.off("log", logCallback);
      }

      // Handle splitter — read first segment
      let finalOutputName = outputName;
      if (task.operation === "video-splitter") {
        finalOutputName = "segment_000.mp4";
      }

      const data = await ffmpeg.readFile(finalOutputName);
      const blob = new Blob([data as unknown as BlobPart], { type: outputMimeType });
      const url = URL.createObjectURL(blob);

      set((state) => ({
        task: { ...state.task, status: "success", progress: 100, resultUrl: url },
      }));
    } catch (error) {
      console.error("FFmpeg Error occurred during processing.", error);
      set((state) => ({
        task: {
          ...state.task,
          status: "error",
          error: "Processing failed securely. Please try a different file or settings.",
        },
      }));
    }
  },

  reset: () =>
    set({
      task: { ...initialTask },
    }),
}));

// ═══════════════════════════════════════
// Screen Recording (Browser API, no FFmpeg)
// ═══════════════════════════════════════
async function handleScreenRecording(
  set: (fn: (state: { task: VideoTask }) => { task: VideoTask }) => void
) {
  try {
    set((state) => ({
      task: { ...state.task, status: "processing", progress: 10 },
    }));

    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { width: 1920, height: 1080 },
      audio: true,
    });

    const recorder = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=vp9",
    });

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

    // Auto-stop after stream ends (user clicks "Stop sharing")
    stream.getVideoTracks()[0].onended = () => {
      if (recorder.state !== "inactive") {
        recorder.stop();
      }
    };
  } catch (error) {
    set((state) => ({
      task: {
        ...state.task,
        status: "error",
        error: "Screen recording cancelled or not supported.",
      },
    }));
  }
}
