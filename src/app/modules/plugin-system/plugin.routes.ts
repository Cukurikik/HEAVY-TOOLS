import { Routes } from '@angular/router';

export const PLUGIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/plugin-manager/plugin-manager.component')
        .then(m => m.PluginManagerComponent),
    title: 'Plugin Manager - Omni Tool'
  }
];
