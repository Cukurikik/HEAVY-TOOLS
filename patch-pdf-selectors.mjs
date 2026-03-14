import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const baseDir = 'src/app/modules/pdf';

function processDir(dir) {
  const files = readdirSync(dir);
  for (const file of files) {
    const fullPath = join(dir, file);
    if (statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (file.endsWith('.store.ts')) {
       let content = readFileSync(fullPath, 'utf8');
       let modified = false;

       // 1. Find the Exact Feature Name used in export const { ... } = featureName;
       const featureMatch = content.match(/= ([a-zA-Z0-9]+Feature);/);
       if (!featureMatch) continue;
       
       // 2. Find the raw selector exports which currently say export const { selectSomethingState, selectStatus... 
       // We force the generated name: select[ModuleName]PdfState
       const exportMatch = content.match(/export const \{ select([a-zA-Z0-9]+)State, selectStatus/);
       if (exportMatch) {
          const originalBase = exportMatch[1];
          // Replace it with the Pdf postfix
          content = content.replace(
              new RegExp(`export const \\{ select${originalBase}State, selectStatus`), 
              `export const { select${originalBase}PdfState, selectStatus`
          );
          
          content = content.replace(
              new RegExp(`createSelector\\(select${originalBase}State, \\(s:`), 
              `createSelector(select${originalBase}PdfState, (s:`
          );
          modified = true;
       }

       if (modified) {
          writeFileSync(fullPath, content, 'utf8');
          console.log('Fixed Store Selectors:', file);
       }
       
    } else if (file.endsWith('.component.ts')) {
       let content = readFileSync(fullPath, 'utf8');
       let modified = false;

       // Find the selector import
       const importMatch = content.match(/select([a-zA-Z0-9]+)State,/);
       if (importMatch) {
          const baseName = importMatch[1];
          content = content.replace(
              new RegExp(`select${baseName}State,`, 'g'),
              `select${baseName}PdfState,`
          );
          
          content = content.replace(
              new RegExp(`this.store.select\\(select${baseName}State\\);`, 'g'),
              `this.store.select(select${baseName}PdfState);`
          );
          modified = true;
       }

       // Ensure async outputs are safely null-coalesced
       for (const prop of ['inputFile', 'outputBlob', 'outputSizeMB', 'progress']) {
           const re = new RegExp(`\\[${prop}\\]="\\(state\\$ \\| async\\)\\?\\.${prop}"`, 'g');
           if (re.test(content)) {
               content = content.replace(re, `[${prop}]="(state$ | async)?.${prop} ?? null"`);
               modified = true;
           }
       }

       if (modified) {
          writeFileSync(fullPath, content, 'utf8');
          console.log('Fixed Component Selectors:', file);
       }
    }
  }
}

console.log('Running universal patch...');
processDir(baseDir);
console.log('Done.');
