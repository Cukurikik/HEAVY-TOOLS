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
const { file, audioFile, mixMode = 'replace' } = config;
const inName = 'in.mp4';
const audioName = 'in.mp3';
const outName = 'replaced.mp4';
ffmpeg.writeFile(inName, await fetchFile(file));
if (audioFile) ffmpeg.writeFile(audioName, await fetchFile(audioFile));
const args = [];
if (!audioFile) {
  args = ['-i', inName, '-an', '-c:v', 'copy', outName];
} else if (mixMode === 'mix') {
  args = ['-i', inName, '-i', audioName, '-filter_complex', '[0:a][1:a]amerge=inputs=2[a]', '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', outName];
} else {
  args = ['-i', inName, '-i', audioName, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-shortest', outName];
}
await ffmpeg.exec(args);
const data = await ffmpeg.readFile(outName);
done(new Blob([new Uint8Array(data as Uint8Array)], { type: 'video/mp4' }));
ffmpeg.deleteFile(inName); ffmpeg.deleteFile(outName);
if (audioFile) try { ffmpeg.deleteFile(audioName); } catch {}

  } catch (err: unknown) {
    fail(String(err));
  }
});
