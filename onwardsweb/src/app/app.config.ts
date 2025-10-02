import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Route, withComponentInputBinding } from '@angular/router';

import { LoginComponent } from './shared/login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './shared/dashboard.component';
import { ReportComponent } from './report/report.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { SessionGuard } from './gaurds/session.gaurd';
import { ResignationComponent } from './myworkspace/resignation/resignation.component';
import { WorkspaceComponent } from './myworkspace/workspace.component';
import { LeavemanagementComponent } from './shared/leavemanagement/leavemanagement.component';
import { ExitInterviewComponent } from './myworkspace/exit-interview/exit-interview.component';
import { MyApprovalComponent } from './myworkspace/my-approval/my-approval.component';
import { PersonalInformationComponent } from './myworkspace/personal-information/personal-information.component';
import { BasicDetailsComponent } from './myworkspace/basic-details/basic-details.component';
import { ReimbursementsComponent } from './myworkspace/reimbursements/reimbursements.component';
import { ReimbursementDetailsComponent } from './reimbursements/reimbursement-details/reimbursement-details.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CareerdashboardComponent } from './carreropportunities/careerdashboard.component';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';
import { ToastrModule } from 'ngx-toastr';

const routes: Route[] = [
  { path: '', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [SessionGuard],
    canActivateChild: [SessionGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { breadcrumb: 'Home' },
      },
      { path: 'reports', component: ReportComponent },
      { path: 'dashboard/leavemanagement', component: LeavemanagementComponent },
      {
        path: 'resignation',
        component: ResignationComponent,
        data: {
          breadcrumb: 'resignation',
          parent: '/myworkspace',
        },
      },
      {
        path: 'myworkspace',
        component: WorkspaceComponent,
        data: {
          breadcrumb: 'Myworkspace',
          parent: '/dashboard',
        },
      },
      { path: 'my-approvals', component: MyApprovalComponent },
      { path: 'exit-interview', component: ExitInterviewComponent },
      {
        path: 'personal-info',
        component: PersonalInformationComponent,
        data: {
          breadcrumb: 'personal-info',
          parent: '/myworkspace',
        },
      },
      { path: 'basic-details', component: BasicDetailsComponent },
      {
        path: 'reimbursements',
        component: ReimbursementsComponent,
        data: {
          breadcrumb: 'reimbursements',
          parent: '/myworkspace',
        },
      },
      { path: 'reimbursement-details', component: ReimbursementDetailsComponent },
      {
        path: 'dashboard/career',
        component: CareerdashboardComponent,
        data: {
          breadcrumb: 'Career',
          parent: '/dashboard',
        },
      },
    ],
  },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(),
    provideHttpClient(withFetch()),
    importProvidersFrom(
      ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
      })
    ),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Lara,
        options: {
          darkModeSelector: false || 'none',
        },
      },
    }),
  ],
};
