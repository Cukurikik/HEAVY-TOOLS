const fs = require('fs');
const path = require('path');

const featuresDir = path.join(process.cwd(), 'src/modules/settings-engine/features');

const categories = fs.readdirSync(featuresDir).filter(f => fs.statSync(path.join(featuresDir, f)).isDirectory());

categories.forEach(category => {
  const categoryDir = path.join(featuresDir, category);
  
  // Get all .ts files excluding index.ts
  const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');
  
  if (files.length > 0) {
    const exportsLine = files.map(file => {
      const name = file.replace('.ts', '');
      return `export * from './${name}';`;
    }).join('\n');
    
    fs.writeFileSync(path.join(categoryDir, 'index.ts'), exportsLine + '\n', 'utf-8');
    console.log(`Generated index.ts for ${category} with ${files.length} features.`);
  }
});

console.log('✅ All feature index files generated successfully.');
