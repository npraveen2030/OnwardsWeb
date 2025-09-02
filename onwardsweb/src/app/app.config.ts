import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Route, withComponentInputBinding } from '@angular/router';

import { provideClientHydration } from '@angular/platform-browser';
import { LoginComponent } from './shared/login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './shared/dashboard.component';
import { ReportComponent } from './report/report.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { SessionGuard } from './gaurds/session.gaurd';
//import { LeaveManagementComponent } from './shared/leavemanagement/leavemanagement.component';
import { ResignationComponent } from './myworkspace/resignation/resignation.component';
import { WorkspaceComponent } from './myworkspace/workspace.component';
import { LeavemanagementComponent } from './shared/leavemanagement/leavemanagement.component';
import { ExitInterviewComponent } from './myworkspace/exit-interview/exit-interview.component';
import { MyApprovalComponent } from './myworkspace/my-approval/my-approval.component';
import { PersonalInformationComponent } from './myworkspace/personal-information/personal-information.component';

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
      { path: 'leavemanagement', component: LeavemanagementComponent },
      { path: 'resignation', component: ResignationComponent },
      { path: 'myworkspace', component: WorkspaceComponent },
      { path: 'my-approvals', component: MyApprovalComponent },
      { path: 'exit-interview', component: ExitInterviewComponent },
      { path: 'personal-info', component: PersonalInformationComponent}
    ],
  },
];

export const appConfig: ApplicationConfig = {
  providers: [
    // provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection(),
    provideHttpClient(withFetch()),
    // provideRouter(routes),
    provideRouter(routes, withComponentInputBinding()) // 👈 enable router
  ],
};
