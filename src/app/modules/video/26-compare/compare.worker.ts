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
const { file, referenceFile, layout = 'hstack' } = config;
const inName = 'in1.mp4';
const refName = 'in2.mp4';
const outName = 'compare.mp4';
ffmpeg.writeFile(inName, await fetchFile(file));
if (referenceFile) ffmpeg.writeFile(refName, await fetchFile(referenceFile));
if (referenceFile) {
  const filter = `[0:v]scale=-1:720,pad=ceil(iw/2)*2:ceil(ih/2)*2[v0];[1:v]scale=-1:720,pad=ceil(iw/2)*2:ceil(ih/2)*2[v1];[v0][v1]${layout}=inputs=2[v]`;
  await ffmpeg.exec(['-i', inName, '-i', refName, '-filter_complex', filter, '-map', '[v]', '-c:v', 'libx264', '-preset', 'ultrafast', '-an', outName]);
} else {
  await ffmpeg.exec(['-i', inName, '-c', 'copy', outName]);
}
const data = await ffmpeg.readFile(outName);
done(new Blob([data as unknown as BlobPart], { type: 'video/mp4' }));
ffmpeg.deleteFile(inName); ffmpeg.deleteFile(outName);
if (referenceFile) try { ffmpeg.deleteFile(refName); } catch {}

  } catch (err: unknown) {
    fail(String(err));
  }
});
