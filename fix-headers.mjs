import fs from 'fs';
import { globSync } from 'glob';

const SRC_DIR = 'C:\\Users\\IKYY\\Downloads\\HEAVY-TOOLS\\src\\app\\modules';
const components = globSync(`${SRC_DIR}/**/*.component.ts`);

let fixedCount = 0;

for (const file of components) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Fix 1: Mismatched <h2> closing tags for our injected gradient <h1>
  if (content.includes('text-3xl font-black text-transparent bg-clip-text') && content.includes('</h2>')) {
    // We just replace all </h2> that might be mismatched.
    // To be safe, let's just replace </h2> with </h1> IF the file has our modified h1.
    // Actually, a better way is to replace the injected h1 back to h2 if it was an h2.
    // But since we lost that info, let's just change all </h2> to </h1> in the template block
    const templateMatch = content.match(/template:\s*`([\s\S]*?)`/);
    if (templateMatch) {
       let template = templateMatch[1];
       template = template.replace(/<\/h2>/g, '</h1>');
       
       // Fix 2: Duplicate class attributes: <h1 class="..." class="..."> -> <h1 class="... ">
       template = template.replace(/<h1 class="([^"]+)" class="([^"]+)"/g, '<h1 class="$1 $2"');
       
       content = content.replace(templateMatch[1], template);
       changed = true;
    }
  }

  // Also fix `<section>` closing tag issues reported in the logs?
  // "Unexpected closing tag 'section'"
  // Why did it complain about </section>?
  // Oh, because the <h2> was never opened! It was <h1 ...> ... </h2>, so </h2> was an unexpected closing tag. Then when it hit </section>, it thought section was already closed? Or maybe h1 wasn't closed?
  // Yes: <h1 ...> ... </h2> </section>. The </h1> was missing, so <section> couldn't be closed!
  // Replacing </h2> with </h1> will fix both <h2> and <section> errors!

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    fixedCount++;
  }
}

console.log(`Fixed mismatched tags in ${fixedCount} files.`);
