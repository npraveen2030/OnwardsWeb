import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ReportService } from '../../services/report.service';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { error } from 'console';

@Component({
  selector: 'app-report-leaves',
  standalone: true,
  imports: [TableModule, FormsModule],
  templateUrl: './report-leaves.component.html',
  styleUrl: './report-leaves.component.scss',
})
export class ReportLeavesComponent {
  leaves: any;
  noDataMessage: string = '';
  @Input() leaves_startDate!: string;
  @Input() leaves_endDate!: string;
  @Input() setleavesDate!: (startDate: string, endDate: string) => void;
  startDate: string = '';
  endDate: string = '';

  constructor(private reportsService: ReportService) {}

  ngOnInit(): void {
    this.noDataMessage = environment.noDataMessage;
    this.startDate = this.leaves_startDate;
    this.endDate = this.leaves_endDate;
    this.getleaveReports();
  }

  getleaveReports() {
    this.reportsService.GetLeaveReport(this.startDate, this.endDate).subscribe({
      next: (res) => {
        this.leaves = res;
      },
      error: (err) => {
        throw new Error(err.message);
      },
      complete: () => {
        this.setleavesDate(this.startDate, this.endDate);
      },
    });
  }
}
