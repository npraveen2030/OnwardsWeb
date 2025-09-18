import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobApplicationComponent } from './jobapplication/jobapplication.component';
import { SavedJobComponent } from './saved-job/saved-job.component';
import { SavedApplicationComponent } from './saved-application/saved-application.component';
import { ReferralTrackingComponent } from './referral-tracking/referral-tracking.component';
import { JobsearchComponent } from './carreroppourtinities/jobsearch.component';

@Component({
  selector: 'app-careerdashboard',
  standalone: true,
  imports: [
    CommonModule,
    JobApplicationComponent,
    SavedJobComponent,
    SavedApplicationComponent,
    ReferralTrackingComponent,
    JobsearchComponent,
  ],
  templateUrl: './careerdashboard.component.html',
  styleUrl: './careerdashboard.component.scss',
})
export class CareerdashboardComponent {}
