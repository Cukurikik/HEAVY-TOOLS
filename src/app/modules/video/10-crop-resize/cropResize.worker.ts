/// <reference lib="webworker" />
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;
async function loadFFmpeg() {
  if (ffmpeg) return;
  ffmpeg = new FFmpeg();
  const base = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
  await ffmpeg.load({
    coreURL: await toBlobURL(base + '/ffmpeg-core.js', 'text/javascript'),
    wasmURL: await toBlobURL(base + '/ffmpeg-core.wasm', 'application/wasm'),
  });
}

function progress(v: number) { postMessage({ type: 'progress', value: v }); }
function done(blob: Blob) { postMessage({ type: 'complete', data: blob }); }
function fail(msg: string) { postMessage({ type: 'error', errorCode: 'FFMPEG_COMMAND_FAILED', message: msg }); }

addEventListener('message', async (e: MessageEvent) => {
  const { config } = e.data;
  try {
    await loadFFmpeg();
    if (!ffmpeg) throw new Error('FFmpeg not loaded');
    ffmpeg.on('progress', ({ progress: p }: any) => progress(Math.round(p * 100)));
    
    // Feature specific logic
const { file, mode = 'resize', cropRegion, targetWidth = 1920, targetHeight = 1080, padMode = 'pad' } = config;
const inName = 'in.mp4';
const outName = 'resized.mp4';
ffmpeg.writeFile(inName, await fetchFile(file));
const even = (n: number) => n % 2 === 0 ? n : n - 1;
let vf = '';
if (mode === 'crop' && cropRegion) {
  vf = `crop=${even(cropRegion.w)}:${even(cropRegion.h)}:${cropRegion.x}:${cropRegion.y}`;
} else {
  const tw = even(targetWidth);
  const th = even(targetHeight);
  if (padMode === 'pad') {
    vf = `scale=${tw}:${th}:force_original_aspect_ratio=decrease,pad=${tw}:${th}:(ow-iw)/2:(oh-ih)/2:black`;
  } else if (padMode === 'crop-to-fit') {
    vf = `scale=${tw}:${th}:force_original_aspect_ratio=increase,crop=${tw}:${th}`;
  } else {
    vf = `scale=${tw}:${th}`;
  }
}
await ffmpeg.exec(['-i', inName, '-vf', vf, '-c:v', 'libx264', '-preset', 'ultrafast', '-c:a', 'copy', outName]);
const data = await ffmpeg.readFile(outName);
done(new Blob([data as unknown as BlobPart], { type: 'video/mp4' }));
ffmpeg.deleteFile(inName); ffmpeg.deleteFile(outName);

  } catch (err: unknown) {
    fail(String(err));
  }
});
