import fs from 'fs';
import path from 'path';

const rootDirs = ['src/app/modules/audio', 'src/app/modules/video', 'src/app/modules/converter', 'src/app/modules/pdf'];

function walk(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      walk(filepath, callback);
    } else {
      callback(filepath);
    }
  }
}

for (const rootDir of rootDirs) {
  walk(rootDir, (filepath) => {
    if (filepath.endsWith('.ts')) {
      let content = fs.readFileSync(filepath, 'utf8');
      let changed = false;

      // 1. Fix broken imports: { ..., , } or { , ..., }
      if (content.match(/\{\s*,/) || content.match(/,\s*\}/) || content.match(/,\s*,/)) {
        content = content.replace(/\{\s*,/g, '{');
        content = content.replace(/,\s*\}/g, ' }');
        content = content.replace(/,\s*,/g, ',');
        changed = true;
      }

      // 2. Fix broken state property: outputFormat:; or targetFormat:;
      if (content.match(/(outputFormat|targetFormat):;/)) {
        content = content.replace(/(outputFormat|targetFormat):;/g, '$1: ExportFormat;');
        changed = true;
      }

      // 3. Fix broken parameter in loadModel: , : string
      if (content.includes(', : string')) {
        content = content.replace(/,\s+:\s+string/g, ', modelName: string');
        changed = true;
      }

      // 4. Fix unused vars with eslint-disable-next-line
      // We'll target the specific ones reported by lint


      // 5. Remove unused ExportFormat imports
      // If ExportFormat is imported but not used in the rest of the file
      if (content.includes('ExportFormat') && !content.match(/\bexport type ExportFormat\b/) && !content.match(/\bexport const ExportFormat\b/)) {
        // Check if it's used in the body (excluding imports)
        const lines = content.split('\n');
        const bodyLines = lines.filter(l => !l.trim().startsWith('import '));
        const bodyText = bodyLines.join('\n');
        
        // Use word boundary to avoid matching ExportFormatSchema
        const exportFormatRegex = /\bExportFormat\b/g;
        if (!exportFormatRegex.test(bodyText)) {
          // It's unused. Remove from imports.
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('import ') && lines[i].includes('ExportFormat')) {
              // Handle both "import type { ExportFormat }" and "import { ExportFormat }"
              let newLine = lines[i];
              // Remove ExportFormat but keep ExportFormatSchema if present
              newLine = newLine.replace(/\bExportFormat\b\s*,\s*/, '');
              newLine = newLine.replace(/,\s*ExportFormat\b/, '');
              newLine = newLine.replace(/\{\s*ExportFormat\s*\}/, '{ }');
              
              if (newLine !== lines[i]) {
                lines[i] = newLine;
                changed = true;
              }
              
              // If the import is now empty, remove the whole line
              if (lines[i].match(/import\s+(type\s+)?\{\s*\}\s+from/)) {
                lines.splice(i, 1);
                i--;
                changed = true;
              }
            }
          }
          content = lines.join('\n');
        }
      }


      if (changed) {
        fs.writeFileSync(filepath, content);
        console.log(`Fixed ${filepath}`);
      }
    }
  });
}
