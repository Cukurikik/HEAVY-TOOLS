import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const baseDir = 'src/app/modules/pdf';

function processDir(dir) {
  const files = readdirSync(dir);
  for (const file of files) {
    const fullPath = join(dir, file);
    if (statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (file.endsWith('.component.ts')) {
       let content = readFileSync(fullPath, 'utf8');
       let modified = false;

       // Aggressive replacement for [file]
       const oldContent1 = content;
       content = content.replace(/\[file\]="\s*\(\s*state\$\s*\|\s*async\s*\)\s*\?\.\s*inputFile\s*"/g, '[file]="(state$ | async)?.inputFile ?? null"');
       if (content !== oldContent1) modified = true;

       // Aggressive replacement for [outputBlob]
       const oldContent2 = content;
       content = content.replace(/\[outputBlob\]="\s*\(\s*state\$\s*\|\s*async\s*\)\s*\?\.\s*outputBlob\s*"/g, '[outputBlob]="(state$ | async)?.outputBlob ?? null"');
       if (content !== oldContent2) modified = true;

       // Aggressive replacement for [outputSizeMB]
       const oldContent3 = content;
       content = content.replace(/\[outputSizeMB\]="\s*\(\s*state\$\s*\|\s*async\s*\)\s*\?\.\s*outputSizeMB\s*"/g, '[outputSizeMB]="(state$ | async)?.outputSizeMB ?? null"');
       if (content !== oldContent3) modified = true;

       if (modified) {
          writeFileSync(fullPath, content, 'utf8');
          console.log('Fixed strict null check in:', file);
       }
    }
  }
}

console.log('Running aggressive strict null fix...');
processDir(baseDir);
console.log('Done.');
