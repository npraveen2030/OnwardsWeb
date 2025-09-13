import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addjob',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './addjob.component.html',
  styleUrl: './addjob.component.scss',
})
export class AddjobComponent {
  NewJobForm!: FormGroup;
  NewJobmodal!: any;

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
    // private reimbursementService: ReimbursementService,
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
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const bootstrap = (window as any).bootstrap;
      const NewJobmodalEl = document.getElementById('NewJobmodal');

      if (NewJobmodalEl && bootstrap?.Modal) {
        this.NewJobmodal = new bootstrap.Modal(NewJobmodalEl);
        this.NewJobmodal?.show();
      }
    }
  }

  saveForm() {
    if (this.NewJobForm.invalid) {
      this.NewJobForm.markAllAsTouched();
      return;
    }

    const formData = this.NewJobForm.value;

    // send data to service
    // this.reimbursementService.addReimbursement(formData);

    // redirect to details page
    // this.router.navigate(['/reimbursement-details']);
  }

  resetForm() {
    this.NewJobForm.reset();
  }

  isInvalid(controlName: string): boolean {
    const control = this.NewJobForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
