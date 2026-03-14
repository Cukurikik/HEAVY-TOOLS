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
const { file, _targetFormat = 'mp4', qualityPreset = 'balanced' } = config;
const inName = 'in.' + (file.name.split('.').pop() || 'mp4');
const outName = 'out.' + _targetFormat;
ffmpeg.writeFile(inName, await fetchFile(file));
let args: string[] = [];
const presetMap: Record<string, string> = { fast: 'ultrafast', balanced: 'medium', best: 'slow' };
const preset = presetMap[qualityPreset] || 'medium';
if (_targetFormat === 'gif') {
  await ffmpeg.exec(['-i', inName, '-vf', 'fps=10,scale=480:-1:flags=lanczos,palettegen', 'palette.png']);
  args = ['-i', inName, '-i', 'palette.png', '-filter_complex', 'fps=10,scale=480:-1:flags=lanczos[x];[x][1:v]paletteuse', outName];
} else if (_targetFormat === 'webm') {
  args = ['-i', inName, '-c:v', 'libvpx-vp9', '-crf', '30', '-b:v', '0', '-c:a', 'libopus', outName];
} else if (_targetFormat === 'mov') {
  args = ['-i', inName, '-c:v', 'libx264', '-preset', preset, '-c:a', 'aac', '-movflags', '+faststart', outName];
} else {
  args = ['-i', inName, '-c:v', 'libx264', '-preset', preset, '-crf', '23', '-c:a', 'aac', '-movflags', '+faststart', outName];
}
await ffmpeg.exec(args);
const data = await ffmpeg.readFile(outName);
const mimeMap: Record<string, string> = { mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime', avi: 'video/x-msvideo', mkv: 'video/x-matroska', gif: 'image/gif' };
done(new Blob([new Uint8Array(data as Uint8Array)], { type: mimeMap[_targetFormat] || 'video/mp4' }));
ffmpeg.deleteFile(inName); ffmpeg.deleteFile(outName);
if (_targetFormat === 'gif') { try { ffmpeg.deleteFile('palette.png'); } catch { /* ignore */ } }

  } catch (err: unknown) {
    fail(String(err));
  }
});
