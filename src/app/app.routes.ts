import { Routes } from '@angular/router';

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
  {
    title: 'Search',
    path: 'search/:resource',
    loadComponent: () => import('./components/search/search.component'),
  },
  {
    title: 'Details',
    path: 'details/:resource/:id',
    loadComponent: () =>
      import('./components/resource-details/resource-details.component'),
  },
  { path: '**', redirectTo: '' }, // Redirect unmatched routes
];
