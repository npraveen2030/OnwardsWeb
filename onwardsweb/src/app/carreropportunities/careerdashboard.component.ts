import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobApplicationComponent } from './jobapplication/jobapplication.component';
import { SavedJobComponent } from './saved-job/saved-job.component';
import { SavedApplicationComponent } from './saved-application/saved-application.component';
import { ReferralTrackingComponent } from './referral-tracking/referral-tracking.component';
import { JobsearchComponent } from './carreroppourtinities/jobsearch.component';
import { JobdescriptionComponent } from './carreroppourtinities/jobdescription.component';
import { SavedSearchComponent } from './saved-search/saved-search.component';

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
    SavedSearchComponent,
  ],
  templateUrl: './careerdashboard.component.html',
  styleUrl: './careerdashboard.component.scss',
})
export class CareerdashboardComponent {
  selectedTab: string = 'jobsearch';
  filterid?: number;
  filter?: string;

  setfilter(filterid?: number, filter?: string) {
    this.filterid = filterid;
    this.filter = filter;
  }

  switchTo(tabName: string) {
    this.selectedTab = tabName;
  }
}
