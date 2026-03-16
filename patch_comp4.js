const fs = require('fs');
let content = fs.readFileSync('src/app/modules/audio/31-music-generator/music-generator.component.ts', 'utf8');

// The component might need FormsModule imported properly, wait, it IS imported
// Maybe let's just use (keyup)
content = content.replace(
    /\[ngModel\]="\(state\$ \| async\)\?\.prompt"\s*\(input\)="onPromptChange\(\$any\(\$event\.target\)\.value\)"/,
    '[ngModel]="(state$ | async)?.prompt" (keyup)="onPromptChange($any($event.target).value)" (change)="onPromptChange($any($event.target).value)"'
);

fs.writeFileSync('src/app/modules/audio/31-music-generator/music-generator.component.ts', content);
