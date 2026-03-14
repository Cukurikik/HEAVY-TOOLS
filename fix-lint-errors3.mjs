import fs from 'fs';
import path from 'path';

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    const dirent = fs.statSync(dirFile);
    if (dirent.isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      filelist.push(dirFile);
    }
  }
  return filelist;
};

const files = walkSync('./src/app/modules');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Fix unused imports in audio components
  if (file.includes('audio') && file.endsWith('.component.ts')) {
    content = content.replace(/import\s*\{\s*signal\s*\}\s*from\s*'@angular\/core';\n?/, '');
    content = content.replace(/import\s*\{\s*[A-Za-z]+State\s*\}\s*from\s*'\.\/[A-Za-z-]+\.store';\n?/, '');
    content = content.replace(/import\s*\{\s*ExportFormat\s*\}\s*from\s*'\.\.\/shared\/types\/audio\.types';\n?/, '');
    changed = true;
  }

  // Fix unused config in services
  if (file.endsWith('.service.ts')) {
    content = content.replace(/import\s*\{\s*[A-Za-z]+Config\s*\}\s*from\s*'\.\/[A-Za-z-]+\.store';\n?/, '');
    changed = true;
  }

  // Fix Unexpected any in video workers
  if (file.includes('video') && file.endsWith('.worker.ts')) {
    content = content.replace(/bridge\.process<any,/g, 'bridge.process<unknown,');
    changed = true;
  }

  // Fix empty blocks
  if (content.includes('catch (e) { }')) {
    content = content.replace(/catch \(e\) \{ \}/g, 'catch (e) { /* ignore */ }');
    changed = true;
  }
  if (content.includes('catch (e) {}')) {
    content = content.replace(/catch \(e\) \{\}/g, 'catch (e) { /* ignore */ }');
    changed = true;
  }

  // Fix component selector kebab-case in pdf
  if (file.includes('pdf') && file.endsWith('.component.ts')) {
    content = content.replace(/selector:\s*'app-([A-Za-z0-9]+)'/g, (match, p1) => {
      const kebab = p1.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
      return `selector: 'app-${kebab}'`;
    });
    changed = true;
  }

  // Fix pdf-drop-zone.component.ts
  if (file.endsWith('pdf-drop-zone.component.ts')) {
    content = content.replace(/const file = \(e\.target as any\)\.files\[0\];/g, 'const file = (e.target as HTMLInputElement).files?.[0];');
    changed = true;
  }

  // Fix opfs.service.ts
  if (file.endsWith('opfs.service.ts')) {
    content = content.replace(/async deleteFile\(path: string\): Promise<void> \{\}/g, 'async deleteFile(path: string): Promise<void> { /* not implemented */ }');
    changed = true;
  }

  // Fix unused variables in video workers
  if (file.includes('video') && file.endsWith('.worker.ts')) {
    content = content.replace(/const numParts =[^;]+;/g, '');
    content = content.replace(/const task =[^;]+;/g, '');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
  }
}
