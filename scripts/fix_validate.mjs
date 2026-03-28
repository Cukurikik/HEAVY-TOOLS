import fs from 'fs/promises';
import path from 'path';

const FEATURES_DIR = path.join(process.cwd(), 'src/modules/settings-engine/features');

async function main() {
  const dirs = await fs.readdir(FEATURES_DIR, { withFileTypes: true });
  let count = 0;
  
  for (const dirent of dirs) {
    if (dirent.isDirectory()) {
      const catPath = path.join(FEATURES_DIR, dirent.name);
      const files = await fs.readdir(catPath);
      
      for (const file of files) {
        if (!file.endsWith('.ts')) continue;
        const filepath = path.join(catPath, file);
        let content = await fs.readFile(filepath, 'utf-8');
        
        // Fix the generic validation rejector that crashes non-string configurations
        if (content.includes("typeof value === 'string' || typeof value === 'boolean'")) {
           content = content.replace(
             /return typeof value === 'string' \|\| typeof value === 'boolean';/g,
             "return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched"
           );
           await fs.writeFile(filepath, content, 'utf-8');
           count++;
        }
      }
    }
  }
  console.log(`✅ Patched ${count} Settings features to accept Number/Array validations.`);
}

main().catch(console.error);
