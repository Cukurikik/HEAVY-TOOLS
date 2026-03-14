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
    const subtitleName = `subs_${Date.now()}.srt`;
    const outputName = `out_${Date.now()}.mp4`;
    
    if (!config.inputFile || !config.subtitleFile) throw new Error('Input or Subtitle file missing');

    const inputData = await fetchFile(config.inputFile);
    const subtitleData = await fetchFile(config.subtitleFile);
    
    await ffmpeg.writeFile(inputName, inputData);
    await ffmpeg.writeFile(subtitleName, subtitleData);

    // Hardburn subtitles
    // Note: FFmpeg subtitles filter might require specific font configuration or path handling in WASM
    // We'll try the standard filter first.
    await ffmpeg.exec([
      '-i', inputName,
      '-vf', `subtitles=${subtitleName}`,
      '-c:a', 'copy',
      outputName
    ]);

    const data = await ffmpeg.readFile(outputName);
    const blob = new Blob([data as unknown as BlobPart], { type: 'video/mp4' });
    
    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(subtitleName);
    await ffmpeg.deleteFile(outputName);
    
    postMessage({ type: 'complete', data: blob });
  } catch (err: unknown) {
    postMessage({ type: 'error', errorCode: 'FFMPEG_COMMAND_FAILED', message: String(err) });
  }
});
