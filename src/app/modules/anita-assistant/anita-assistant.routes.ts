import { Routes } from '@angular/router';

export const ANITA_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/chat/chat.component').then(m => m.ChatComponent),
    title: 'A.N.I.T.A - AI Assistant'
  }
];
