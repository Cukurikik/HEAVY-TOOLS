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
const { file, fps = 10, scale = 480 } = config;
const inName = 'in.' + (file.name.split('.').pop() || 'mp4');
const outName = 'out.gif';
ffmpeg.writeFile(inName, await fetchFile(file));
await ffmpeg.exec(['-i', inName, '-vf', `fps=${fps},scale=${scale}:-1:flags=lanczos,palettegen`, 'palette.png']);
await ffmpeg.exec(['-i', inName, '-i', 'palette.png', '-filter_complex', `fps=${fps},scale=${scale}:-1:flags=lanczos[x];[x][1:v]paletteuse`, outName]);
const data = await ffmpeg.readFile(outName);
done(new Blob([new Uint8Array(data as Uint8Array)], { type: 'image/gif' }));
ffmpeg.deleteFile(inName); ffmpeg.deleteFile(outName); ffmpeg.deleteFile('palette.png');

  } catch (err: unknown) {
    fail(String(err));
  }
});
