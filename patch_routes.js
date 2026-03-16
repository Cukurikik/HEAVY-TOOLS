const fs = require('fs');
let content = fs.readFileSync('src/app/modules/audio/audio.routes.ts', 'utf8');

content = content.replace(
    /\{ path: 'music-generator', loadComponent: \(\) => import\('\.\/31-music-generator\/music-generator\.component'\)\.then\(m => m\.MusicGeneratorComponent\), title: 'Music AI Generator — Omni-Tool', data: \{ category: 'ai' \} \},/,
    `{
      path: 'music-generator',
      loadComponent: () => import('./31-music-generator/music-generator.component').then(m => m.MusicGeneratorComponent),
      providers: [
        provideState(import('./31-music-generator/music-generator.store').then(m => m.musicGeneratorFeature)),
        provideEffects(import('./31-music-generator/music-generator.store').then(m => m.MusicGeneratorEffects))
      ],
      title: 'Music AI Generator — Omni-Tool',
      data: { category: 'ai' }
    },`
);

fs.writeFileSync('src/app/modules/audio/audio.routes.ts', content);
