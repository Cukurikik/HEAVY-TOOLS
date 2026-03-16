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
    wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, 'application/wasm') });
}

addEventListener('message', async (e: MessageEvent) => {
  const { config } = e.data;
  try {
    await loadFFmpeg();
    if (!ffmpeg) throw new Error('FFmpeg not loaded');
    
    ffmpeg.on('progress', ({ progress }: { progress: number }) => {
      postMessage({ type: 'progress', value: Math.round(progress * 100) });
    });

    const videoName = `vid_${Date.now()}.mp4`;
    const subName = `sub_${Date.now()}.srt`;
    const outputName = `out_${Date.now()}.mp4`;
    
    if (!config.videoFile || !config.subtitleFile) throw new Error('Missing files');

    const videoData = await fetchFile(config.videoFile);
    const subData = await fetchFile(config.subtitleFile);
    
    await ffmpeg.writeFile(videoName, videoData);
    await ffmpeg.writeFile(subName, subData);

    // Burn subtitles
    await ffmpeg.exec([
      '-i', videoName,
      '-vf', `subtitles=${subName}`,
      '-c:a', 'copy',
      outputName
    ]);

    const data = await ffmpeg.readFile(outputName);
    const blob = new Blob([data as unknown as BlobPart], { type: 'video/mp4' });
    
    await ffmpeg.deleteFile(videoName);
    await ffmpeg.deleteFile(subName);
    await ffmpeg.deleteFile(outputName);
    
    postMessage({ type: 'complete', data: blob });
  } catch (err: unknown) {
    postMessage({ type: 'error', errorCode: 'FFMPEG_COMMAND_FAILED', message: String(err) });
  }
});
