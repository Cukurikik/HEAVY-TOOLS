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
    const watermarkName = `wm_${Date.now()}.png`;
    const outputName = `out_${Date.now()}.mp4`;
    
    if (!config.inputFile || !config.watermarkFile) throw new Error('Input or Watermark file missing');

    const inputData = await fetchFile(config.inputFile);
    const watermarkData = await fetchFile(config.watermarkFile);
    
    await ffmpeg.writeFile(inputName, inputData);
    await ffmpeg.writeFile(watermarkName, watermarkData);

    let overlayFilter = '';
    switch (config.position) {
      case 'top-left': overlayFilter = '10:10'; break;
      case 'top-right': overlayFilter = 'main_w-overlay_w-10:10'; break;
      case 'bottom-left': overlayFilter = '10:main_h-overlay_h-10'; break;
      case 'bottom-right': overlayFilter = 'main_w-overlay_w-10:main_h-overlay_h-10'; break;
      case 'center': overlayFilter = '(main_w-overlay_w)/2:(main_h-overlay_h)/2'; break;
      default: overlayFilter = 'main_w-overlay_w-10:main_h-overlay_h-10';
    }

    // Apply opacity and overlay
    // [1:v]format=rgba,colorchannelmixer=aa=0.8[wm];[0:v][wm]overlay=...
    await ffmpeg.exec([
      '-i', inputName,
      '-i', watermarkName,
      '-filter_complex', `[1:v]format=rgba,colorchannelmixer=aa=${config.opacity}[wm];[0:v][wm]overlay=${overlayFilter}`,
      '-c:a', 'copy',
      outputName
    ]);

    const data = await ffmpeg.readFile(outputName);
    const blob = new Blob([data as Uint8Array], { type: 'video/mp4' });
    
    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(watermarkName);
    await ffmpeg.deleteFile(outputName);
    
    postMessage({ type: 'complete', data: blob });
  } catch (err: unknown) {
    postMessage({ type: 'error', errorCode: 'FFMPEG_COMMAND_FAILED', message: String(err) });
  }
});
