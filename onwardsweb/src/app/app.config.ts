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
import { JobPostComponent } from './carreropportunities/carreroppourtinities/jobpost.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { CareerdashboardComponent } from './carreropportunities/careerdashboard.component';

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
      { path: 'personal-info', component: PersonalInformationComponent },
      { path: 'basic-details', component: BasicDetailsComponent },
      { path: 'reimbursements', component: ReimbursementsComponent },
      { path: 'reimbursement-details', component: ReimbursementDetailsComponent },
      { path: 'career', component: CareerdashboardComponent },
      { path: 'jobpost', component: JobPostComponent },
    ],
  },
];

export const appConfig: ApplicationConfig = {
  providers: [
    // provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection(),
    provideHttpClient(withFetch()),
    importProvidersFrom(BrowserAnimationsModule),
    // provideRouter(routes),
    provideRouter(routes, withComponentInputBinding()),
  ],
};
