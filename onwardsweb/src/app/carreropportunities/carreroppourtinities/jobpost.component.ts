import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AutoComplete } from 'primeng/autocomplete';
import { JobPostService } from '../../services/jobpost.service';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-jobpost',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AutoComplete],
  templateUrl: './jobpost.component.html',
  styleUrl: './jobpost.component.scss',
})
export class JobPostComponent {
  NewJobForm!: FormGroup;
  NewJobmodal!: any;

  skillsuggestions: any[] = [];
  skills: any[] = [];

  search(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    this.skillsuggestions = this.skills.filter((skill) => skill.toLowerCase().includes(query));
  }

  roles = [
    { id: 1, name: 'Developer' },
    { id: 2, name: 'Tester' },
    { id: 3, name: 'Manager' },
  ];

  projects = [
    { id: 101, name: 'Project A' },
    { id: 102, name: 'Project B' },
    { id: 103, name: 'Project C' },
  ];

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
      SlkDescription: ['', Validators.required],
      Skills: ['', Validators.required],
      RoleDescription: ['', Validators.required],
      Responsibilities: ['', Validators.required],
      EducationQualification: ['', Validators.required],
      ExperienceRequired: ['', Validators.required],
      DomainSkills: ['', Validators.required],
    });

    if (isPlatformBrowser(this.platformId)) {
      this.jobPostService.GetSkills().subscribe({
        next: (res) => {
          this.skills = res.map((item: any) => item.skillName);
        },
      });
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

  saveForm() {
    if (this.NewJobForm.invalid) {
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
