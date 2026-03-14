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
    wasmURL: await toBlobURL(base + '/ffmpeg-core.wasm', 'application/wasm') });
}

function progress(v: number) { postMessage({ type: 'progress', value: v }); }
function done(blob: Blob) { postMessage({ type: 'complete', data: blob }); }
function fail(msg: string) { postMessage({ type: 'error', errorCode: 'FFMPEG_COMMAND_FAILED', message: msg }); }

addEventListener('message', async (e: MessageEvent) => {
  const { config } = e.data;
  try {
    await loadFFmpeg();
    if (!ffmpeg) throw new Error('FFmpeg not loaded');
    ffmpeg.on('progress', ({ progress: p }: { progress: number }) => progress(Math.round(p * 100)));
    
    // Feature specific logic
const { file, interval = 5, mode = 'single' } = config;
const inName = 'in.mp4';
ffmpeg.writeFile(inName, await fetchFile(file));
if (mode === 'grid') {
  const outName = 'grid.png';
  await ffmpeg.exec(['-i', inName, '-vf', `fps=1/${interval},scale=240:-1,tile=4x4`, '-frames:v', '1', outName]);
  const data = await ffmpeg.readFile(outName);
  done(new Blob([new Uint8Array(data as Uint8Array)], { type: 'image/png' }));
  ffmpeg.deleteFile(outName);
} else {
  const outName = 'thumb.png';
  await ffmpeg.exec(['-ss', String(interval), '-i', inName, '-vframes', '1', '-q:v', '2', outName]);
  const data = await ffmpeg.readFile(outName);
  done(new Blob([new Uint8Array(data as Uint8Array)], { type: 'image/png' }));
  ffmpeg.deleteFile(outName);
}
ffmpeg.deleteFile(inName);

  } catch (err: unknown) {
    fail(String(err));
  }
});
