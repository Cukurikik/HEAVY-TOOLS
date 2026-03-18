/**
 * fix-unsubscribe-bug.mjs
 * Fixes the immediate .unsubscribe() bug in all component files.
 * Pattern: }).unsubscribe(); → replaces with just });
 * This bug causes the observable processing pipeline to be killed immediately
 * after subscribing, so no processing ever completes.
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
    // Fix the pattern: }).unsubscribe(); → });
    // This is the bug where subscribe() is called and immediately unsubscribed
    if (content.includes('}).unsubscribe();')) {
      const count = (content.match(/\}\)\.unsubscribe\(\);/g) || []).length;
      content = content.replace(/\}\)\.unsubscribe\(\);/g, '});');
      writeFileSync(file, content);
      console.log(`FIXED: ${file} (${count} occurrences)`);
      totalFixed += count;
    }
  }
}

console.log(`\nTotal fixes: ${totalFixed} files patched`);
