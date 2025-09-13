import { Injectable } from '@angular/core';
import { JobApplication } from '../../models/career/jobapplication';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Referral } from '../../models/career/referral';

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

  private referrals: Referral[] = [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 9876543210',
      country: 'USA',
    },
    {
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 9876543210',
      country: 'India',
    },
    {
      firstName: 'Alex',
      lastName: 'Brown',
      email: 'alex.brown@example.com',
      phone: '+44 7700123456',
      country: 'UK',
    },
  ];

  // private referrals: Referral[] = [];
  private referralsSubject = new BehaviorSubject<Referral[]>(this.referrals);

  referrals$ = this.referralsSubject.asObservable();

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

  addReferral(referral: Referral) {
    this.referrals.push(referral);
    this.referralsSubject.next(this.referrals);
  }
}
