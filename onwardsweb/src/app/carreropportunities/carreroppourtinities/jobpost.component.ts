import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AutoComplete } from 'primeng/autocomplete';
import { JobPostService } from '../../services/jobpost.service';
import { QuillModule } from 'ngx-quill';

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

  skillsuggestions: any[] = [];
  AllSkills: any[] = [];

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
      Skillholder: [''],
      Skills: this.fb.array([], Validators.required),
      NonDbSkills: this.fb.array([]),
      RoleDescription: ['', Validators.required],
      Responsibilities: ['', Validators.required],
      EducationQualification: ['', Validators.required],
      ExperienceRequired: ['', Validators.required],
      DomainSkills: ['', Validators.required],
    });

    if (isPlatformBrowser(this.platformId)) {
      this.jobPostService.GetSkills().subscribe({
        next: (res) => {
          this.AllSkills = res.map((item: any) => item.skillName);
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

  // Form Handling

  saveForm() {
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

      console.log(this.NewJobForm.value);
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
