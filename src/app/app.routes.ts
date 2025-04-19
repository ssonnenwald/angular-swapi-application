import { Route, Routes } from '@angular/router';
import { SearchComponent } from './components/search/search.component';

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
  { title: 'Search', path: 'search/:resource', component: SearchComponent },
  { path: '**', redirectTo: '' }, // Redirect unmatched routes
];
