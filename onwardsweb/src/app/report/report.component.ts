import { Component } from '@angular/core';
import { ReportLeavesComponent } from './report-leaves/report-leaves.component';
import { ReportAttendanceComponent } from './report-attendance/report-attendance.component';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [ReportLeavesComponent, ReportAttendanceComponent],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
})
export class ReportComponent {
  activeTab: string = 'leaves';
  leaves_startDate: string = '';
  leaves_endDate: string = '';
  attendance_startDate: string = '';
  attendance_endDate: string = '';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  setleaveDates(startDate: string, endDate: string): void {
    this.leaves_startDate = startDate;
    this.leaves_endDate = endDate;
  }

  setattendanceDates(startDate: string, endDate: string): void {
    this.attendance_startDate = startDate;
    this.attendance_endDate = endDate;
  }
}
