const fs = require('fs');
let content = fs.readFileSync('src/app/modules/audio/31-music-generator/music-generator.component.ts', 'utf8');

// The issue might be that FormsModule is not working properly for some reason with standalone component or similar. Let's make sure we update the prompt directly with an event binding as a fallback
content = content.replace(
    /\[ngModel\]="\(state\$ \| async\)\?\.prompt"\s*\(ngModelChange\)="onPromptChange\(\$event\)"/,
    '[ngModel]="(state$ | async)?.prompt" (input)="onPromptChange($any($event.target).value)"'
);

content = content.replace(
    /\[ngModel\]="\(state\$ \| async\)\?\.genre"\s*\(ngModelChange\)="onGenreChange\(\$event\)"/,
    '[ngModel]="(state$ | async)?.genre" (change)="onGenreChange($any($event.target).value)"'
);

content = content.replace(
    /\[ngModel\]="\(state\$ \| async\)\?\.duration"\s*\(ngModelChange\)="onDurationChange\(\$event\)"/,
    '[ngModel]="(state$ | async)?.duration" (input)="onDurationChange($any($event.target).valueAsNumber)"'
);

fs.writeFileSync('src/app/modules/audio/31-music-generator/music-generator.component.ts', content);
