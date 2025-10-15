import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { LeaveManagementService } from '../../../../services/leavemanagement.service';
import { LoginResponse } from '../../../../models/loginResponseModel';
import { AttendanceRegularization } from '../../../../models/leavemanagementResponseModel';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-managerattendance',
  standalone: true,
  imports: [TableModule, DatePipe, TooltipModule, CommonModule, ReactiveFormsModule],
  templateUrl: './managerattendance.component.html',
  styleUrl: './managerattendance.component.scss',
})
export class ManagerattendanceComponent {
  attendanceregularization: AttendanceRegularization[] = [];
  selectedRecords: any[] = [];
  noDataMessage: any;
  userDetails!: LoginResponse;
  isApprove: boolean = true;
  updateconfirmationmodal!: any;
  updateRequestForm: FormGroup;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private leavemanagementservice: LeaveManagementService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.updateRequestForm = this.fb.group({
      action: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const userDetailsJson: string | null = sessionStorage.getItem('userDetails');

      if (userDetailsJson !== null) {
        this.userDetails = JSON.parse(userDetailsJson);
      }

      this.noDataMessage = environment.noDataMessage;
      this.getattendanceregularization();
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const bootstrap = (window as any).bootstrap;
      const updateconfirmationmodalEl = document.getElementById('updateconfirmation');

      if (updateconfirmationmodalEl && bootstrap?.Modal) {
        this.updateconfirmationmodal = new bootstrap.Modal(updateconfirmationmodalEl);
      }
    }
  }

  getattendanceregularization() {
    this.leavemanagementservice
      .GetAttendanceRegularizationByManagerId(this.userDetails.id)
      .subscribe({
        next: (res) => {
          this.attendanceregularization = res;
        },
      });
  }

  showConfirmationPopup(isApprove: boolean) {
    this.isApprove = isApprove;
    this.updateconfirmationmodal.show();
  }

  updateAttendanceRegularization() {
    if (this.updateRequestForm.valid) {
      const payload = this.selectedRecords.map((sel) => {
        return {
          id: sel.id,
          userId: sel.userId,
          startDate: sel.startDate,
          endDate: sel.endDate,
          action: this.updateRequestForm.get('action')?.value,
          loginId: this.userDetails.id,
          statusId: this.isApprove ? 2 : 3, // 2=>Approved, 3=>Rejected
        };
      });

      this.leavemanagementservice.UpdateAttendanceRegularization(payload).subscribe({
        next: (res) => {
          if (res.success) {
            this.getattendanceregularization();
            this.updateRequestForm.reset();
            this.updateconfirmationmodal.hide();
            this.toastr.success('Attendance updated successfully');
          } else {
            this.updateRequestForm.reset();
            this.updateconfirmationmodal.hide();
            this.toastr.error('Attendance Regularization Failed');
          }
        },
        error: (err) => {
          throw new Error(err.message);
        },
      });
    } else {
      this.updateRequestForm.markAllAsTouched();
      return;
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.updateRequestForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
