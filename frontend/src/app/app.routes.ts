import { Routes } from '@angular/router';
import { unAuthGuard } from './shared/guards/unauth.guard';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./shared/components/login/login.component').then(m => m.LoginComponent),
        canActivate: [unAuthGuard]
    },
    {
        path: 'register',
        loadComponent: () => import('./shared/components/register/register.component').then(m => m.RegisterComponent),
        canActivate: [unAuthGuard]
    },
    {
        path: 'network',
        loadComponent: () => import('./shared/components/network-table/network-table.component').then(m => m.NetworkTableComponent),
        canActivate: [authGuard]
    },
    {
        path: 'companies',
        loadComponent: () => import('./shared/components/companies-table/companies-table.component').then(m => m.CompaniesTableComponent),
        canActivate: [authGuard]
    },
    {
        path: 'companies-signals',
        loadComponent: () => import('./shared/components/companies-table-signals/companies-table-signals.component').then(m => m.CompaniesTableSignalsComponent),
        canActivate: [authGuard]
    },
    {
        path: 'jobs',
        loadComponent: () => import('./shared/components/jobs-table/jobs-table.component').then(m => m.JobsTableComponent),
        canActivate: [authGuard]
    },
    {
        path: 'profile/:userId',
        loadComponent: () => import('./shared/components/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [authGuard]
    },
    {
        path: 'settings',
        loadComponent: () => import('./shared/components/settings/settings.component').then(m => m.SettingsComponent),
        canActivate: [authGuard]
    },
    {
        path: '',
        redirectTo: 'network',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'network'
    }
];
