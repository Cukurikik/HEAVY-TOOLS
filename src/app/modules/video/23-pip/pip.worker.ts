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
const { file, overlayFile, position = 'bottom-right', scale = 0.3 } = config;
const inName = 'in.mp4';
const overName = 'over.mp4';
const outName = 'pip.mp4';
ffmpeg.writeFile(inName, await fetchFile(file));
if (overlayFile) ffmpeg.writeFile(overName, await fetchFile(overlayFile));
if (overlayFile) {
  let posStr = 'W-w-20:H-h-20';
  if (position === 'top-left') posStr = '20:20';
  else if (position === 'top-right') posStr = 'W-w-20:20';
  else if (position === 'bottom-left') posStr = '20:H-h-20';
  const filter = `[1:v]scale=iw*${scale}:ih*${scale}[ovrl];[0:v][ovrl]overlay=${posStr}`;
  await ffmpeg.exec(['-i', inName, '-i', overName, '-filter_complex', filter, '-c:v', 'libx264', '-preset', 'ultrafast', '-c:a', 'aac', outName]);
} else {
  await ffmpeg.exec(['-i', inName, '-c', 'copy', outName]);
}
const data = await ffmpeg.readFile(outName);
done(new Blob([new Uint8Array(data as Uint8Array)], { type: 'video/mp4' }));
ffmpeg.deleteFile(inName); ffmpeg.deleteFile(outName);
if (overlayFile) try { ffmpeg.deleteFile(overName); } catch {}

  } catch (err: unknown) {
    fail(String(err));
  }
});
