import { Injectable } from '@angular/core';
import { JobApplication } from '../../models/career/jobapplication';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CareerService {
  private jobApplications: JobApplication[] = [
    {
      jobTitle: 'Software Engineer',
      actions: 'View | Withdraw',
      reqId: 'REQ1234',
      dateApplied: '2025-09-01',
      status: 'Pending',
      statusDate: '2025-09-02',
      nextStep: 'Interview',
      jobLocation: 'Bangalore',
    },
    {
      jobTitle: 'Frontend Developer',
      actions: 'View | Withdraw',
      reqId: 'REQ5678',
      dateApplied: '2025-08-25',
      status: 'Approved',
      statusDate: '2025-08-30',
      nextStep: 'Offer',
      jobLocation: 'Hyderabad',
    },
  ];

  constructor() {}

  getJobApplications(): Observable<JobApplication[]> {
    return of(this.jobApplications);
  }

  getSavedJobs(): Observable<JobApplication[]> {
    return of(this.jobApplications);
  }
   getSavedApplications(): Observable<JobApplication[]> {
    return of(this.jobApplications);
  }
}
