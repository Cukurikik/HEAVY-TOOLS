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
       
       const stateMatch = content.match(/export interface (.*)State {/);
       if (stateMatch) {
         const stateName = stateMatch[1] + 'State';
         content = content.replace(
           /export const select(.*)CanProcess = createSelector\(select(.*)State, s =>/g,
           `export const select$1CanProcess = createSelector(select$2State, (s: ${stateName}) =>`
         );
         content = content.replace(
           /export const select(.*)IsLoading = createSelector\(selectStatus, s =>/g,
           `export const select$1IsLoading = createSelector(selectStatus, (s: string) =>`
         );
       }
       
       writeFileSync(fullPath, content, 'utf8');
       console.log('Fixed Store:', file);
    } else if (file.endsWith('.worker.ts')) {
       let content = readFileSync(fullPath, 'utf8');
       
       content = content.replace(
           /new Blob\(\[modifiedBuffer\]/g, 
           `new Blob([modifiedBuffer as any]`
       );
       
       writeFileSync(fullPath, content, 'utf8');
       console.log('Fixed Worker:', file);
    }
  }
}

processDir(baseDir);
