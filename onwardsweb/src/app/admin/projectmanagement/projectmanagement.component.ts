import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { LoginResponse } from '../../models/loginResponseModel';
import { ProjectManagementService } from '../../services/projectmanagement.service';
import {
  ProjectManagementRequest,
  ProjectManagementResponse,
} from '../../models/projectmanagementmodel';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-projectmanagement',
  standalone: true,
  imports: [TableModule, DatePipe, ReactiveFormsModule, CommonModule],
  templateUrl: './projectmanagement.component.html',
  styleUrl: './projectmanagement.component.scss',
})
export class ProjectmanagementComponent {
  noDataMessage: string = '';
  userDetails!: LoginResponse;
  deleteprojectmodal!: any;
  insertorupdateprojectmodal!: any;
  projects: ProjectManagementResponse[] = [];
  projectForm!: FormGroup;
  isInsert: boolean = true;
  detetedprojectid?: number;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private toastr: ToastrService,
    private projectManagementService: ProjectManagementService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      id: [''],
      projectName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
    });
    if (isPlatformBrowser(this.platformId)) {
      const userDetailsJson: string | null = sessionStorage.getItem('userDetails');

      if (userDetailsJson !== null) {
        this.userDetails = JSON.parse(userDetailsJson);
      }

      this.noDataMessage = environment.noDataMessage;
      this.getProjects();
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const bootstrap = (window as any).bootstrap;
      const deleteprojectmodalEl = document.getElementById('deleteproject');
      const insertorupdateprojectmodalEl = document.getElementById('insertorupdateproject');

      if (deleteprojectmodalEl && bootstrap?.Modal) {
        this.deleteprojectmodal = new bootstrap.Modal(deleteprojectmodalEl);
      }

      if (insertorupdateprojectmodalEl && bootstrap?.Modal) {
        this.insertorupdateprojectmodal = new bootstrap.Modal(insertorupdateprojectmodalEl);
      }
    }
  }

  getProjects() {
    this.projectManagementService.getProjects().subscribe({
      next: (res) => {
        this.projects = res;
      },
    });
  }

  insertProject() {
    this.isInsert = true;
    this.insertorupdateprojectmodal.show();
  }

  updateProject(id: number, projectName: string, startDate?: string, endDate?: string) {
    this.isInsert = false;
    this.projectForm.setValue({
      id: id,
      projectName: projectName,
      startDate: startDate ? startDate.split('T')[0] : null,
      endDate: endDate ? endDate.split('T')[0] : null,
    });
    this.insertorupdateprojectmodal.show();
  }

  reset() {
    this.projectForm.reset({
      id: this.projectForm.get('id')?.value,
    });
  }

  closemodal() {
    this.insertorupdateprojectmodal.hide();
    this.projectForm.reset();
  }

  insertorupdateProject() {
    if (this.projectForm.valid) {
      const insertorupdaterequest: ProjectManagementRequest = {
        id:
          this.projectForm.get('id')?.value === '' ? undefined : this.projectForm.get('id')?.value,
        loginId: this.userDetails.id,
        projectName: this.projectForm.get('projectName')?.value,
        startDate:
          this.projectForm.get('startDate')?.value === undefined
            ? undefined
            : new Date(this.projectForm.get('startDate')?.value),
        endDate:
          this.projectForm.get('endDate')?.value === undefined
            ? undefined
            : new Date(this.projectForm.get('endDate')?.value),
      };
      this.projectManagementService.insertOrUpdateProject(insertorupdaterequest).subscribe({
        next: (res) => {
          if (res.success) {
            this.toastr.success(res.message);
          } else {
            this.toastr.error(res.message);
          }
        },
        error: (err) => {
          throw new Error(err.message);
        },
        complete: () => {
          this.getProjects();
          this.closemodal();
        },
      });
    } else {
      this.projectForm.markAllAsTouched();
      return;
    }
  }

  deleteprojectpopup(id: number) {
    this.detetedprojectid = id;
    this.deleteprojectmodal.show();
  }

  deleteproject() {
    this.projectManagementService
      .deleteProject(this.detetedprojectid ?? 0, this.userDetails.id)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.toastr.success(res.message);
          } else {
            this.toastr.error(res.message);
          }
        },
        error: (err) => {
          throw new Error(err.message);
        },
        complete: () => {
          this.getProjects();
          this.deleteprojectmodal.hide();
        },
      });
  }

  isInvalid(controlName: string): boolean {
    const control = this.projectForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
