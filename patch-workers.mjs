// Fix: Cast FFmpeg FileData to proper ArrayBuffer before using in Blob constructor
// Patches all 30 worker files replacing:
//   const blob = new Blob([data], { ... })
// With:
//   const blob = new Blob([data instanceof Uint8Array ? data.buffer : data], { ... })
// But a simpler fix: cast with `data as unknown as BlobPart`

import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const base = 'src/app/modules/video';

// Get all feature dirs (01-trimmer through 30-upscaler)
const dirs = readdirSync(base, { withFileTypes: true })
  .filter(d => d.isDirectory() && /^\d{2}-/.test(d.name))
  .map(d => join(base, d.name));

let patched = 0;

for (const dir of dirs) {
  const workerFiles = readdirSync(dir).filter(f => f.endsWith('.worker.ts'));
  for (const workerFile of workerFiles) {
    const path = join(dir, workerFile);
    let content = readFileSync(path, 'utf8');
    
    // Fix 1: Cast `data` to BlobPart to fix Uint8Array<SharedArrayBuffer> issue
    const oldBlob = `const blob = new Blob([data], { type: \`video/\${ext}\` });`;
    const newBlob = `const blob = new Blob([data as unknown as BlobPart], { type: \`video/\${ext}\` });`;
    
    if (content.includes(oldBlob)) {
      content = content.replace(new RegExp(oldBlob.replace(/[.*+?^${}()|[\]\\`]/g, '\\$&'), 'g'), newBlob);
      writeFileSync(path, content, 'utf8');
      patched++;
      console.log('PATCHED:', path);
    } else {
      // Try alternative pattern for files with different ext variable
      const alt1 = 'const blob = new Blob([data], { type: `video/${ext}` });';
      const alt2 = 'const blob = new Blob([data as unknown as BlobPart], { type: `video/${ext}` });';
      if (content.includes(alt1)) {
        content = content.replace(alt1, alt2);
        writeFileSync(path, content, 'utf8');
        patched++;
        console.log('PATCHED (alt):', path);
      } else {
        console.log('SKIP (no match):', path);
      }
    }
  }
}

console.log(`\nPatched ${patched} worker files.`);
