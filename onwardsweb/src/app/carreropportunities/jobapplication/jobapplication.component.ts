import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { JobApplicationService } from '../../services/job-application.service';
import { JobApplicationResponse } from '../../models/jobapplication';
import { LoginResponse } from '../../models/loginResponseModel';
import { DatePipe } from '@angular/common';
import { JobdescriptionComponent } from '../carreroppourtinities/jobdescription.component';
import { LoadingService } from '../../services/loading.service';
import { ToastrService } from 'ngx-toastr';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-jobapplication',
  standalone: true,
  imports: [CommonModule, DatePipe, JobdescriptionComponent, TableModule, PaginatorModule],
  templateUrl: './jobapplication.component.html',
  styleUrl: './jobapplication.component.scss',
})
export class JobApplicationComponent implements OnInit {
  jobApplications: JobApplicationResponse[] = [];
  itemsPerPage = 10;
  userDetails!: LoginResponse;
  JobId: number = 0;
  showlist: boolean = true;
  jobapplicationmodal!: any;
  idtobedeleted!: number;
  @Input() switchTo?: (tabName: string) => void;
  @Input() setjobid?: (id: number) => void;
  @Input() referredjobid?: (jobid: number) => void;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private jobApplicationService: JobApplicationService,
    private loading: LoadingService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userDetailsJson: string | null = sessionStorage.getItem('userDetails');

      if (userDetailsJson !== null) {
        this.userDetails = JSON.parse(userDetailsJson);
      }

      this.jobApplicationDetails();
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const bootstrap = (window as any).bootstrap;
      const modalElement = document.getElementById('jobapplicationmodal');

      if (modalElement && bootstrap?.Modal) {
        this.jobapplicationmodal = new bootstrap.Modal(modalElement);
      }
    }
  }

  jobApplicationDetails() {
    this.loading.show();
    this.jobApplicationService.getJobApplications(this.userDetails.id).subscribe({
      next: (data) => {
        this.jobApplications = data;
        console.log(this.jobApplications);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.loading.hide();
      },
    });
  }

  onItemsPerPageChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.itemsPerPage = +select.value;
    // Pagination logic can be added later
  }

  findMoreJobs(): void {
    if (this.switchTo !== undefined) {
      this.switchTo('jobsearch');
    }
  }

  switchtolist() {
    this.showlist = true;
  }

  showJobdetails(id: number) {
    this.JobId = id;
    this.showlist = false;
  }

  showdeletemodal(id: number) {
    this.idtobedeleted = id;
    this.jobapplicationmodal?.show();
  }

  withdrawJobApplication() {
    this.jobApplicationService
      .deleteJobApplication(this.idtobedeleted, this.userDetails.id)
      .subscribe((res) => {
        this.jobApplicationDetails();
        this.toastr.success('Job application withdrawn successfully!');
        this.jobapplicationmodal?.hide();
      });
  }

  setjobidprop(id: number) {
    if (this.setjobid !== undefined) {
      this.setjobid(id);
    }
  }

  setreferredjobid(jobid: number) {
    if (this.referredjobid !== undefined) {
      this.referredjobid(jobid);
    }
  }
}
