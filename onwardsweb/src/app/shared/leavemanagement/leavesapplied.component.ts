import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { LeaveManagementService } from '../../services/leavemanagement.service';
import { LoginResponse } from '../../models/loginResponseModel';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import {
  AttendanceRegularizationDetails,
  LeavesAndAttendance,
  UserLeaveAppliedDetails,
} from '../../models/leavemanagementResponseModel';
import { SiblingCommunicationService } from '../../services/SiblingCommunication.service';
import { Subscription } from 'rxjs';
import {
  AttendanceRegularizationUpdateRequest,
  LeaveUpdateRequest,
} from '../../models/leavemanagementRequestModel';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-leavesapplied',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './leavesapplied.component.html',
  styleUrl: './leavesapplied.component.scss',
})
export class LeavesappliedComponent {
  @Input() fullComponentRefresh!: () => void;
  userDetails!: LoginResponse;
  leavesandattendance: LeavesAndAttendance[] = [];
  private sub!: Subscription;
  cancelrequestmodal!: any;
  isLeave: boolean = true;
  requestId?: number;
  leaveTypeId?: number;
  duration?: number;
  startDate?: string;
  endDate?: string;
  isLeaveView: boolean = false;
  leaveDetails: UserLeaveAppliedDetails | null = null;
  attendanceDetails: AttendanceRegularizationDetails | null = null;
  detailsModal!: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private leavemanagementservice: LeaveManagementService,
    private commService: SiblingCommunicationService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const userDetailsJson: string | null = sessionStorage.getItem('userDetails');

      if (userDetailsJson !== null) {
        this.userDetails = JSON.parse(userDetailsJson);
      }

      this.sub = this.commService.triggerAction$.subscribe((action) => {
        if (action === 'refetchleavesandattendance') {
          this.getleavesandattendances();
        }
      });

      this.getleavesandattendances();
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const bootstrap = (window as any).bootstrap;
      const cancelrequestmodalEl = document.getElementById('cancelrequest');
      const detailsmodalEl = document.getElementById('detailsModal');

      if (cancelrequestmodalEl && bootstrap?.Modal) {
        this.cancelrequestmodal = new bootstrap.Modal(cancelrequestmodalEl);
      }

      if (detailsmodalEl && bootstrap?.Modal) {
        this.detailsModal = new bootstrap.Modal(detailsmodalEl);
      }
    }
  }

  getleavesandattendances(): void {
    this.leavemanagementservice.GetLeavesAndAttendance(this.userDetails.id).subscribe({
      next: (res) => {
        this.leavesandattendance = res;
      },
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  cancelrequestpopup(
    isLeave: boolean,
    startDate: string,
    endDate: string,
    id?: number,
    leaveTypeId?: number,
    noOfDays?: number
  ) {
    this.isLeave = isLeave;
    this.requestId = id;
    this.leaveTypeId = leaveTypeId;
    this.duration = noOfDays;
    this.startDate = startDate;
    this.endDate = endDate;

    this.cancelrequestmodal.show();
  }

  updateleaves() {
    const payload: LeaveUpdateRequest[] = [
      {
        id: this.requestId ?? 0,
        userId: this.userDetails.id,
        loginId: this.userDetails.id,
        leaveTypeId: this.leaveTypeId ?? 0,
        startDate: this.startDate ?? '',
        endDate: this.endDate ?? '',
        noOfDays: this.duration ?? 0,
        leaveStatusId: 4, // 4 => Cancelled
      },
    ];

    this.leavemanagementservice.UpdateLeaves(payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.getleavesandattendances();
          this.cancelrequestmodal.hide();
          this.commService.trigger('refetchcalendercontrol');
          this.toastr.success('Leave Cancelled Successfully');
        } else {
          console.log(res);
        }
      },
    });
  }

  updateattendance() {
    const payload: AttendanceRegularizationUpdateRequest[] = [
      {
        id: this.requestId ?? 0,
        userId: this.userDetails.id,
        loginId: this.userDetails.id,
        startDate: this.startDate ?? '',
        endDate: this.endDate ?? '',
        statusId: 4, // 4 => Cancelled
      },
    ];

    this.leavemanagementservice.UpdateAttendanceRegularization(payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.getleavesandattendances();
          this.commService.trigger('refetchcalendercontrol');
          this.cancelrequestmodal.hide();
          this.toastr.success('Attendance Cancelled Successfully');
        } else {
          console.log(res);
        }
      },
    });
  }

  viewLeaveDetails(id: number): void {
    this.isLeaveView = true;
    this.attendanceDetails = null; // Clear other details
    this.leavemanagementservice.GetUserLeaveAppliedById(id).subscribe({
      next: (data) => {
        this.leaveDetails = data;
        this.detailsModal.show();
      },
      error: (err) => console.error('Error fetching leave details:', err),
    });
  }

  viewAttendanceDetails(id: number): void {
    this.isLeaveView = false;
    this.leaveDetails = null; // Clear other details
    this.leavemanagementservice.GetAttendanceRegularizationById(id).subscribe({
      next: (data) => {
        this.attendanceDetails = data;
        this.detailsModal.show();
      },
      error: (err) => console.error('Error fetching attendance details:', err),
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
}
