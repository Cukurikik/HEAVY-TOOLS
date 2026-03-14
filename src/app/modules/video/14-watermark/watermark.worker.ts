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
const { file, text = '', position = 'bottom-right', opacity = 0.5, imageFile } = config;
const inName = 'in.mp4';
const outName = 'watermarked.mp4';
ffmpeg.writeFile(inName, await fetchFile(file));
const args = [];
if (imageFile) {
  const wmName = 'wm.png';
  ffmpeg.writeFile(wmName, await fetchFile(imageFile));
  let posStr = 'W-w-10:H-h-10';
  if (position === 'top-left') posStr = '10:10';
  else if (position === 'top-right') posStr = 'W-w-10:10';
  else if (position === 'bottom-left') posStr = '10:H-h-10';
  args = ['-i', inName, '-i', wmName, '-filter_complex', `[1:v]format=rgba,colorchannelmixer=aa=${opacity}[wm];[0:v][wm]overlay=${posStr}`, '-c:v', 'libx264', '-preset', 'ultrafast', '-c:a', 'copy', outName];
} else {
  const drawtext = `drawtext=text='${text}':fontcolor=white@${opacity}:fontsize=24:x=(w-tw)-10:y=(h-th)-10`;
  args = ['-i', inName, '-vf', drawtext, '-c:v', 'libx264', '-preset', 'ultrafast', '-c:a', 'copy', outName];
}
await ffmpeg.exec(args);
const data = await ffmpeg.readFile(outName);
done(new Blob([new Uint8Array(data as Uint8Array)], { type: 'video/mp4' }));
ffmpeg.deleteFile(inName); ffmpeg.deleteFile(outName);
if (imageFile) try { ffmpeg.deleteFile('wm.png'); } catch { /* ignore */ }

  } catch (err: unknown) {
    fail(String(err));
  }
});
