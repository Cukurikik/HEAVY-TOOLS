import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const baseDir = 'src/app/modules/pdf';

function processDir(dir) {
  const files = readdirSync(dir);
  for (const file of files) {
    const fullPath = join(dir, file);
    if (statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (file.endsWith('.ts')) {
       let content = readFileSync(fullPath, 'utf8');
       let modified = false;

       if (content.includes('PdfPdfState')) {
           content = content.replace(/PdfPdfState/g, 'PdfState');
           modified = true;
       }

       if (modified) {
          writeFileSync(fullPath, content, 'utf8');
          console.log('Fixed double Pdf suffix in:', file);
       }
    }
  }
}

console.log('Running suffix cleanup...');
processDir(baseDir);
console.log('Done.');
