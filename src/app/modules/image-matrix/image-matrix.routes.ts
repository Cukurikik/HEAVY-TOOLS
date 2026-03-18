import { Routes } from '@angular/router';

export const IMAGE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./image-matrix.component').then(m => m.ImageMatrixComponent),
    title: 'Image Matrix — Omni-Tool'
  },
  {
    path: 'ai-generator',
    loadComponent: () => import('./01-ai-generator/ai-generator.component').then(m => m.AiGeneratorComponent),
    title: 'AI Image Generator — Omni-Tool',
    data: { category: 'ai' }
  }
];
