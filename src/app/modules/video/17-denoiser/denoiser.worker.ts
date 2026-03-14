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
const { file, strength = 'medium' } = config;
const inName = 'in.mp4';
const outName = 'denoised.mp4';
ffmpeg.writeFile(inName, await fetchFile(file));
const strengthMap: Record<string, string> = { light: '1.5:1.5:6:6', medium: '4:4:6:6', heavy: '10:10:10:10' };
const hqdn = strengthMap[strength] || '4:4:6:6';
const vf = `hqdn3d=${hqdn}`;
await ffmpeg.exec(['-i', inName, '-vf', vf, '-c:v', 'libx264', '-preset', 'ultrafast', '-c:a', 'copy', outName]);
const data = await ffmpeg.readFile(outName);
done(new Blob([data as unknown as BlobPart], { type: 'video/mp4' }));
ffmpeg.deleteFile(inName); ffmpeg.deleteFile(outName);

  } catch (err: unknown) {
    fail(String(err));
  }
});
