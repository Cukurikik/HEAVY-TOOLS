import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const baseDir = 'src/app/modules/converter';

function processDir(dir) {
  const files = readdirSync(dir);
  for (const file of files) {
    const fullPath = join(dir, file);
    if (statSync(fullPath).isDirectory()) {
      if (file !== 'shared') {
        processDir(fullPath);
      }
    } else if (file.endsWith('.component.ts')) {
      let content = readFileSync(fullPath, 'utf8');
      let modified = false;

      const hasFileDropZone = content.includes('<app-converter-file-drop-zone');
      const hasExportPanel = content.includes('<app-converter-export-panel');

      if (!hasFileDropZone && content.includes('ConverterFileDropZoneComponent')) {
        content = content.replace(/,\s*ConverterFileDropZoneComponent/g, '');
        content = content.replace(/import \{ ConverterFileDropZoneComponent \} from '\.\.\/shared\/components\/file-drop-zone\/file-drop-zone\.component';\r?\n/, '');
        modified = true;
      }

      if (!hasExportPanel && content.includes('ConverterExportPanelComponent')) {
        content = content.replace(/,\s*ConverterExportPanelComponent/g, '');
        content = content.replace(/import \{ ConverterExportPanelComponent \} from '\.\.\/shared\/components\/export-panel\/export-panel\.component';\r?\n/, '');
        modified = true;
      }

      if (modified) {
        writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed unused imports in:', file);
      }
    }
  }
}

processDir(baseDir);
