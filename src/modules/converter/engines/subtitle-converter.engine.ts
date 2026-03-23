import { ConverterTask } from '../types';

export const processSubtitleConverter = async (task: ConverterTask, onProgress: (p: number) => void): Promise<Blob> => {
  onProgress(20);
  
  if (!task.files || task.files.length === 0) throw new Error("No subtitle file provided.");
  const text = await task.files[0].text();
  const format = (task.options.format as string) || "vtt";

  onProgress(60);

  let outputText = "";
  if (format === "vtt") {
    // SRT to VTT basic conversion
    outputText = "WEBVTT\n\n" + text.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2");
  } else {
    // VTT to SRT
    outputText = text.replace(/^WEBVTT\n+(.*)$/m, "").replace(/(\d{2}:\d{2}:\d{2})\.(\d{3})/g, "$1,$2").trim();
  }

  onProgress(100);
  return new Blob([outputText], { type: format === "vtt" ? "text/vtt" : "text/plain" });
};
