import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell.component').then(m => m.ShellComponent),
    children: [
      { path: '',          loadComponent: () => import('./modules/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      {
        path: 'video',
        children: [
          { path: '', loadComponent: () => import('./modules/video-engine/video-engine.component').then(m => m.VideoEngineComponent) },
          { path: '', loadChildren: () => import('./modules/video/video.routes').then(m => m.VIDEO_ROUTES) }
        ]
      },
      { path: 'audio',     loadComponent: () => import('./modules/audio-studio/audio-studio.component').then(m => m.AudioStudioComponent) },
      { path: 'image',     loadComponent: () => import('./modules/image-matrix/image-matrix.component').then(m => m.ImageMatrixComponent) },
      { path: 'converter', loadComponent: () => import('./modules/converter/converter.component').then(m => m.ConverterComponent) },
      { path: 'settings',  loadComponent: () => import('./modules/settings/settings.component').then(m => m.SettingsComponent) },
    ]
  },
  { path: '**', redirectTo: '' }
];
