const fs = require('fs');
let content = fs.readFileSync('src/app/modules/audio/31-music-generator/music-generator.worker.ts', 'utf8');

content = content.replace(
    /const blob = new Blob\(\[wavData\], \{ type: 'audio\/wav' \}\);/,
    `const blob = new Blob([wavData.buffer as ArrayBuffer], { type: 'audio/wav' });`
);

fs.writeFileSync('src/app/modules/audio/31-music-generator/music-generator.worker.ts', content);
