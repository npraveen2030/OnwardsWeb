import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutoComplete } from 'primeng/autocomplete';
import { JobPostService } from '../../services/jobpost.service';
import { QuillModule } from 'ngx-quill';
import {
  project,
  role,
  location,
  user,
  company,
  AllJobDetails,
} from '../../models/jobpostresponse';
import { forkJoin } from 'rxjs';
import { jobdetails } from '../../models/jobpostrequest';
import { LoginResponse } from '../../models/loginResponseModel';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-jobpost',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AutoComplete,
    QuillModule,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './jobpost.component.html',
  styleUrl: './jobpost.component.scss',
})
export class JobPostComponent {
  NewJobForm!: FormGroup;
  NewJobmodal!: any;
  DeleteJobmodal!: any;
  tempDelId!: number;
  skillsuggestions: string[] = [];
  usersuggestions: user[] = [];
  AllSkills: string[] = [];
  Allroles: role[] = [];
  Allprojects: project[] = [];
  Alllocations: location[] = [];
  AllUsers: user[] = [];
  AllComapnies: company[] = [];
  userDetails!: LoginResponse;
  AllUserJobDetilas: AllJobDetails[] = [];
  paginatedUserJobDetails: AllJobDetails[] = [];
  pagination = {
    currentPage: 1,
    itemsPerPage: 5,
  };

  @Input() showJobDetailsParent!: (id: number) => void;
  @Input() RefreshSearchJobs!: () => void;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private jobPostService: JobPostService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.NewJobForm = this.fb.group({
      Id: [''],
      RoleId: ['', Validators.required],
      ProjectId: ['', Validators.required],
      LocationId: ['', Validators.required],
      CompanyId: ['', Validators.required],
      Skillholder: [''],
      Skills: this.fb.array([]),
      NonDbSkills: this.fb.array([]),
      RoleDescription: ['', Validators.required],
      Responsibilities: ['', Validators.required],
      EducationQualification: ['', Validators.required],
      ExperienceRequired: ['', Validators.required],
      DomainSkills: ['', Validators.required],
      RequesitionBy: ['', Validators.required],
      RequesitionDate: ['', Validators.required],
    });

    if (isPlatformBrowser(this.platformId)) {
      forkJoin({
        skills: this.jobPostService.GetSkills(),
        roles: this.jobPostService.GetRoles(),
        projects: this.jobPostService.GetProjects(),
        locations: this.jobPostService.Getlocations(),
        users: this.jobPostService.Getusers(),
        companies: this.jobPostService.Getcompanies(),
      }).subscribe({
        next: (result) => {
          this.AllSkills = result.skills.map((item: any) => item.skillName);
          this.Allroles = result.roles;
          this.Allprojects = result.projects;
          this.Alllocations = result.locations;
          this.AllUsers = result.users;
          this.AllComapnies = result.companies;
        },
        error: (err) => {
          console.error('Error loading data:', err);
        },
      });

      const userDetailsJson: string | null = sessionStorage.getItem('userDetails');

      if (userDetailsJson !== null) {
        this.userDetails = JSON.parse(userDetailsJson);
      }

      this.GetJobDetails();
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const bootstrap = (window as any).bootstrap;
      const NewJobmodalEl = document.getElementById('NewJobmodal');
      const DeleteJobmodalEl = document.getElementById('deletejobdetails');

      if (NewJobmodalEl && bootstrap?.Modal) {
        this.NewJobmodal = new bootstrap.Modal(NewJobmodalEl);
      }

      if (DeleteJobmodalEl && bootstrap?.Modal) {
        this.DeleteJobmodal = new bootstrap.Modal(DeleteJobmodalEl);
      }
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

  GetJobDetails() {
    this.jobPostService.GetAllJobDetails(this.userDetails.id).subscribe({
      next: (res) => {
        this.AllUserJobDetilas = res.map((job) => ({
          ...job,
          createdDate: new Date(job.createdDate).toLocaleDateString('en-GB'),
        }));

        this.updatePagination();
      },
    });
  }

  EditJobDetials(id: number) {
    this.jobPostService.GetJobDetilsById(id).subscribe({
      next: (job) => {
        (this.NewJobForm.get('Skills') as FormArray).clear();
        (this.NewJobForm.get('NonDbSkills') as FormArray).clear();

        const skillsArray = job.skills
          ? job.skills
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : [];

        skillsArray.forEach((skill) => {
          (this.NewJobForm.get('Skills') as FormArray).push(this.fb.control(skill));
        });

        this.NewJobForm.patchValue({
          Id: job.id,
          RoleId: job.roleId,
          ProjectId: job.projectId,
          LocationId: job.locationId,
          CompanyId: job.companyId,
          RoleDescription: job.rolePurpose,
          Responsibilities: job.responsibilities,
          EducationQualification: job.educationDetails,
          ExperienceRequired: job.experienceRequired,
          DomainSkills: job.domainFunctionalSkills,
          RequesitionBy: {
            id: job.requesitionBy,
            userName: job.requesitionUserName,
          },
          RequesitionDate: job.requesitionDate.split('T')[0],
        });

        this.NewJobmodal.show();
      },
    });
  }

  ConfirmDeleteJobDetails(id: number) {
    this.tempDelId = id;
    this.DeleteJobmodal?.show();
  }

  DeleteJobDetails() {
    this.jobPostService.DeleteJobDetails(this.tempDelId, this.userDetails.id).subscribe({
      next: (res) => {
        this.GetJobDetails();
        this.RefreshSearchJobs();
        this.DeleteJobmodal?.hide();
        this.toastr.success('Job Deleted successfully!', 'Success');
      },
    });
  }

  showJobDetails(id: number) {
    if (this.showJobDetailsParent != null) {
      this.showJobDetailsParent(id);
    }
  }

  // Auto-Complete
  search(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    this.skillsuggestions = this.AllSkills.filter((skill) => skill.toLowerCase().includes(query));
  }

  get skills(): FormArray {
    return this.NewJobForm.get('Skills') as FormArray;
  }

  get NonDbSkills(): FormArray {
    return this.NewJobForm.get('NonDbSkills') as FormArray;
  }

  addSkillFromHolder() {
    const skill = this.NewJobForm.get('Skillholder')?.value;

    if (skill && skill.trim()) {
      // Avoid duplicates
      const exists = this.skills.controls.some(
        (ctrl) => ctrl.value.toLowerCase() === skill.toLowerCase()
      );
      if (!exists) {
        this.skills.push(this.fb.control(skill.trim(), Validators.required));
      }

      this.NewJobForm.get('Skillholder')?.reset();
    }
  }

  removeSkill(index: number) {
    this.skills.removeAt(index);
  }

  // Requsition By -- AutoComplete
  searchuser(event: AutoCompleteCompleteEvent) {
    if (event.query.replace(/\s/g, '').length >= 3) {
      const terms = event.query.toLowerCase().split(/\s+/).filter(Boolean);

      this.usersuggestions = this.AllUsers.filter((user) => {
        const names = user.userName.toLowerCase().split(/\s+/).filter(Boolean);

        return terms.every((term, index) => {
          return !names[index] || names[index].includes(term);
        });
      });
    } else {
      this.usersuggestions = [];
    }
  }

  // Form Handling
  submit() {
    if (this.NewJobForm.valid) {
      // Checking for new skills
      for (let userskill of this.skills.value) {
        const exists = this.AllSkills.some(
          (skill) => skill.toLowerCase() === userskill.toLowerCase()
        );
        if (!exists) {
          this.NonDbSkills.push(this.fb.control(userskill.trim()));
        }
      }

      const submitform: jobdetails = {
        id: this.NewJobForm.get('Id')?.value === '' ? null : this.NewJobForm.get('Id')?.value,
        roleId: this.NewJobForm.get('RoleId')?.value,
        projectId: this.NewJobForm.get('ProjectId')?.value,
        locationId: this.NewJobForm.get('LocationId')?.value,
        companyId: this.NewJobForm.get('CompanyId')?.value,
        skills: this.NewJobForm.get('Skills')?.value || [],
        nonDbSkills: this.NewJobForm.get('NonDbSkills')?.value || [],
        RolePurpose: this.NewJobForm.get('RoleDescription')?.value,
        responsibilities: this.NewJobForm.get('Responsibilities')?.value,
        educationDetails: this.NewJobForm.get('EducationQualification')?.value,
        experienceRequired: this.NewJobForm.get('ExperienceRequired')?.value,
        domainFunctionalSkills: this.NewJobForm.get('DomainSkills')?.value,
        loginId: this.userDetails.id,
        userId: this.userDetails.id,
        requesitionBy: this.NewJobForm.get('RequesitionBy')?.value.id,
        requesitionDate: this.NewJobForm.get('RequesitionDate')?.value,
      };

      if (submitform.id === null) {
        this.jobPostService.InsertJobDetails(submitform).subscribe({
          next: (res) => {
            this.GetJobDetails();
            this.RefreshSearchJobs();
            this.resetForm();
            this.NewJobmodal.hide();
            this.toastr.success('Job posted successfully!', 'Success');
          },
        });
      } else {
        this.jobPostService.UpdateJobDetails(submitform).subscribe({
          next: (res) => {
            this.GetJobDetails();
            this.RefreshSearchJobs();
            this.resetForm();
            this.NewJobmodal.hide();
            this.toastr.success('Job Updated successfully!', 'Success');
          },
        });
      }

      this.jobPostService.GetSkills().subscribe({
        next: (res) => {
          this.AllSkills = res.map((item: any) => item.skillName);
        },
      });
    } else {
      this.NewJobForm.markAllAsTouched();
      return;
    }
  }

  resetForm() {
    this.NewJobForm.reset();
    while (this.skills.length !== 0) {
      this.skills.removeAt(0);
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.NewJobForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
