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
const { file, outputFormat = 'mp3' } = config;
const inName = 'in.mp4';
const outName = 'out.' + outputFormat;
ffmpeg.writeFile(inName, await fetchFile(file));
let args: string[] = [];
if (outputFormat === 'mp3') args = ['-i', inName, '-vn', '-q:a', '0', '-map', 'a', outName];
else if (outputFormat === 'wav') args = ['-i', inName, '-vn', '-c:a', 'pcm_s16le', '-map', 'a', outName];
else args = ['-i', inName, '-vn', '-c:a', 'copy', '-map', 'a', outName];
await ffmpeg.exec(args);
const data = await ffmpeg.readFile(outName);
const mimeMap: Record<string, string> = { mp3: 'audio/mpeg', wav: 'audio/wav', aac: 'audio/aac' };
done(new Blob([new Uint8Array(data as Uint8Array)], { type: mimeMap[outputFormat] || 'audio/mpeg' }));
ffmpeg.deleteFile(inName); ffmpeg.deleteFile(outName);

  } catch (err: unknown) {
    fail(String(err));
  }
});
