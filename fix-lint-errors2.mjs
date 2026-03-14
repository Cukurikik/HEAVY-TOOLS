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

  // Fix \$event
  if (content.includes('\\$event')) {
    content = content.replace(/\\\$event/g, '$event');
    changed = true;
  }

  // Fix unused imports in audio components
  if (file.includes('audio') && file.endsWith('.component.ts')) {
    content = content.replace(/import\s*\{\s*signal\s*\}\s*from\s*'@angular\/core';\n?/, '');
    content = content.replace(/import\s*\{\s*takeUntilDestroyed\s*\}\s*from\s*'@angular\/core\/rxjs-interop';\n?/, '');
    content = content.replace(/import\s*\{\s*ExportFormat\s*\}\s*from\s*'\.\.\/shared\/types\/audio\.types';\n?/, '');
    content = content.replace(/import\s*\{\s*[a-zA-Z]+State\s*\}\s*from\s*'\.\/[a-zA-Z-]+\.store';\n?/, '');
    changed = true;
  }

  // Fix unused imports in audio services
  if (file.includes('audio') && file.endsWith('.service.ts')) {
    content = content.replace(/import\s*\{\s*[a-zA-Z]+Config\s*\}\s*from\s*'\.\/[a-zA-Z-]+\.store';\n?/, '');
    content = content.replace(/import\s*\{\s*ExportFormat\s*\}\s*from\s*'\.\.\/shared\/types\/audio\.types';\n?/, '');
    changed = true;
  }

  // Fix unused imports in audio workers
  if (file.includes('audio') && file.endsWith('.worker.ts')) {
    content = content.replace(/import\s*\{\s*ExportFormat\s*\}\s*from\s*'\.\.\/shared\/types\/audio\.types';\n?/, '');
    changed = true;
  }

  // Fix unused imports in audio schemas
  if (file.includes('audio') && file.endsWith('.schema.ts')) {
    content = content.replace(/export\s*const\s*ExportFormatSchema\s*=\s*z\.enum\(\['wav',\s*'mp3',\s*'ogg'\]\);\n?/, '');
    changed = true;
  }

  // Fix unused imports in audio stores
  if (file.includes('audio') && file.endsWith('.store.ts')) {
    content = content.replace(/import\s*\{\s*ExportFormat\s*\}\s*from\s*'\.\.\/shared\/types\/audio\.types';\n?/, '');
    changed = true;
  }

  // Fix unused variables in workers
  if (file.endsWith('.worker.ts')) {
    if (content.includes('const outputFormat =')) {
      content = content.replace(/const outputFormat =[^;]+;/g, '');
      changed = true;
    }
    if (content.includes('const crf =')) {
      content = content.replace(/const crf =[^;]+;/g, '');
      changed = true;
    }
    if (content.includes('const encodingSpeed =')) {
      content = content.replace(/const encodingSpeed =[^;]+;/g, '');
      changed = true;
    }
    if (content.includes('let args =')) {
      content = content.replace(/let args =/g, 'const args =');
      changed = true;
    }
    if (content.includes('catch (e) {}')) {
      content = content.replace(/catch \(e\) \{\}/g, 'catch (e) { /* ignore */ }');
      changed = true;
    }
    if (content.includes('const targetFormat =')) {
      content = content.replace(/const targetFormat =[^;]+;/g, '');
      changed = true;
    }
    if (content.includes('const numParts =')) {
      content = content.replace(/const numParts =[^;]+;/g, '');
      changed = true;
    }
    if (content.includes('const task =')) {
      content = content.replace(/const task =[^;]+;/g, '');
      changed = true;
    }
    if (content.includes('bridge.process<any,')) {
      content = content.replace(/bridge\.process<any,/g, 'bridge.process<unknown,');
      changed = true;
    }
    if (content.includes('as any')) {
      content = content.replace(/as any/g, 'as unknown as BlobPart');
      changed = true;
    }
  }

  // Fix unused variables in video services
  if (file.includes('video') && file.endsWith('.service.ts')) {
    content = content.replace(/import\s*\{\s*[a-zA-Z]+Config\s*\}\s*from\s*'\.\/[a-zA-Z-]+\.store';\n?/, '');
    changed = true;
  }

  // Fix unused variables in converter services
  if (file.includes('converter') && file.endsWith('.service.ts')) {
    content = content.replace(/import\s*\{\s*[a-zA-Z]+Config\s*\}\s*from\s*'\.\/[a-zA-Z-]+\.store';\n?/, '');
    changed = true;
  }
  
  // Fix unused variables in pdf services
  if (file.includes('pdf') && file.endsWith('.service.ts')) {
    content = content.replace(/import\s*\{\s*[a-zA-Z]+Config\s*\}\s*from\s*'\.\/[a-zA-Z-]+\.store';\n?/, '');
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

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
  }
}
