import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
  fs.readdirSync(dir).forEach( f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

const root = './src/app/modules';

walk(root, (file) => {
  if (file.endsWith('.ts')) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // 1. Handle unused ExportFormat imports
    content = content.replace(/import\s*type\s*\{\s*ExportFormat\s*\}\s*from\s*['"][^'"]+['"];?\n?/g, '');
    content = content.replace(/import\s*\{\s*ExportFormat\s*\}\s*from\s*['"][^'"]+['"];?\n?/g, '');
    
    // 2. Resolve unused config in services
    content = content.replace(/config:\s*Record<string,\s*unknown>/g, '_config: Record<string, unknown>');
    content = content.replace(/,\s*config:\s*Record<string,\s*unknown>/g, ', _config: Record<string, unknown>');

    // 3. Resolve unused variables in workers
    content = content.replace(/const\s*targetFormat\s*=\s*[^;]+;/g, '');
    content = content.replace(/const\s*event\s*=\s*[^;]+;/g, '');
    content = content.replace(/const\s*\{\s*file,\s*numParts\s*=\s*2\s*\}\s*=\s*config;/g, 'const { file } = config;');
    content = content.replace(/const\s*\{\s*file,\s*task\s*\}\s*=\s*config;/g, 'const { file } = config;');
    content = content.replace(/const\s*\{\s*file,\s*outputFormat,\s*crf,\s*encodingSpeed\s*\}\s*=\s*event\.data;/g, 'const { file, outputFormat } = event.data;');

    // 4. Resolve any types
    content = content.replace(/\(\{ progress: p \}: any\)/g, '({ progress: p }: { progress: number })');
    content = content.replace(/onFileSelected\(e: any\)/g, 'onFileSelected(e: Event)');
    
    // 5. Resolve empty catch blocks
    content = content.replace(/catch\s*\{\s*\}/g, 'catch { /* ignore */ }');
    content = content.replace(/catch\s*\(err\)\s*\{\s*\}/g, 'catch (err) { /* ignore */ }');

    // 6. Resolve unused params in shared services
    content = content.replace(/async\s*deleteFile\(path:\s*string\)/g, 'async deleteFile(_path: string)');
    content = content.replace(/async\s*readFile\(path:\s*string\)/g, 'async readFile(_path: string)');
    content = content.replace(/_buffer:\s*ArrayBuffer/g, '_unusedBuffer: ArrayBuffer');
    content = content.replace(/_targetFormat:\s*string/g, '_unusedTargetFormat: string');
    content = content.replace(/_options:\s*string\[\]\s*=\s*\[\]/g, '_unusedOptions: string[] = []');

    // 7. Resolve PDF selectors (camelCase to kebab-case)
    if (file.includes('/pdf/')) {
      content = content.replace(/selector:\s*'app-pdf-([a-zA-Z0-9]+)'/g, (match, p1) => {
        const kebab = p1.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
        return `selector: 'app-pdf-${kebab}'`;
      });
    }

    // 8. Resolve unused ExportFormatSchema
    content = content.replace(/export\s*const\s*ExportFormatSchema\s*=\s*z\.enum\(\['wav',\s*'mp3',\s*'ogg'\]\);?\n?/g, '');

    if (content !== original) {
      fs.writeFileSync(file, content);
      console.log(`Fixed: ${file}`);
    }
  }
});
