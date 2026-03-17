import fs from 'fs';
import path from 'path';

const files = [
  'src/app/modules/video/video.routes.ts',
  'src/app/modules/audio/audio.routes.ts',
  'src/app/modules/pdf/pdf.routes.ts',
  'src/app/modules/converter/converter.routes.ts'
];

for (const file of files) {
  const fullPath = path.resolve(file);
  let content = fs.readFileSync(fullPath, 'utf-8');
  
  const regex = /provideState\(\s*import\(['"]([^'"]+)['"]\)\.then\(\s*\w+\s*=>\s*\w+\.(\w+)\s*\)\s*\)/g;
  
  const imports = [];
  let newContent = content.replace(regex, (match, importPath, feature) => {
    imports.push(`import { ${feature} } from '${importPath}';`);
    return `provideState(${feature})`;
  });

  const uniqueImports = [...new Set(imports)].join('\n');
  
  // Find the last import
  const lastImportIndex = newContent.lastIndexOf('import ');
  if (lastImportIndex !== -1) {
    const endOfLastImport = newContent.indexOf('\n', lastImportIndex) + 1;
    newContent = newContent.slice(0, endOfLastImport) + uniqueImports + '\n' + newContent.slice(endOfLastImport);
  } else {
    newContent = uniqueImports + '\n\n' + newContent;
  }
  
  fs.writeFileSync(fullPath, newContent, 'utf-8');
  console.log('Fixed ' + file);
}
