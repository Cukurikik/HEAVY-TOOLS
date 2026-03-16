const fs = require('fs');
let content = fs.readFileSync('src/app/modules/audio/31-music-generator/music-generator.component.ts', 'utf8');

// The trim check might fail if prompt is null/undefined
content = content.replace(
    /\[disabled\]="!\(state\$ \| async\)\?\.prompt\?\.trim\(\)"/,
    '[disabled]="!(state$ | async)?.prompt?.trim() || (state$ | async)?.status === \'processing\'"'
);

fs.writeFileSync('src/app/modules/audio/31-music-generator/music-generator.component.ts', content);
