import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { JobPostComponent } from './jobpost.component';
import { JobPostService } from '../../services/jobpost.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AllJobDetails, location, savesearch } from '../../models/jobpostresponse';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JobdescriptionComponent } from './jobdescription.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePipe } from '@angular/common';
import { SavedSearchService } from '../../services/savedSearch.service';
import { SavedSearchRequest } from '../../models/savedsearchmodel';
import { LoginResponse } from '../../models/loginResponseModel';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../services/loading.service';
import { firstValueFrom } from 'rxjs';
import { savedjobrequest } from '../../models/savedjobmodel';
import { JobApplicationRequest } from '../../models/jobapplication';
import { SavedJobService } from '../../services/savedjob.service';
import { JobApplicationService } from '../../services/job-application.service';

@Component({
  selector: 'app-jobsearch',
  standalone: true,
  imports: [
    JobPostComponent,
    FormsModule,
    JobdescriptionComponent,
    MultiSelectModule,
    ReactiveFormsModule,
    DatePipe,
    CommonModule,
  ],
  templateUrl: './jobsearch.component.html',
  styleUrl: './jobsearch.component.scss',
})
export class JobsearchComponent {
  AllUserJobDetilas: AllJobDetails[] = [];
  paginatedUserJobDetails: AllJobDetails[] = [];
  pagination = {
    currentPage: 1,
    itemsPerPage: 5,
  };
  JobId: number = 0;
  showlist: boolean = true;
  jobSearchForm!: FormGroup;
  cities: location[] = [];
  userDetails!: LoginResponse;
  searchName: string = '';
  showsavesearch: boolean = false;
  selectedNameId: string = '';
  savedsearchnames: savesearch[] = [];
  savesearchnamemodal!: any;
  emailfriendmodal!: any;
  @Input() filterid?: number;
  @Input() filter?: string;
  @Input() setfilter?: (filterid?: number, filter?: string) => void;
  @Input() setjobid?: (id: number) => void;
  @Input() referredjobid?: (jobid: number) => void;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private jobPostService: JobPostService,
    private savedSearchService: SavedSearchService,
    private savedJobService: SavedJobService,
    private jobApplicationService: JobApplicationService,
    private toastr: ToastrService,
    private loading: LoadingService,
    private fb: FormBuilder
  ) {}

  async ngOnInit(): Promise<void> {
    this.jobSearchForm = this.fb.group({
      keyword: [''],
      reqId: [''],
      location: [[]],
    });

    if (isPlatformBrowser(this.platformId)) {
      this.loading.show();

      const userDetailsJson = sessionStorage.getItem('userDetails');

      if (userDetailsJson !== null) {
        this.userDetails = JSON.parse(userDetailsJson);
      }

      if (this.filter !== undefined) {
        this.jobSearchForm.patchValue(JSON.parse(this.filter));
      }

      try {
        await this.getsavedsearch();
        await this.getlocations();
        await this.getJobDetails(
          this.jobSearchForm?.value.keyword,
          this.jobSearchForm?.value.reqId,
          this.jobSearchForm?.value.location.map((loc: location) => loc.id)
        );
      } catch (error) {
        console.error('Error during sequential calls', error);
      } finally {
        this.loading.hide();
      }
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const bootstrap = (window as any).bootstrap;
      const NewJobmodalEl = document.getElementById('savesearchnamemodal');

      if (NewJobmodalEl && bootstrap?.Modal) {
        this.savesearchnamemodal = new bootstrap.Modal(NewJobmodalEl);
      }

      const modalElement = document.getElementById('emailfriendmodal');

      if (modalElement && bootstrap?.Modal) {
        this.emailfriendmodal = new bootstrap.Modal(modalElement);
      }
    }
  }

  async getlocations(): Promise<void> {
    this.loading.show();
    try {
      const loc = await firstValueFrom(this.jobPostService.Getlocations());
      this.cities = loc;
    } catch (error) {
      console.error('Error fetching locations', error);
    } finally {
      this.loading.hide();
    }
  }

  async getJobDetails(keyword?: string, reqId?: number, location: number[] = []): Promise<void> {
    this.loading.show();
    try {
      const res = await firstValueFrom(
        this.jobPostService.getSearchedJobDetails(keyword, reqId, location)
      );
      this.AllUserJobDetilas = res;
      this.updatePagination();
    } catch (error) {
      console.error('Error fetching job details', error);
    } finally {
      this.loading.hide();
    }
  }

  async getsavedsearch(): Promise<void> {
    this.loading.show();
    try {
      const res = await firstValueFrom(
        this.savedSearchService.getAllSavedSearch(this.userDetails.id)
      );
      this.savedsearchnames = res.map((search) => ({
        id: search.id,
        searchname: search.searchName,
        search: search.search,
      }));
    } catch (error) {
      console.error('Error fetching job details', error);
    } finally {
      console.log(this.savedsearchnames);
      this.loading.hide();
    }
  }

  // Pagination
  updatePagination() {
    const start = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage;
    const end = start + this.pagination.itemsPerPage;
    this.paginatedUserJobDetails = this.AllUserJobDetilas.slice(start, end);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.pagination.currentPage = page;
      this.updatePagination();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.AllUserJobDetilas.length / this.pagination.itemsPerPage);
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.getTotalPages() }, (_, i) => i + 1);
  }

  updateitemsPerPage() {
    this.pagination.currentPage = 1;
    this.updatePagination();
  }

  switchtolist() {
    this.showlist = true;
  }

  setjobidprop(id: number) {
    if (this.setjobid !== undefined) {
      this.setjobid(id);
    }
  }

  showJobdetails(id: number) {
    this.JobId = id;
    this.showlist = false;
  }

  async onSubmitfiltersearch(): Promise<void> {
    await this.getJobDetails(
      this.jobSearchForm?.value.keyword,
      this.jobSearchForm?.value.reqId,
      this.jobSearchForm?.value.location.map((loc: location) => loc.id)
    );

    if (this.setfilter !== undefined) {
      this.setfilter(undefined, JSON.stringify(this.jobSearchForm?.value));
    }

    this.showsavesearch = true;
  }

  onResetfiltersearch(): void {
    this.jobSearchForm.reset({
      keyword: '',
      reqId: '',
      location: [],
    });

    if (this.setfilter !== undefined) {
      this.setfilter(undefined, undefined);
    }

    this.getJobDetails();
    this.showsavesearch = false;
    this.selectedNameId = '';
  }

  sortjobdetails(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    switch (selectedValue) {
      case 'DP':
        this.AllUserJobDetilas = this.AllUserJobDetilas.sort(
          (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        );
        break;
      case 'RL':
        console.log('Sort by Relevance');
        break;
      case 'JT':
        this.AllUserJobDetilas = this.AllUserJobDetilas.sort((a, b) =>
          b.roleName.localeCompare(a.roleName)
        );
        break;
      case 'RQ':
        this.AllUserJobDetilas = this.AllUserJobDetilas.sort((a, b) => b.id - a.id);
        break;
      case 'JL':
        this.AllUserJobDetilas = this.AllUserJobDetilas.sort((a, b) =>
          b.locationName.localeCompare(a.locationName)
        );
        break;
    }

    this.updatePagination();
  }

  savesearch() {
    const savesearchreq: SavedSearchRequest = {
      searchName: this.searchName,
      search: JSON.stringify(this.jobSearchForm?.value),
      loginId: this.userDetails.id,
      userId: this.userDetails.id,
    };

    this.savedSearchService.insertOrUpdateSavedSearch(savesearchreq).subscribe((res) => {
      if (res.isUnique === true) {
        this.getsavedsearch();
        this.savesearchnamemodal?.hide();
        this.toastr.success('search saved successfully!', 'Success');
      } else {
        this.toastr.error('Name already Exists');
      }
    });
  }

  applyselectedsave() {
    const selectedsearch = this.savedsearchnames.find(
      (saves) => saves.id === Number(this.selectedNameId)
    );
    if (selectedsearch !== undefined) {
      if (this.setfilter !== undefined) {
        this.setfilter(selectedsearch.id, selectedsearch.search);
      }
      this.jobSearchForm.patchValue(JSON.parse(selectedsearch.search));
      this.getJobDetails(
        this.jobSearchForm?.value.keyword,
        this.jobSearchForm?.value.reqId,
        this.jobSearchForm?.value.location.map((loc: location) => loc.id)
      );
    }
  }

  actionchanged(event: Event, id: number) {
    // Get the selected value
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    console.log('Job ID:', id);
    console.log('Selected Action:', selectedValue);

    // Perform action based on selected value
    switch (selectedValue) {
      case 'apply':
        this.applyjob(id);
        break;
      case 'save':
        this.savejob(id);
        break;
      case 'refer':
        this.setreferredjobid(id);
        break;
      case 'email':
        this.setjobidprop(id);
        break;
      default:
        break;
    }

    selectElement.value = '';
  }

  savejob(id: number) {
    const savereq: savedjobrequest = {
      userId: this.userDetails.id,
      jobId: id,
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

  applyjob(id: number) {
    const applyreq: JobApplicationRequest = {
      id: null,
      userId: this.userDetails.id,
      jobId: id,
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

  setreferredjobid(jobid: number) {
    if (this.referredjobid !== undefined) {
      this.referredjobid(jobid);
    }
  }
}
