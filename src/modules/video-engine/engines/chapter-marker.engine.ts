import type { FFmpeg } from "@ffmpeg/ffmpeg";
export interface ChapterMarkerOptions { [key: string]: unknown; }
export async function buildChapterMarkerArgs(input: string, output: string, opts: ChapterMarkerOptions, ffmpeg?: FFmpeg, files?: File[]): Promise<string[]> {
  if (!ffmpeg) return [];
  const chapters = (opts.chapters as string) || "00:00:00=Intro\n00:01:00=Chapter 1";
  const metadataLines = [";FFMETADATA1"];
  const chapterLines = chapters.split("\n").filter((l: string) => l.trim());
  for (let i = 0; i < chapterLines.length; i++) {
    const [time, chTitle] = chapterLines[i].split("=");
    const parts = time.trim().split(":");
    const secs = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    const startMs = secs * 1000;
    const endMs = i < chapterLines.length - 1
      ? (() => {
          const [nt] = chapterLines[i + 1].split("=");
          const np = nt.trim().split(":");
          return (parseInt(np[0]) * 3600 + parseInt(np[1]) * 60 + parseInt(np[2])) * 1000;
        })()
      : startMs + 60000;
    metadataLines.push("[CHAPTER]", "TIMEBASE=1/1000", `START=${startMs}`, `END=${endMs}`, `title=${(chTitle || "Chapter").trim()}`);
  }
  await ffmpeg.writeFile("metadata.txt", metadataLines.join("\n"));
  return ["-i", input, "-i", "metadata.txt", "-map_metadata", "1", "-c", "copy", output];
}
export function getChapterMarkerOutputName(opts: ChapterMarkerOptions): string { return "output.mp4"; }
export function getChapterMarkerMimeType(opts: ChapterMarkerOptions): string { return "video/mp4"; }