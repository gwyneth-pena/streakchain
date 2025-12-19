import { Routes } from '@angular/router';
import { unauthGuard } from './shared/guards/unauth-guard';

export const routes: Routes = [
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup').then((m) => m.Signup),
    canActivate: [unauthGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
    canActivate: [unauthGuard],
  },
];
