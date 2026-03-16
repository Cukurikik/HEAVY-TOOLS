const fs = require('fs');
let content = fs.readFileSync('src/app/modules/audio/audio.routes.ts', 'utf8');

// The providers syntax might not like dynamic imports in provideState for feature.
// Let's import them statically at the top of the routes file just for this feature.
content = content.replace(
    /import \{ provideEffects \} from '@ngrx\/effects';/,
    `import { provideEffects } from '@ngrx/effects';
import { musicGeneratorFeature, MusicGeneratorEffects } from './31-music-generator/music-generator.store';`
);

content = content.replace(
    /providers: \[\n        provideState\(import\('\.\/31-music-generator\/music-generator\.store'\)\.then\(m => m\.musicGeneratorFeature\)\),\n        provideEffects\(import\('\.\/31-music-generator\/music-generator\.store'\)\.then\(m => m\.MusicGeneratorEffects\)\)\n      \],/,
    `providers: [
        provideState(musicGeneratorFeature),
        provideEffects(MusicGeneratorEffects)
      ],`
);

fs.writeFileSync('src/app/modules/audio/audio.routes.ts', content);
