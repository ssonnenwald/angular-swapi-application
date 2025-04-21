import { Routes } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { ResourceDetailsComponent } from './components/resource-details/resource-details.component';

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
  {
    title: 'Details',
    path: 'details/:resource/:id',
    component: ResourceDetailsComponent,
  },
  { path: '**', redirectTo: '' }, // Redirect unmatched routes
];
