import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { TableModule } from 'primeng/table';
import { LeaveManagementService } from '../../../../services/leavemanagement.service';
import { ToastrService } from 'ngx-toastr';
import { LoginResponse } from '../../../../models/loginResponseModel';
import { UserLeaveApplied } from '../../../../models/leavemanagementResponseModel';
import { environment } from '../../../../../environments/environment';
import { TooltipModule } from 'primeng/tooltip';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-managerleaves',
  standalone: true,
  imports: [TableModule, DatePipe, TooltipModule, ReactiveFormsModule, CommonModule],
  templateUrl: './managerleaves.component.html',
  styleUrl: './managerleaves.component.scss',
})
export class ManagerleavesComponent {
  userleaveapplied: UserLeaveApplied[] = [];
  selectedRecords: any[] = [];
  noDataMessage: any;
  userDetails!: LoginResponse;
  isApprove: boolean = true;
  updateRequestForm: FormGroup;
  updateconfirmationmodal!: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private leavemanagementservice: LeaveManagementService,
    private toastr: ToastrService,
    private fb: FormBuilder
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
      this.getuserleaveapplied();
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const bootstrap = (window as any).bootstrap;
      const updateconfirmationmodalEl = document.getElementById('updateconfirmationleave');

      if (updateconfirmationmodalEl && bootstrap?.Modal) {
        this.updateconfirmationmodal = new bootstrap.Modal(updateconfirmationmodalEl);
      }
    }
  }

  getuserleaveapplied() {
    this.leavemanagementservice.GetUserLeaveAppliedByManagerId(this.userDetails.id).subscribe({
      next: (res) => {
        this.userleaveapplied = res;
      },
    });
  }

  downloadDocument(leaveId: number, fileName: string) {
    this.leavemanagementservice.downloadUserLeaveAppliedDocument(leaveId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName || `LeaveDocument_${leaveId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        alert('Error downloading document');
      },
    });
  }

  showUpdatePopup(isApprove: boolean) {
    this.isApprove = isApprove;
    this.updateconfirmationmodal.show();
  }

  updateUserLeaveApplied() {
    if (this.updateRequestForm.valid) {
      const payload = this.selectedRecords.map((sel) => {
        return {
          id: sel.id,
          userId: sel.userId,
          leaveTypeId: sel.leaveTypeId,
          startDate: sel.startDate,
          endDate: sel.endDate,
          noOfDays: sel.noOfDays,
          action: this.updateRequestForm.get('action')?.value,
          loginId: this.userDetails.id,
          leaveStatusId: this.isApprove ? 2 : 3, // 2=>Approved, 3=>Rejected
        };
      });

      this.leavemanagementservice.UpdateLeaves(payload).subscribe({
        next: (res) => {
          if (res.success) {
            this.getuserleaveapplied();
            this.updateRequestForm.reset();
            this.updateconfirmationmodal.hide();
            this.toastr.success('Leave updated successfully');
          } else {
            this.updateRequestForm.reset();
            this.updateconfirmationmodal.hide();
            this.toastr.error('Leave Updation Failed');
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
