import { ConverterTask } from '../types';
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

export const processAudioConverter = async (task: ConverterTask, onProgress: (p: number) => void): Promise<Blob> => {
  onProgress(10);
  const ffmpeg = new FFmpeg();
  
  ffmpeg.on("progress", ({ progress }) => {
    onProgress(10 + Math.round(progress * 85));
  });

  await ffmpeg.load({
    coreURL: "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js",
    wasmURL: "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm",
  });

  const file = task.files[0];
  const targetExt = (task.options.format as string) || "mp3";
  const inputName = `input_audio_${Date.now()}.${file.name.split('.').pop()}`;
  const outputName = `output_audio_${Date.now()}.${targetExt}`;

  await ffmpeg.writeFile(inputName, await fetchFile(file));

  // Audio specific args
  let args = ["-i", inputName];
  if (targetExt === "mp3") args.push("-b:a", "192k");
  else if (targetExt === "ogg") args.push("-c:a", "libvorbis");
  else if (targetExt === "wav") args.push("-c:a", "pcm_s16le");

  args.push(outputName);
  await ffmpeg.exec(args);

  const data = await ffmpeg.readFile(outputName);
  await ffmpeg.deleteFile(inputName);
  await ffmpeg.deleteFile(outputName);

  onProgress(100);
  
  const mimes: Record<string, string> = { mp3: 'audio/mpeg', wav: 'audio/wav', ogg: 'audio/ogg', flac: 'audio/flac' };
  return new Blob([data.slice()], { type: mimes[targetExt] || 'audio/mpeg' });
};
