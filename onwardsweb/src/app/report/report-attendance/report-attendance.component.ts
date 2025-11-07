import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ReportService } from '../../services/report.service';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-attendance',
  standalone: true,
  imports: [TableModule, FormsModule],
  templateUrl: './report-attendance.component.html',
  styleUrl: './report-attendance.component.scss',
})
export class ReportAttendanceComponent {
  attendanceReport: any;
  noDataMessage: string = '';
  @Input() attendance_startDate!: string;
  @Input() attendance_endDate!: string;
  @Input() setattendanceDates!: (startDate: string, endDate: string) => void;
  startDate: string = '';
  endDate: string = '';

  constructor(private reportsService: ReportService) {}

  ngOnInit(): void {
    this.noDataMessage = environment.noDataMessage;
    this.startDate = this.attendance_startDate;
    this.endDate = this.attendance_endDate;
    this.getAttendanceReports();
  }

  getAttendanceReports() {
    this.reportsService.getAttendanceRegularizationReport(this.startDate, this.endDate).subscribe({
      next: (res) => {
        this.attendanceReport = res;
      },
      error: (err) => {
        throw new Error(err.message);
      },
      complete: () => {
        this.setattendanceDates(this.startDate, this.endDate);
      },
    });
  }
}
