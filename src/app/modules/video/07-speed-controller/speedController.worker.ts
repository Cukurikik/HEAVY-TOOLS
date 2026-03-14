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
const { file, speed = 1.0, audioMode = 'pitchCorrect' } = config;
const inName = 'in.mp4';
const outName = 'speed.mp4';
ffmpeg.writeFile(inName, await fetchFile(file));
const pts = 1 / speed;
const vf = 'setpts=' + pts.toFixed(4) + '*PTS';
let args = ['-i', inName, '-vf', vf];
if (audioMode === 'mute') args.push('-an');
else {
  let r = speed;
  const atempos = [];
  while (r > 2.0) { atempos.push('atempo=2.0'); r /= 2; }
  while (r < 0.5) { atempos.push('atempo=0.5'); r /= 0.5; }
  atempos.push('atempo=' + r.toFixed(4));
  args.push('-af', atempos.join(','));
}
args.push('-c:v', 'libx264', '-preset', 'ultrafast', outName);
await ffmpeg.exec(args);
const data = await ffmpeg.readFile(outName);
done(new Blob([data as unknown as BlobPart], { type: 'video/mp4' }));
ffmpeg.deleteFile(inName); ffmpeg.deleteFile(outName);

  } catch (err: unknown) {
    fail(String(err));
  }
});
