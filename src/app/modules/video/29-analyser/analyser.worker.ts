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
    ffmpeg.on('progress', ({ progress: p }) => progress(Math.round(p * 100)));
    
    // Feature specific logic
    // Feature specific logic
    const { file } = config;
    const inName = 'in.mp4';
    await ffmpeg.writeFile(inName, await fetchFile(file));
    let output = '';
    ffmpeg.on('log', ({ message }) => { output += message + '\n'; });
    try { await ffmpeg.exec(['-i', inName, '-f', 'null', '/dev/null']); } catch { /* ffprobe always throws */ }
    
    // Regex Metadata Engine
    interface FFprobeData {
      duration?: string;
      totalBitrate?: string;
      video?: { codec?: string; pixelFormat?: string; resolution?: string; bitrate?: string; fps?: string; };
      audio?: { codec?: string; sampleRate?: string; channels?: string; bitrate?: string; };
      rawLog?: string;
    }
    const metadata: FFprobeData = { rawLog: output };
    
    // Extract Duration & Total Bitrate
    const durMatch = output.match(/Duration:\s*([\d:]+\.\d+)(?:.*?bitrate:\s*(\d+)\s*kb\/s)?/);
    if (durMatch) {
      metadata.duration = durMatch[1];
      if (durMatch[2]) metadata.totalBitrate = durMatch[2] + ' kbps';
    }

    // Extract Video Stream Attributes
    const vMatch = output.match(/Stream #\d+:\d+(?:.*?):\s*Video:\s*(.*?),\s*(.*?),\s*(\d+x\d+)(?:.*?,\s*(\d+)\s*kb\/s)?(?:.*?,\s*([\d.]+)\s*fps)?/);
    if (vMatch) {
      metadata.video = {
        codec: vMatch[1].trim(),
        pixelFormat: vMatch[2].trim(),
        resolution: vMatch[3].trim(),
        bitrate: vMatch[4] ? vMatch[4] + ' kbps' : undefined,
        fps: vMatch[5] ? vMatch[5] + ' fps' : undefined
      };
    }

    // Extract Audio Stream Attributes
    const aMatch = output.match(/Stream #\d+:\d+(?:.*?):\s*Audio:\s*(.*?),\s*(\d+)\s*Hz,\s*(.*?),\s*(?:.*?,\s*)?(\d+)\s*kb\/s/);
    if (aMatch) {
      metadata.audio = {
        codec: aMatch[1].trim(),
        sampleRate: aMatch[2] + ' Hz',
        channels: aMatch[3].trim(),
        bitrate: aMatch[4] ? aMatch[4] + ' kbps' : undefined
      };
    }

    const jsonBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
    done(jsonBlob);
    ffmpeg.deleteFile(inName);
  } catch (err: unknown) {
    fail(String(err));
  }
});
