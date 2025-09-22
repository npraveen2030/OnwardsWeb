import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { JobPostComponent } from './jobpost.component';
import { JobPostService } from '../../services/jobpost.service';
import { isPlatformBrowser } from '@angular/common';
import { AllJobDetails, location } from '../../models/jobpostresponse';
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
  searchName: string = 'MySearch12';
  @Input() filterid?: number;
  @Input() filter?: string;
  @Input() setfilter?: (filterid?: number, filter?: string) => void;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private jobPostService: JobPostService,
    private savedSearchService: SavedSearchService,
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

  switchtolist() {
    this.showlist = true;
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
        this.toastr.success('search saved successfully!', 'Success');
      } else {
        this.toastr.error('Name already Exists');
      }
    });
  }
}
