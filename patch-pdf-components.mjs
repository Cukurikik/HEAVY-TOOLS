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

       // Fix [file]="(state$ | async)?.inputFile" => [file]="(state$ | async)?.inputFile ?? null"
       if (content.match(/\[file\]="\(\w+\$ \| async\)\?.*?inputFile"/)) {
          content = content.replace(/\[file\]="(\(\w+\$ \| async\)\?.*?inputFile)"/g, '[file]=" ?? null"');
          modified = true;
       }

       // Fix [outputBlob]
       if (content.match(/\[outputBlob\]="\(\w+\$ \| async\)\?\.outputBlob"/)) {
          content = content.replace(/\[outputBlob\]="(\(\w+\$ \| async\)\?\.outputBlob)"/g, '[outputBlob]=" ?? null"');
          modified = true;
       }

       // Fix [outputSizeMB]
       if (content.match(/\[outputSizeMB\]="\(\w+\$ \| async\)\?\.outputSizeMB"/)) {
          content = content.replace(/\[outputSizeMB\]="(\(\w+\$ \| async\)\?\.outputSizeMB)"/g, '[outputSizeMB]=" ?? null"');
          modified = true;
       }

       if (modified) {
          writeFileSync(fullPath, content, 'utf8');
          console.log('Fixed Component Types:', file);
       }
    } else if (file.endsWith('.store.ts')) {
       // Also fix bookmarkEditor which was missed because the script failed previously halfway.
       let content = readFileSync(fullPath, 'utf8');
       const stateMatch = content.match(/export interface (.*)State {/);
       if (stateMatch) {
         let modified = false;
         const stateName = stateMatch[1] + 'State';
         if (content.match(/export const select(.*)CanProcess = createSelector\(select(.*)State, s =>/)) {
            content = content.replace(
              /export const select(.*)CanProcess = createSelector\(select(.*)State, s =>/g,
              \export const select\ = createSelector(select\, (s: \) =>\
            );
            modified = true;
         }
         if (content.match(/export const select(.*)IsLoading = createSelector\(selectStatus, s =>/)) {
            content = content.replace(
              /export const select(.*)IsLoading = createSelector\(selectStatus, s =>/g,
              \export const select\ = createSelector(selectStatus, (s: string) =>\
            );
            modified = true;
         }
         
         if (modified) {
             writeFileSync(fullPath, content, 'utf8');
             console.log('Fixed Store Final:', file);
         }
       }
    }
  }
}

console.log('Running patch...');
processDir(baseDir);
console.log('Done.');
