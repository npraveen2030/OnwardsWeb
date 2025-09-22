import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, Input, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JobdescriptionComponent } from '../carreroppourtinities/jobdescription.component';
import { SavedSearchRequest, SavedSearchResponse } from '../../models/savedsearchmodel';
import { SavedSearchService } from '../../services/savedSearch.service';
import { LoginResponse } from '../../models/loginResponseModel';
import { LoadingService } from '../../services/loading.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-saved-search',
  standalone: true,
  imports: [CommonModule, FormsModule, JobdescriptionComponent],
  templateUrl: './saved-search.component.html',
  styleUrl: './saved-search.component.scss',
})
export class SavedSearchComponent {
  savedSearches: SavedSearchResponse[] = [];
  editIndex: number | null = null;
  backupSearchName: string = '';
  userDetails!: LoginResponse;
  idtobedeleted!: number;
  savesearchmodal!: any;
  @ViewChild('editInput') editInput!: ElementRef<HTMLInputElement>;
  @Input() switchTo?: (tabName: string) => void;
  @Input() setfilter?: (filterid?: number, filter?: string) => void;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private savedSearchService: SavedSearchService,
    private loading: LoadingService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userDetailsJson: string | null = sessionStorage.getItem('userDetails');

      if (userDetailsJson !== null) {
        this.userDetails = JSON.parse(userDetailsJson);
      }

      this.savedsearch();
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const bootstrap = (window as any).bootstrap;
      const modalElement = document.getElementById('savesearchmodal');

      if (modalElement && bootstrap?.Modal) {
        this.savesearchmodal = new bootstrap.Modal(modalElement);
      }
    }
  }

  ngAfterViewChecked() {
    // Focus input if editIndex is active
    if (this.editIndex !== null && this.editInput) {
      const inputEl = this.editInput.nativeElement;
      inputEl.focus();
      // Optional: move cursor to end
      const length = inputEl.value.length;
      inputEl.setSelectionRange(length, length);
    }
  }

  savedsearch() {
    this.loading.show();
    this.savedSearchService.getAllSavedSearch(this.userDetails.id).subscribe({
      next: (res) => {
        this.savedSearches = res;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.loading.hide();
      },
    });
  }

  viewsavedsearch(filterid: number, filter: string) {
    if (this.setfilter !== undefined) {
      this.setfilter(filterid, filter);
    }

    if (this.switchTo !== undefined) {
      this.switchTo('jobsearch');
    }
  }

  // Called when user clicks on a SearchName cell
  startEdit(index: number) {
    this.editIndex = index;
    this.backupSearchName = this.savedSearches[index].searchName;
  }

  exitEdit() {
    this.editIndex = null;
    this.backupSearchName = '';
  }

  // Save inline edit
  saveEdit(index: number) {
    this.loading.show();
    if (this.editIndex !== null) {
      const updatedSearch: SavedSearchRequest = {
        id: this.savedSearches[index].id,
        userId: this.userDetails.id,
        loginId: this.userDetails.id,
        searchName: this.savedSearches[index].searchName,
        search: this.savedSearches[index].search,
      };

      this.savedSearchService.insertOrUpdateSavedSearch(updatedSearch).subscribe({
        next: (res) => {
          this.editIndex = null;
          if (res.isUnique === true) {
            this.toastr.success('search updated successfully!');
          } else {
            this.toastr.error('Name already exists!');
          }
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.loading.hide();
        },
      });
    }
  }

  showdeletemodal(id: number) {
    this.idtobedeleted = id;
    this.savesearchmodal?.show();
  }

  deleteSavedSearch() {
    this.loading.show();
    this.savedSearchService.deleteSavedSearch(this.idtobedeleted).subscribe({
      next: () => {
        this.savedsearch();
        this.savesearchmodal?.hide();
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.loading.hide();
      },
    });
  }

  onItemsPerPageChange(event: any) {
    // pagination logic
  }
}
