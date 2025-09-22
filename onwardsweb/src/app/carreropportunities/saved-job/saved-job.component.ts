import { Component, Inject, Input, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SavedJobService } from '../../services/savedjob.service';
import { savedjobresponse } from '../../models/savedjobmodel';
import { LoginResponse } from '../../models/loginResponseModel';
import { JobdescriptionComponent } from '../carreroppourtinities/jobdescription.component';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-saved-job',
  standalone: true,
  imports: [CommonModule, JobdescriptionComponent],
  templateUrl: './saved-job.component.html',
  styleUrl: './saved-job.component.scss',
})
export class SavedJobComponent {
  jobApplications: savedjobresponse[] = [];
  itemsPerPage = 10;
  userDetails!: LoginResponse;
  JobId: number = 0;
  showlist: boolean = true;
  savejobmodal!: any;
  tobedeltedid!: number;
  @Input() switchTo?: (tabName: string) => void;

  constructor(
    private savedJobService: SavedJobService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private toastr: ToastrService,
    private loading: LoadingService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userDetailsJson: string | null = sessionStorage.getItem('userDetails');

      if (userDetailsJson !== null) {
        this.userDetails = JSON.parse(userDetailsJson);
      }

      this.savedJobs();
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const bootstrap = (window as any).bootstrap;
      const modalElement = document.getElementById('savejobmodal');

      if (modalElement && bootstrap?.Modal) {
        this.savejobmodal = new bootstrap.Modal(modalElement);
      }
    }
  }

  savedJobs() {
    this.loading.show();
    this.savedJobService.getSavedJobs(this.userDetails.id).subscribe({
      next: (data) => {
        this.jobApplications = data;
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

  showmodal(id: number) {
    this.tobedeltedid = id;
    this.savejobmodal?.show();
  }

  deleteSavedJob() {
    if (this.tobedeltedid !== undefined) {
      this.savedJobService.deletesavedjob(this.tobedeltedid).subscribe((res) => {
        this.savedJobs();
        this.toastr.success('Job unsaved successfully!');
        this.savejobmodal?.hide();
      });
    }
  }
}
