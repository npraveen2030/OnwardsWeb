import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import {
  calendarevent,
  LeavesAndAttendance,
  LeaveTypes,
} from '../models/leavemanagementResponseModel';
import {
  AttendanceRegularizationrequest,
  LeaveRequest,
} from '../models/leavemanagementRequestModel';

@Injectable({
  providedIn: 'root',
})
export class LeaveManagementService {
  private apiService = 'https://localhost:7255/api'; // Base URL

  constructor(private http: HttpClient) {}

  GetLeaveTypes(userId: number): Observable<LeaveTypes[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const params = new HttpParams().set('userId', userId.toString());

    return this.http.get<LeaveTypes[]>(`${this.apiService}/UserLeaveApplied/getleavetypes`, {
      headers,
      params,
      withCredentials: true,
    });
  }

  GetLeavesAndAttendance(userId: number): Observable<LeavesAndAttendance[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const params = new HttpParams().set('userId', userId.toString());

    return this.http.get<LeavesAndAttendance[]>(
      `${this.apiService}/UserLeaveApplied/getleaveandattendance`,
      {
        headers,
        params,
        withCredentials: true,
      }
    );
  }

  GetCalanderEvents(userId: number, month: number, year: number): Observable<calendarevent[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('month', month.toString())
      .set('year', year.toString());

    return this.http.get<calendarevent[]>(`${this.apiService}/UserLeaveApplied/getcalenderevents`, {
      headers,
      params,
      withCredentials: true,
    });
  }

  InsertLeaveRequest(
    formValues: LeaveRequest,
    file: File | null
  ): Observable<{ success: string; message: string }> {
    const formData = new FormData();

    // append normal fields
    formData.append('LoginId', formValues.loginId.toString() ?? '');
    formData.append('UserId', formValues.userId.toString() ?? '');
    formData.append('LeaveTypeId', formValues.leaveTypeId.toString());
    formData.append('Year', new Date(formValues.startDate).getFullYear().toString());
    formData.append('StartDate', formValues.startDate);
    formData.append('EndDate', formValues.endDate);
    formData.append('PhoneNo', formValues.phoneNo);
    formData.append('IsFullDay', formValues.isFullDay.toString());
    formData.append('LocationId', formValues.locationId?.toString() ?? '0');
    formData.append('Reason', formValues.reason ?? '');
    formData.append('LeaveStatusId', formValues.leaveStatusId.toString());
    formData.append('NotifiedUserId', formValues.notifiedUserId.toString() ?? '');

    if (file !== null) {
      formData.append('Data', file, file.name);
    }

    return this.http.post<{ success: string; message: string }>(
      `${this.apiService}/UserLeaveApplied/insert`,
      formData,
      { withCredentials: true }
    );
  }

  InsertAttendanceRegularization(
    payload: AttendanceRegularizationrequest
  ): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.apiService}/AttendanceRegularization/insert`,
      payload,
      { withCredentials: true }
    );
  }
}
