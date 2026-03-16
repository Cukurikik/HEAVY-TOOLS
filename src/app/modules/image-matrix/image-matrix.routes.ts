import { Routes } from '@angular/router';

export const IMAGE_ROUTES: Routes = [
  { 
    path: 'ai-generator', 
    loadComponent: () => import('./01-ai-generator/ai-generator.component').then(m => m.AiImageGeneratorComponent) 
  }
];
