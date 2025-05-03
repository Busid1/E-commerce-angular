import { Routes } from '@angular/router';

export default [
  {
    path: 'search',
    loadComponent: () => import('./search.component').then(m => m.default),
  },  
] as Routes;
