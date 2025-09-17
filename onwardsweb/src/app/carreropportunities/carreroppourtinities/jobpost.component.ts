import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AutoComplete } from 'primeng/autocomplete';
import { JobPostService } from '../../services/jobpost.service';
import { QuillModule } from 'ngx-quill';
import { project, role, location, user } from '../../models/jobpostresponse';
import { forkJoin } from 'rxjs';
import { jobdetails } from '../../models/jobpostrequest';
import { LoginResponse } from '../../models/loginResponseModel';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-jobpost',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AutoComplete, QuillModule],
  templateUrl: './jobpost.component.html',
  styleUrl: './jobpost.component.scss',
})
export class JobPostComponent {
  NewJobForm!: FormGroup;
  NewJobmodal!: any;
  skillsuggestions: string[] = [];
  usersuggestions: user[] = [];
  AllSkills: string[] = [];
  Allroles: role[] = [];
  Allprojects: project[] = [];
  Alllocations: location[] = [];
  AllUsers: user[] = [];
  userDetails!: LoginResponse;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private jobPostService: JobPostService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.NewJobForm = this.fb.group({
      RoleId: ['', Validators.required],
      ProjectId: ['', Validators.required],
      LocationId: ['', Validators.required],
      ProjectDescription: ['', Validators.required],
      Skillholder: [''],
      Skills: this.fb.array([], Validators.required),
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
      }).subscribe({
        next: (result) => {
          this.AllSkills = result.skills.map((item: any) => item.skillName);
          this.Allroles = result.roles;
          this.Allprojects = result.projects;
          this.Alllocations = result.locations;
        },
        error: (err) => {
          console.error('Error loading data:', err);
        },
      });

      const userDetailsJson: string | null = sessionStorage.getItem('userDetails');

      if (userDetailsJson !== null) {
        this.userDetails = JSON.parse(userDetailsJson);
      }
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const bootstrap = (window as any).bootstrap;
      const NewJobmodalEl = document.getElementById('NewJobmodal');

      if (NewJobmodalEl && bootstrap?.Modal) {
        this.NewJobmodal = new bootstrap.Modal(NewJobmodalEl);
      }
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

  // Requsition By AutoComplete
  searchuser(event: AutoCompleteCompleteEvent) {
    const terms = event.query
      .toLowerCase()
      .split(' ')
      .filter((t) => t.trim() !== '');

    this.usersuggestions = this.AllUsers.filter((user) =>
      terms.some((term) => user.username.toLowerCase().includes(term))
    );
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

      const insertform: jobdetails = {
        id: 0,
        roleId: this.NewJobForm.get('RoleId')?.value,
        projectId: this.NewJobForm.get('ProjectId')?.value,
        locationId: this.NewJobForm.get('LocationId')?.value,
        projectDescription: this.NewJobForm.get('ProjectDescription')?.value,
        skills: this.NewJobForm.get('Skills')?.value || [],
        nonDbSkills: this.NewJobForm.get('NonDbSkills')?.value || [],
        roleDescription: this.NewJobForm.get('RoleDescription')?.value,
        responsibilities: this.NewJobForm.get('Responsibilities')?.value,
        educationQualification: this.NewJobForm.get('EducationQualification')?.value,
        experienceRequired: this.NewJobForm.get('ExperienceRequired')?.value,
        domainSkills: this.NewJobForm.get('DomainSkills')?.value,
        loginId: this.userDetails.id,
        userId: this.userDetails.id,
        requesitionBy: 1,
        requesitionDate: '',
      };

      console.log();

      // this.jobPostService.InsertJobDetails(insertform).subscribe({
      //   next: (res) => {
      //     console.log(res);
      //   },
      // });
    } else {
      this.NewJobForm.markAllAsTouched();
      return;
    }
  }

  resetForm() {
    this.NewJobForm.reset();
  }
  onCancel() {
    // this.jobForm.reset();
  }
  isInvalid(controlName: string): boolean {
    const control = this.NewJobForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
