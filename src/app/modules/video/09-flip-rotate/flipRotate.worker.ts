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
const { file, flipH = false, flipV = false, rotation = 0 } = config;
const inName = 'in.mp4';
const outName = 'flipped.mp4';
ffmpeg.writeFile(inName, await fetchFile(file));
const filters = [];
if (flipH) filters.push('hflip');
if (flipV) filters.push('vflip');
if (rotation === 90) filters.push('transpose=1');
else if (rotation === 180) filters.push('transpose=1,transpose=1');
else if (rotation === 270) filters.push('transpose=2');
else if (rotation !== 0) filters.push('rotate=' + rotation + '*PI/180');
let args = ['-i', inName];
if (filters.length > 0) {
  args.push('-vf', filters.join(','));
  args.push('-c:v', 'libx264', '-preset', 'ultrafast', '-c:a', 'copy');
} else {
  args.push('-c', 'copy');
}
args.push(outName);
await ffmpeg.exec(args);
const data = await ffmpeg.readFile(outName);
done(new Blob([new Uint8Array(data as Uint8Array)], { type: 'video/mp4' }));
ffmpeg.deleteFile(inName); ffmpeg.deleteFile(outName);

  } catch (err: unknown) {
    fail(String(err));
  }
});
