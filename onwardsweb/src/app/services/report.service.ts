import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AttendanceRegularizationReport, LeaveReport } from '../models/reportsmodel';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiService = 'https://localhost:7255/api'; // Base URL

  constructor(private http: HttpClient) {}

  GetLeaveReport(startDate: string, endDate: string): Observable<LeaveReport[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    console.log(startDate, endDate);

    return this.http.get<LeaveReport[]>(
      `${this.apiService}/Reports/leave-report?startDate=${startDate}&endDate=${endDate}`,
      { headers, withCredentials: true }
    );
  }

  getAttendanceRegularizationReport(
    startDate: string,
    endDate: string
  ): Observable<AttendanceRegularizationReport[]> {
    return this.http.get<AttendanceRegularizationReport[]>(
      `${this.apiService}/Reports/get-attendance-regularization-report?startDate=${startDate}&endDate=${endDate}`,
      { withCredentials: true }
    );
  }
}
