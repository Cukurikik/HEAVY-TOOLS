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
    ffmpeg.on('progress', ({ progress: p }) => progress(Math.round(p * 100)));
    
    // Feature specific logic
const { file } = config;
const inName = 'in.mp4';
ffmpeg.writeFile(inName, await fetchFile(file));
let output = '';
ffmpeg.on('log', ({ message }) => { output += message + '\n'; });
try { await ffmpeg.exec(['-i', inName, '-f', 'null', '/dev/null']); } catch { /* ffprobe always throws */ }
const jsonBlob = new Blob([JSON.stringify({ log: output })], { type: 'application/json' });
done(jsonBlob);
ffmpeg.deleteFile(inName);

  } catch (err: unknown) {
    fail(String(err));
  }
});
