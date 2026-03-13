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

    const ext = config.outputFormat ?? 'mp3';
    const inputName = `in_${Date.now()}.mp4`;
    const outputName = `out_${Date.now()}.${ext}`;
    const inputFile = config.file ?? config.inputFile;
    if (!inputFile) throw new Error('No input file');

    const inputData = await fetchFile(inputFile);
    ffmpeg.writeFile(inputName, inputData);

    // -vn -c:a libmp3lame -b:a 192k output.mp3
    await ffmpeg.exec(['-i', inputName, '-c:v', 'libx264', '-preset', 'ultrafast', outputName]);

    const data = await ffmpeg.readFile(outputName);
    const blob = new Blob([data as unknown as BlobPart], { type: `video/${ext}` });
    ffmpeg.deleteFile(inputName);
    ffmpeg.deleteFile(outputName);
    postMessage({ type: 'complete', data: blob });
  } catch (err: unknown) {
    postMessage({ type: 'error', errorCode: 'FFMPEG_COMMAND_FAILED', message: String(err) });
  }
});
