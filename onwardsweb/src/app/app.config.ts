import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Route } from '@angular/router';
 
import { provideClientHydration } from '@angular/platform-browser';
import { LoginComponent } from './login/login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportComponent } from './report/report.component';
import { provideHttpClient } from '@angular/common/http';

const routes: Route[] = [
  { path: '', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'reports', component: ReportComponent }
    ]
  }
];

export const appConfig: ApplicationConfig = {
  providers: [
      // provideBrowserGlobalErrorListeners(),
      provideZoneChangeDetection(),
      provideHttpClient(),
      provideRouter(routes)
  ]
};
