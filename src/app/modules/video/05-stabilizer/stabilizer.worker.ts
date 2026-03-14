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
const { file, shakiness = 5, smoothing = 30 } = config;
const inName = 'in.mp4';
const outName = 'stabilized.mp4';
ffmpeg.writeFile(inName, await fetchFile(file));
progress(10);
await ffmpeg.exec(['-i', inName, '-vf', 'vidstabdetect=shakiness=' + shakiness + ':accuracy=15:result=transforms.trf', '-an', '-f', 'null', '/dev/null']);
progress(50);
await ffmpeg.exec(['-i', inName, '-vf', 'vidstabtransform=smoothing=' + smoothing + ':input=transforms.trf:interpol=black', '-c:a', 'copy', outName]);
const data = await ffmpeg.readFile(outName);
done(new Blob([new Uint8Array(data as Uint8Array)], { type: 'video/mp4' }));
ffmpeg.deleteFile(inName); ffmpeg.deleteFile(outName);
try { ffmpeg.deleteFile('transforms.trf'); } catch { /* ignore */ }

  } catch (err: unknown) {
    fail(String(err));
  }
});
