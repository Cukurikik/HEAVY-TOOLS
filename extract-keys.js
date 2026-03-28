const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\IKYY\\Downloads\\HEAVY-TOOLS\\src\\modules\\converter-engine\\components\\tools';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
    const p = path.join(dir, file);
    const content = fs.readFileSync(p, 'utf8');
    const matches = [...content.matchAll(/setOptions\(\{\s*(\w+)\s*:/g)];
    if (matches.length > 0) {
        const keys = matches.map(m => m[1]);
        console.log(`${file}: ${[...new Set(keys)].join(', ')}`);
    } else {
        console.log(`${file}: NO SET_OPTIONS FOUND`);
    }
}
