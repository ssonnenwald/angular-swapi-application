import { Route, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    title: 'Home',
    path: 'home',
    loadComponent: () => import('./components/home/home.component'),
  },
  { path: '**', redirectTo: '' }, // Redirect unmatched routes
];
