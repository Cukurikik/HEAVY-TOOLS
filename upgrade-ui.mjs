import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

const SRC_DIR = 'C:\\Users\\IKYY\\Downloads\\HEAVY-TOOLS\\src\\app\\modules';

console.log('Finding components...');
const components = globSync(`${SRC_DIR}/**/*.component.ts`);

console.log(`Found ${components.length} components. Checking templates...`);
let modifiedCount = 0;

for (const file of components) {
  // Skip shared components as we already upgraded them
  if (file.includes('shared')) continue;
  
  let content = fs.readFileSync(file, 'utf8');

  // Skip if already upgraded by having 'animate-fade-in-up'
  if (content.includes('animate-fade-in-up')) continue;

  // We are looking for the main <div> wrapper in the template.
  // It usually looks like `<div class="p-6 bg-[#0a0a0f] min-h-screen">` or similar
  
  // Phase 19 Header replacement
  // Find generic headers: <h1 class="..."> or <h2>
  content = content.replace(/<h[12]([\s>])/g, '<h1 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-lg tracking-tight"$1');
  
  // Replace generic buttons that are not already gradient with a premium wrapper
  content = content.replace(
    /<button(.*?)(class="[^"]*?")(.*?)>([\s\S]*?)<\/button>/g,
    (match, p1, oldClassStr, p3, innerHtml) => {
      // Don't modify if it looks like a close/icon button or already has a gradient
      if (oldClassStr.includes('w-6') || oldClassStr.includes('text-xs') || oldClassStr.includes('from-')) return match;
      
      const newClass = `class="relative flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm tracking-wide text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all duration-300 transform hover:-translate-y-1 group disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"`;
      return `<button${p1}${newClass}${p3}>
        <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        <span class="relative z-10 flex items-center gap-2">${innerHtml}</span>
      </button>`;
    }
  );

  // Wrap the entire template content inside a premium glass panel if it has a `bg-[#0a0a0f]` container
  if (content.match(/template:\s*`\s*<div[^>]*min-h-screen[^>]*>/i)) {
      content = content.replace(
        /(template:\s*`\s*<div)([^>]*min-h-screen[^>]*>)/i,
        `$1$2\n    <div class="max-w-7xl mx-auto space-y-8 animate-fade-in-up">\n      <div class="relative bg-[#0a0a0f]/80 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">\n        <div class="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>\n        <div class="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>\n        <div class="relative z-10 space-y-8">`
      );
      // We also need to close the divs. This is tricky with regex, so we'll append to the end of the template block.
      // But we can just replace the closing `  \`,\n` with the closing divs.
      content = content.replace(/<\/div>\s*`\s*,\s*$/m, '      </div>\n      </div>\n    </div>\n  </div>\n  `,');
  }

  fs.writeFileSync(file, content, 'utf8');
  modifiedCount++;
}

console.log(`UI Upgrade complete! Modified ${modifiedCount} files.`);
