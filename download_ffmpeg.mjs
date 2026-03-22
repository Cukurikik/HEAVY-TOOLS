import fs from 'fs';
import path from 'path';
import https from 'https';

const version = '0.12.6';
const files = [
  'ffmpeg-core.js',
  'ffmpeg-core.wasm',
  'ffmpeg-core.worker.js'
];
const outDir = path.join(process.cwd(), 'public', 'ffmpeg');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function download(filename) {
  const url = `https://unpkg.com/@ffmpeg/core-mt@${version}/dist/esm/${filename}`;
  const outPath = path.join(outDir, filename);
  console.log('Downloading', url, 'to', outPath);
  
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 302) {
        https.get(res.headers.location, (res2) => {
          const file = fs.createWriteStream(outPath);
          res2.pipe(file);
          file.on('finish', () => { file.close(); resolve(); });
        });
      } else {
        const file = fs.createWriteStream(outPath);
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
      }
    }).on('error', reject);
  });
}

async function run() {
  for (const f of files) await download(f);
  console.log('Done');
}

run();
