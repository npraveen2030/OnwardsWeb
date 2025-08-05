import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Route } from '@angular/router';

import { provideClientHydration } from '@angular/platform-browser';
import { LoginComponent } from './shared/login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './shared/dashboard.component';
import { ReportComponent } from './report/report.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { SessionGuard } from './gaurds/session.gaurd';

const routes: Route[] = [
  { path: '', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [SessionGuard],
    canActivateChild: [SessionGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'reports', component: ReportComponent },
    ],
  },
  {
    path: 'calendar',
    loadComponent: () =>
      import('./shared/monthcalendar/monthcalendar.component').then(
        (m) => m.MonthcalendarComponent
      ),
  },
];

export const appConfig: ApplicationConfig = {
  providers: [
    // provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection(),
    provideHttpClient(withFetch()),
    provideRouter(routes),
  ],
};
