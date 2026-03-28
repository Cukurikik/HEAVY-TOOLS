const fs = require('fs');
const files = [
  'C:\\Users\\IKYY\\.gemini\\antigravity\\brain\\66423e15-e3e7-4e81-bda9-d5c6875a794d\\task.md',
  'C:\\Users\\IKYY\\.gemini\\antigravity\\brain\\66423e15-e3e7-4e81-bda9-d5c6875a794d\\implementation_plan.md',
  'c:\\Users\\IKYY\\Downloads\\HEAVY-TOOLS\\AUDIO_API_DOCS.md'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Ensure one blank line right below headings if the exact next line has text
    content = content.replace(/^(#+ .+)\n([^\n])/gm, '$1\n\n$2');
    fs.writeFileSync(file, content);
  }
}
console.log('Markdown Headings and Lists padded correctly!');
