import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent),
    title: 'TROJAN CONSTRUCTION HOLDING | Civil & Structural Engineering'
  },
  {
    path: 'supervisor-portal',
    loadComponent: () => import('./pages/supervisor/supervisor').then((m) => m.SupervisorComponent),
    title: 'Supervisor HSE Inspection Portal | TROJAN CONSTRUCTION HOLDING'
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact').then((m) => m.ContactComponent),
    title: 'Contact Us | TROJAN CONSTRUCTION HOLDING'
  },
  {
    path: '**',
    redirectTo: ''
  }
];

