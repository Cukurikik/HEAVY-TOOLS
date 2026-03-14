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
const { file, title = '', artist = '', album = '', year = '' } = config;
const originalExt = file.name.split('.').pop() || 'mp4';
const inName = 'in.' + originalExt;
const outName = 'out.' + originalExt;
ffmpeg.writeFile(inName, await fetchFile(file));
const args = ['-i', inName];
if (title) args.push('-metadata', `title=${title}`);
if (artist) args.push('-metadata', `artist=${artist}`);
if (album) args.push('-metadata', `album=${album}`);
if (year) args.push('-metadata', `year=${year}`);
args.push('-c', 'copy', outName);
await ffmpeg.exec(args);
const data = await ffmpeg.readFile(outName);
done(new Blob([new Uint8Array(data as Uint8Array)], { type: 'video/' + originalExt }));
ffmpeg.deleteFile(inName); ffmpeg.deleteFile(outName);

  } catch (err: unknown) {
    fail(String(err));
  }
});
