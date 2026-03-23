import { ConverterTask } from '../types';
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

export const processVideoConverter = async (task: ConverterTask, onProgress: (p: number) => void): Promise<Blob> => {
  onProgress(5);
  const ffmpeg = new FFmpeg();
  
  ffmpeg.on("progress", ({ progress }) => {
    onProgress(5 + Math.round(progress * 90));
  });

  await ffmpeg.load({
    coreURL: "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js",
    wasmURL: "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm",
  });

  const file = task.files[0];
  const targetExt = (task.options.format as string) || "mp4";
  const inputName = `input_${Date.now()}.${file.name.split('.').pop()}`;
  const outputName = `output_${Date.now()}.${targetExt}`;

  await ffmpeg.writeFile(inputName, await fetchFile(file));

  // Default universal encoding for web formats
  const args = ["-i", inputName];
  if (targetExt === "mp4") {
    args.push("-c:v", "libx264", "-preset", "ultrafast", "-crf", "28");
  } else if (targetExt === "webm") {
    args.push("-c:v", "libvpx-vp9", "-crf", "30", "-b:v", "0");
  } else if (targetExt === "gif") {
    args.push("-vf", "fps=10,scale=320:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse");
  }

  args.push(outputName);
  await ffmpeg.exec(args);

  const data = await ffmpeg.readFile(outputName);
  await ffmpeg.deleteFile(inputName);
  await ffmpeg.deleteFile(outputName);

  onProgress(100);
  
  // Mime lookup
  const mimes: Record<string, string> = { mp4: 'video/mp4', webm: 'video/webm', gif: 'image/gif', mkv: 'video/x-matroska' };
  return new Blob([data.slice()], { type: mimes[targetExt] || 'video/mp4' });
};
