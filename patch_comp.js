const fs = require('fs');
let content = fs.readFileSync('src/app/modules/audio/31-music-generator/music-generator.component.ts', 'utf8');

// fix labels
content = content.replace(
    /<label class="text-sm text-white\/70 font-medium">Prompt<\/label>/,
    '<label class="text-sm text-white/70 font-medium" for="prompt-input">Prompt</label>'
);
content = content.replace(
    /<textarea/,
    '<textarea id="prompt-input"'
);

content = content.replace(
    /<label class="text-sm text-white\/70 font-medium">Genre<\/label>/,
    '<label class="text-sm text-white/70 font-medium" for="genre-select">Genre</label>'
);
content = content.replace(
    /<select/,
    '<select id="genre-select"'
);

content = content.replace(
    /<label class="text-sm text-white\/70 font-medium">Duration \(seconds\)<\/label>/,
    '<label class="text-sm text-white/70 font-medium" for="duration-input">Duration (seconds)</label>'
);
content = content.replace(
    /<input type="range"/,
    '<input type="range" id="duration-input"'
);

fs.writeFileSync('src/app/modules/audio/31-music-generator/music-generator.component.ts', content);
