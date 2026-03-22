import { Routes } from '@angular/router';
import { Home } from './home/home';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', component: Home },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile').then((m) => m.Profile),
    canActivate: [authGuard],
  },
  {
    path: 'payments',
    loadComponent: () => import('./payments/payments').then((m) => m.Payments),
    canActivate: [authGuard],
  },
];
