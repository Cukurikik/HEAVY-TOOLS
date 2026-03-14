import { readFileSync, writeFileSync } from 'fs';

let content = readFileSync('src/app/app.routes.ts', 'utf8');

const routeStr = \
      {
        path: 'pdf',
        children: [
          { path: '', loadChildren: () => import('./modules/pdf/pdf.routes').then(m => m.PDF_ROUTES) }
        ]
      },\;

if (!content.includes('path: \\'pdf\\'')) {
   content = content.replace(/(path: 'audio',\\s+children: \\[.*?\\]\\s+},)/s, \\\\);
   writeFileSync('src/app/app.routes.ts', content, 'utf8');
   console.log('app.routes.ts updated');
} else {
   console.log('already updated');
}
