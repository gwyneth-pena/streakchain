import { Routes } from '@angular/router';
import { unauthGuard } from './shared/guards/unauth-guard';
import { authGuard } from './shared/guards/auth-guard';

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
  {
    path: 'forgot-password-request',
    loadComponent: () =>
      import('./pages/reset-password-request/reset-password-request').then(
        (m) => m.ResetPasswordRequest
      ),
    canActivate: [unauthGuard],
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./pages/reset-password/reset-password').then((m) => m.ResetPassword),
    canActivate: [unauthGuard],
  },
  {
    path: 'habit-tracker',
    loadComponent: () => import('./pages/habit-tracker/habit-tracker').then((m) => m.HabitTracker),
    canActivate: [authGuard],
  },
];
