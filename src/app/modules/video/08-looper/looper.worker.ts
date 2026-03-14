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
const { file, loopCount = 3 } = config;
const inName = 'in.mp4';
ffmpeg.writeFile(inName, await fetchFile(file));
let listContent = '';
for (let i = 0; i < loopCount; i++) listContent += 'file ' + inName + '\n';
ffmpeg.writeFile('list.txt', listContent);
await ffmpeg.exec(['-f', 'concat', '-safe', '0', '-i', 'list.txt', '-c', 'copy', 'looped.mp4']);
const data = await ffmpeg.readFile('looped.mp4');
done(new Blob([new Uint8Array(data as Uint8Array)], { type: 'video/mp4' }));
ffmpeg.deleteFile(inName); ffmpeg.deleteFile('list.txt'); ffmpeg.deleteFile('looped.mp4');

  } catch (err: unknown) {
    fail(String(err));
  }
});
