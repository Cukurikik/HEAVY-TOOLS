/// <reference lib="webworker" />
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

async function loadFFmpeg() {
  if (ffmpeg) return;
  ffmpeg = new FFmpeg();
  const base = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
  await ffmpeg.load({
    coreURL: await toBlobURL(`${base}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, 'application/wasm'),
  });
}

addEventListener('message', async (e: MessageEvent) => {
  const { config } = e.data;
  try {
    await loadFFmpeg();
    if (!ffmpeg) throw new Error('FFmpeg not loaded');
    
    ffmpeg.on('progress', ({ progress }: { progress: number }) => {
      postMessage({ type: 'progress', value: Math.round(progress * 100) });
    });

    const inputName = `in_${Date.now()}.mp4`;
    const outputName = `out_${Date.now()}.${config.format}`;
    const inputFile = config.inputFile;
    
    if (!inputFile) throw new Error('No input file');

    const inputData = await fetchFile(inputFile);
    await ffmpeg.writeFile(inputName, inputData);

    // -vn removes video, extracting audio
    await ffmpeg.exec([
      '-i', inputName,
      '-vn',
      '-acodec', config.format === 'mp3' ? 'libmp3lame' : (config.format === 'wav' ? 'pcm_s16le' : 'aac'),
      outputName
    ]);

    const data = await ffmpeg.readFile(outputName);
    const mimeType = config.format === 'mp3' ? 'audio/mpeg' : (config.format === 'wav' ? 'audio/wav' : 'audio/aac');
    const blob = new Blob([data as Uint8Array], { type: mimeType });
    
    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(outputName);
    
    postMessage({ type: 'complete', data: blob });
  } catch (err: unknown) {
    postMessage({ type: 'error', errorCode: 'FFMPEG_COMMAND_FAILED', message: String(err) });
  }
});
