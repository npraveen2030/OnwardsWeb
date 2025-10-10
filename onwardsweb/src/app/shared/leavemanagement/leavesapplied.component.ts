import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { LeaveManagementService } from '../../services/leavemanagement.service';
import { LoginResponse } from '../../models/loginResponseModel';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { LeavesAndAttendance } from '../../models/leavemanagementResponseModel';

@Component({
  selector: 'app-leavesapplied',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './leavesapplied.component.html',
  styleUrl: './leavesapplied.component.scss',
})
export class LeavesappliedComponent {
  @Input() fullComponentRefresh!: () => void;
  userDetails!: LoginResponse;
  leavesandattendance: LeavesAndAttendance[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private leavemanagementservice: LeaveManagementService
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const userDetailsJson: string | null = sessionStorage.getItem('userDetails');

      if (userDetailsJson !== null) {
        this.userDetails = JSON.parse(userDetailsJson);
      }

      this.leavemanagementservice.GetLeavesAndAttendance(this.userDetails.id).subscribe({
        next: (res) => {
          this.leavesandattendance = res;
        },
      });
    }
  }
}
