/**
 * fix-infinite-loop.mjs
 * Adds .pipe(take(1)) to this.state$.subscribe() calls and imports `take` from rxjs.
 * This fixes the critical bug where progress updates trigger an infinite loop of workers.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { readdirSync, statSync } from 'fs';

function walk(dir) {
  const results = [];
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...walk(full));
    } else if (full.endsWith('.component.ts')) {
      results.push(full);
    }
  }
  return results;
}

const dirs = [
  'src/app/modules/video',
  'src/app/modules/pdf',
];

let totalFixed = 0;

for (const dir of dirs) {
  const files = walk(dir);
  for (const file of files) {
    let content = readFileSync(file, 'utf8');
    
    // Check if it has the bug
    if (content.includes('this.state$.subscribe(')) {
      
      // Make sure take is imported
      if (!content.includes(`import { take }`)) {
        if (content.includes(`from 'rxjs';`)) {
          content = content.replace(/from 'rxjs';/, `, take } from 'rxjs';`);
          content = content.replace(/import { , take }/, `import { take `); // cleanup if it was just import {}
        } else {
          // Add import at the top after other imports
          content = `import { take } from 'rxjs';\n` + content;
        }
      }
      
      const count = (content.match(/this\.state\$\.subscribe\s*\(/g) || []).length;
      content = content.replace(/this\.state\$\.subscribe\s*\(/g, 'this.state$.pipe(take(1)).subscribe(');
      
      writeFileSync(file, content);
      console.log(`FIXED: ${file} (${count} occurrences)`);
      totalFixed += count;
    }
  }
}

console.log(`\nTotal infinite loops fixed: \${totalFixed}`);
