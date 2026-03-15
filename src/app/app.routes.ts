import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell.component').then(m => m.ShellComponent),
    children: [
      { path: '',         loadComponent: () => import('./modules/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'video',    loadChildren: () => import('./modules/video/video.routes').then(m => m.VIDEO_ROUTES) },
      { path: 'audio',    loadChildren: () => import('./modules/audio/audio.routes').then(m => m.AUDIO_ROUTES) },
      { path: 'image',    loadComponent: () => import('./modules/image-matrix/image-matrix.component').then(m => m.ImageMatrixComponent) },
      { path: 'converter',loadChildren: () => import('./modules/converter/converter.routes').then(m => m.CONVERTER_ROUTES) },
      { path: 'pdf',      loadChildren: () => import('./modules/pdf/pdf.routes').then(m => m.PDF_ROUTES) },
      { path: 'settings', loadComponent: () => import('./modules/settings/settings.component').then(m => m.SettingsComponent) },
    ]
  },
  { path: '**', redirectTo: '' }
];
