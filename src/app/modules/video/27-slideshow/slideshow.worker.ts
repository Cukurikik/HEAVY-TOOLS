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
const { images = [], durationPerImage = 3 } = config;
const outName = 'slideshow.mp4';
if (images.length === 0) throw new Error('No images specified');
let listContent = '';
for (let i = 0; i < images.length; i++) {
  const name = `img${i}.jpg`;
  ffmpeg.writeFile(name, await fetchFile(images[i].file || images[i]));
  listContent += `file '${name}'\nduration ${durationPerImage}\n`;
}
listContent += `file 'img${images.length-1}.jpg'\n`;
ffmpeg.writeFile('list.txt', listContent);
await ffmpeg.exec(['-f', 'concat', '-safe', '0', '-i', 'list.txt', '-vf', 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,format=yuv420p', '-c:v', 'libx264', '-preset', 'ultrafast', '-r', '30', outName]);
const data = await ffmpeg.readFile(outName);
done(new Blob([data as unknown as BlobPart], { type: 'video/mp4' }));
for (let i = 0; i < images.length; i++) ffmpeg.deleteFile(`img${i}.jpg`);
ffmpeg.deleteFile('list.txt'); ffmpeg.deleteFile(outName);

  } catch (err: unknown) {
    fail(String(err));
  }
});
