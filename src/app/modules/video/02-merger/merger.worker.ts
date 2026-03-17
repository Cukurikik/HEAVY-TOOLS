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
const { clips = [], outputFormat = 'mp4' } = config;

await Promise.all(clips.map(async (clip: { file?: string | File } | string | File, i: number) => {
  const name = 'clip' + i + '.mp4';
  const fileToFetch = typeof clip === 'object' && clip !== null && 'file' in clip && clip.file ? clip.file : clip;
  await ffmpeg!.writeFile(name, await fetchFile(fileToFetch as string | File));
}));

let listContent = '';
for (let i = 0; i < clips.length; i++) {
  const name = 'clip' + i + '.mp4';
  listContent += 'file ' + name + '\n';
}
await ffmpeg.writeFile('list.txt', listContent);
const outName = 'merged.' + outputFormat;
await ffmpeg.exec(['-f', 'concat', '-safe', '0', '-i', 'list.txt', '-c', 'copy', outName]);
const data = await ffmpeg.readFile(outName);
done(new Blob([new Uint8Array(data as Uint8Array)], { type: 'video/' + outputFormat }));
for (let i = 0; i < clips.length; i++) ffmpeg.deleteFile('clip' + i + '.mp4');
ffmpeg.deleteFile('list.txt'); ffmpeg.deleteFile(outName);

  } catch (err: unknown) {
    fail(String(err));
  }
});
