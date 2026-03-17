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
      
      // audio/04-converter/converter.worker.ts
      if (filepath.endsWith('audio/04-converter/converter.worker.ts')) {
        if (content.includes('_targetFormat') && !content.includes('eslint-disable')) {
          content = content.replace(/const\s*\{\s*inputData\s*,\s*_targetFormat\s*\}\s*=\s*_event\.data\.config;/, 'const { inputData } = _event.data.config;');
          changed = true;
        }
      }

      // audio/15-analyser/analyser.worker.ts and audio/28-transcriber/transcriber.worker.ts
      if (filepath.endsWith('audio/15-analyser/analyser.worker.ts') || filepath.endsWith('audio/28-transcriber/transcriber.worker.ts')) {
        if (content.includes('(_event: MessageEvent)') && !content.includes('eslint-disable')) {
          content = content.replace(/addEventListener\('message', \(_event: MessageEvent\) => \{/, 'addEventListener(\'message\', () => {');
          changed = true;
        }
      }

      // audio/shared/engine/onnx-audio.service.ts
      if (filepath.endsWith('audio/shared/engine/onnx-audio.service.ts')) {
        if (content.includes('_modelName: string') && !content.includes('eslint-disable')) {
          content = content.replace(/async loadModel\(modelUrl: string, _modelName: string\)/, 'async loadModel(modelUrl: string)');
          changed = true;
        }
      }

      // converter/shared/engine/libreoffice.service.ts
      if (filepath.endsWith('converter/shared/engine/libreoffice.service.ts')) {
        if (content.includes('_file: File') && !content.includes('eslint-disable')) {
          content = content.replace(/async convert\(_file: File, _targetFormat: string\)/, 'async convert()');
          changed = true;
        }
      }

      // pdf/shared/engine/opfs.service.ts
      if (filepath.endsWith('pdf/shared/engine/opfs.service.ts')) {
        if (content.includes('_path: string') && !content.includes('eslint-disable')) {
          content = content.replace(/async exists\(_path: string\)/, 'async exists()');
          changed = true;
        }
      }

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

      // 6. Fix specific opfs.service.ts issues
      if (filepath.endsWith('pdf/shared/engine/opfs.service.ts')) {
        if (content.includes('_path: string') && !content.includes('eslint-disable')) {
          content = content.replace(/async getFile\(_path: string\)/, 'async getFile()');
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(filepath, content);
        console.log(`Fixed ${filepath}`);
      }
    }
  });
}
