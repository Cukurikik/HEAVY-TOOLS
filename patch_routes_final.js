const fs = require('fs');
let content = fs.readFileSync('src/app/modules/audio/audio.routes.ts', 'utf8');

// The Angular router cannot accept promises in provideState.
// We should import the providers in a separate route module, or provide them statically.
// Since these are lazy routes, we can just provide them on the route itself statically.

content = content.replace(
    /import \{ musicGeneratorFeature, MusicGeneratorEffects \} from '\.\/31-music-generator\/music-generator\.store';/,
    "import { musicGeneratorFeature, MusicGeneratorEffects } from './31-music-generator/music-generator.store';"
);

content = content.replace(
    /provideState\(import\('\.\/31-music-generator\/music-generator\.store'\)\.then\(m => m\.musicGeneratorFeature\)\),/,
    "provideState(musicGeneratorFeature),"
);

content = content.replace(
    /provideEffects\(import\('\.\/31-music-generator\/music-generator\.store'\)\.then\(m => m\.MusicGeneratorEffects\)\)/,
    "provideEffects(MusicGeneratorEffects)"
);


fs.writeFileSync('src/app/modules/audio/audio.routes.ts', content);
