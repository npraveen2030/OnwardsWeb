import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { JobApplicationComponent } from './jobapplication/jobapplication.component';
import { SavedJobComponent } from './saved-job/saved-job.component';
import { SavedApplicationComponent } from './saved-application/saved-application.component';
import { ReferralTrackingComponent } from './referral-tracking/referral-tracking.component';
import { JobsearchComponent } from './carreroppourtinities/jobsearch.component';
import { SavedSearchComponent } from './saved-search/saved-search.component';
import { QuillModule } from 'ngx-quill';
import { ToastrService } from 'ngx-toastr';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { LoginResponse } from '../models/loginResponseModel';
import { EmailService } from '../services/email.service';
import { ModalService } from '../services/emailfriendmodal.service';
import { JobPostService } from '../services/jobpost.service';
import { JobDetailsresponse } from '../models/jobpostresponse';

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
    QuillModule,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
  ],
  templateUrl: './careerdashboard.component.html',
  styleUrl: './careerdashboard.component.scss',
})
export class CareerdashboardComponent {
  selectedTab: string = 'jobsearch';
  filterid?: number;
  filter?: string;
  useremail: string = '';
  JobDetails?: JobDetailsresponse;
  referfriendform!: FormGroup;
  userDetails!: LoginResponse;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private jobPostService: JobPostService,
    private emailService: EmailService,
    private modalService: ModalService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.referfriendform = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      message: [''],
    });
    if (isPlatformBrowser(this.platformId)) {
      const userDetailsJson: string | null = sessionStorage.getItem('userDetails');

      if (userDetailsJson !== null) {
        this.userDetails = JSON.parse(userDetailsJson);
      }

      this.useremail = this.userDetails.email;
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.modalService.initialize('emailfriendmodal');
    }
  }

  setfilter(filterid?: number, filter?: string) {
    this.filterid = filterid;
    this.filter = filter;
  }

  switchTo(tabName: string) {
    this.selectedTab = tabName;
  }

  setjobid(id: number) {
    debugger;
    this.jobPostService.GetJobDetilsById(id).subscribe({
      next: (res) => {
        this.JobDetails = {
          ...res,
          skills: res.skills.slice(0, -1).replace(/,/g, ' , '),
          createdDate: new Date(res.createdDate).toLocaleDateString('en-GB'),
        };
      },
      complete: () => {
        this.modalService.show();
      },
    });
  }

  sendemail() {
    if (this.referfriendform.valid) {
      const jobDetailsHTML = `
      <h5>Job Listing Detail</h5>

      <div class="job-details">
        <strong>About Company:</strong><br />
        ${this.JobDetails?.companyDescription}
        <br /><br />

        <strong>Basic Information on the Position:</strong><br />
        Position Name: ${this.JobDetails?.roleName} <br /><br />

        <strong>Mandatory/Required Skills & Location:</strong><br />
        ${this.JobDetails?.skills} - Location: ${this.JobDetails?.locationName} <br /><br />

        <strong>Purpose of the Role:</strong><br />
        ${this.JobDetails?.rolePurpose}

        <strong>Key Responsibilities and Accountabilities:</strong>
        ${this.JobDetails?.responsibilities}

        <strong>Education Qualification:</strong><br />
        ${this.JobDetails?.educationDetails}<br /><br />

        <strong>Minimum Experience Required:</strong><br />
        ${this.JobDetails?.experienceRequired}<br /><br />

        <strong>Domain Functional Skills:</strong>
        ${this.JobDetails?.domainFunctionalSkills}
      </div>
    `;

      this.referfriendform.get('message')?.setValue(jobDetailsHTML);

      this.emailService
        .sendEmail(
          this.referfriendform.value.email,
          'Job Offer for you',
          this.referfriendform.value.message
        )
        .subscribe({
          next: () => {
            this.modalService.hide();
            this.toastr.success('email sent successfully');
          },
          error: (err) => {
            this.modalService.hide();
            this.toastr.error('email is not sent');
            console.log(err);
          },
        });
    } else {
      this.referfriendform.markAllAsTouched();
      return;
    }
  }

  reset() {
    this.referfriendform.reset();
  }

  cancel() {
    debugger;
    this.referfriendform.reset();
    this.modalService.hide();
  }

  isInvalid(controlName: string): boolean {
    const control = this.referfriendform.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
