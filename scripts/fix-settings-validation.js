const fs = require('fs/promises');
const path = require('path');

const FEATURES_DIR = path.join(process.cwd(), 'src/modules/settings-engine/features');

async function fixValidation(filePath) {
  let content = await fs.readFile(filePath, 'utf-8');
  
  // Extract inputType
  const inputTypeMatch = content.match(/inputType:\s*'([^']+)'/);
  if (!inputTypeMatch) return;
  const inputType = inputTypeMatch[1];
  
  let newValidate = '';
  if (inputType === 'slider') {
    newValidate = `  validate: async (value) => {
    return typeof value === 'number' || typeof value === 'boolean';
  }`;
  } else if (inputType === 'color' || inputType === 'dropdown' || inputType === 'text') {
    newValidate = `  validate: async (value) => {
    return typeof value === 'string' || typeof value === 'boolean';
  }`;
  } else {
    newValidate = `  validate: async (value) => {
    return typeof value === 'boolean';
  }`;
  }

  // Find the exact validate block
  const validateRegex = /validate:\s*async\s*\([^)]*\)\s*=>\s*\{[\s\S]*?\},/;
  
  if (validateRegex.test(content)) {
    content = content.replace(validateRegex, newValidate + ',');
    await fs.writeFile(filePath, content, 'utf-8');
    console.log(`Updated validation in: ${path.basename(filePath)} (type: ${inputType})`);
  }
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath);
    } else if (fullPath.endsWith('.ts') && !fullPath.includes('registry.ts') && !fullPath.includes('index.ts')) {
      await fixValidation(fullPath);
    }
  }
}

walk(FEATURES_DIR)
  .then(() => console.log('All validations updated successfully!'))
  .catch(console.error);
