import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { JobPostService } from '../../services/jobpost.service';
import { isPlatformBrowser } from '@angular/common';
import { JobDetailsresponse } from '../../models/jobpostresponse';
import { SavedJobService } from '../../services/savedjob.service';
import { savedjobrequest } from '../../models/savedjobmodel';
import { LoginResponse } from '../../models/loginResponseModel';
import { ToastrService } from 'ngx-toastr';
import { JobApplicationService } from '../../services/job-application.service';
import { JobApplicationRequest } from '../../models/jobapplication';
import { ModalService } from '../../services/emailfriendmodal.service';

@Component({
  selector: 'app-jobdescription',
  standalone: true,
  imports: [],
  templateUrl: './jobdescription.component.html',
  styleUrl: './jobdescription.component.scss',
})
export class JobdescriptionComponent {
  @Input() id!: number;
  @Input() switchToJobList!: () => void;
  @Input() setjobid?: (id: number) => void;
  JobDetails!: JobDetailsresponse;
  userDetails!: LoginResponse;
  emailfriendmodal!: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private jobPostService: JobPostService,
    private savedJobService: SavedJobService,
    private jobApplicationService: JobApplicationService,
    private modalService: ModalService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.jobPostService.GetJobDetilsById(this.id).subscribe({
        next: (res) => {
          this.JobDetails = {
            ...res,
            skills: res.skills.slice(0, -1).replace(/,/g, ' , '),
            createdDate: new Date(res.createdDate).toLocaleDateString('en-GB'),
          };
        },
      });

      const userDetailsJson: string | null = sessionStorage.getItem('userDetails');

      if (userDetailsJson !== null) {
        this.userDetails = JSON.parse(userDetailsJson);
      }
    }
  }

  returntolist() {
    if (this.switchToJobList != null) {
      this.switchToJobList();
    }
  }

  PrintDetials() {
    window.print();
  }

  savejob() {
    const savereq: savedjobrequest = {
      userId: this.userDetails.id,
      jobId: this.JobDetails.id ?? 0,
      loginId: this.userDetails.id,
    };
    this.savedJobService.insertsavedjob(savereq).subscribe((res) => {
      if (res === true) {
        this.toastr.success('Job Saved successfully!', 'Success');
      } else {
        this.toastr.warning('Job is Previously Saved');
      }
    });
  }

  applyjob() {
    const applyreq: JobApplicationRequest = {
      id: null,
      userId: this.userDetails.id,
      jobId: this.JobDetails.id ?? 0,
      loginId: this.userDetails.id,
      statusId: 1, // Pending
    };
    this.jobApplicationService.insertOrUpdateJobApplication(applyreq).subscribe((res) => {
      if (res === true) {
        this.toastr.success('Job Applied successfully!', 'Success');
      } else {
        this.toastr.warning('Job is Previously applied');
      }
    });
  }

  emailfriend() {
    if (this.setjobid !== undefined) {
      this.setjobid(this.JobDetails.id ?? 0);
    }
  }
}
