import { Component, ElementRef, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
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
import { ModalService } from '../services/modal.service';
import { JobPostService } from '../services/jobpost.service';
import { JobDetailsresponse, location } from '../models/jobpostresponse';
import { ReferralTrackingService } from '../services/referraltracking.service';
import { ReferralTrackingRequest } from '../models/referraltrackingmodel';

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
  emailfriendform!: FormGroup;
  referralForm!: FormGroup;
  userDetails!: LoginResponse;
  referralmodal!: any;
  locations: location[] = [];
  @ViewChild('resumefile') resumefile!: ElementRef<HTMLInputElement>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private jobPostService: JobPostService,
    private emailService: EmailService,
    private modalService: ModalService,
    private referralService: ReferralTrackingService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.emailfriendform = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      message: [''],
    });

    this.referralForm = this.fb.group({
      jobId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      country: ['', Validators.required],
      resume: [null, Validators.required],
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
      const bootstrap = (window as any).bootstrap;
      const referralmodalEl = document.getElementById('referralmodal');

      if (referralmodalEl && bootstrap?.Modal) {
        this.referralmodal = new bootstrap.Modal(referralmodalEl);
      }
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

  referredjobid(jobid: number) {
    this.referralForm.patchValue({ jobId: jobid });
    this.jobPostService.Getlocations().subscribe((res) => {
      this.locations = res;
      this.referralmodal.show();
    });
  }

  sendemail() {
    if (this.emailfriendform.valid) {
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

      this.emailfriendform.get('message')?.setValue(jobDetailsHTML);

      this.emailService
        .sendEmail(
          this.emailfriendform.value.email,
          'Job Offer for you',
          this.emailfriendform.value.message
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
      this.emailfriendform.markAllAsTouched();
      return;
    }
  }

  resetemailfriend() {
    this.emailfriendform.reset();
  }

  cancelemailfriend() {
    this.emailfriendform.reset();
    this.modalService.hide();
  }

  onresumeupload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.referralForm.patchValue({ resume: file });
    }
  }

  onresumedelete() {
    this.resumefile.nativeElement.value = '';
    this.referralForm.get('resume')?.setValue(null);
  }

  SubmitReferral() {
    if (this.referralForm.valid) {
      const referraltrackingrequest: ReferralTrackingRequest = {
        jobId: this.referralForm.value.jobId,
        firstName: this.referralForm.value.firstName,
        lastName: this.referralForm.value.lastName,
        email: this.referralForm.value.email,
        phone: this.referralForm.value.phone,
        locationId: this.referralForm.value.country,
        fileData: this.referralForm.value.resume,
        statusId: 1, // penidng
        loginId: this.userDetails.id,
      };

      this.referralService.insertReferral(referraltrackingrequest).subscribe(() => {
        this.cancelreferralForm();
        this.toastr.success('Referral inserted successfully');
      });
    } else {
      this.referralForm.markAllAsTouched();
    }
  }

  resetreferralForm() {
    this.referralForm.reset({ country: '' });
    this.resumefile.nativeElement.value = '';
  }

  cancelreferralForm() {
    this.referralmodal.hide();
    this.resetreferralForm();
  }

  isInvalidemailfriend(controlName: string): boolean {
    const control = this.emailfriendform.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  isInvalidreferral(controlName: string): boolean {
    const control = this.referralForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
