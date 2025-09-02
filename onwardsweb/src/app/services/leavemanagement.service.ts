import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { UserShiftLogResponse } from '../models/DashBoardResponseModel';
import { LeaveTypes } from '../models/leavemanagementResponseModel';
import { LeaveRequest } from '../models/leavemanagementRequestModel';

@Injectable({
  providedIn: 'root',
})
export class LeaveManagementService {
  private apiService = 'https://localhost:7255/api'; // Base URL

  constructor(private http: HttpClient) {}

  search(first: string, second: string): Observable<string[]> {
    const params = new HttpParams().set('first', first).set('second', second);
    return this.http
      .get<string[]>(`${this.apiService}/UserDetails/GetByUserName`, {
        params,
        withCredentials: true,
      })
      .pipe(
        map((res) => res ?? []),
        catchError(() => of([]))
      );
  }

  GetLeaveTypes(): Observable<LeaveTypes[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<LeaveTypes[]>(`${this.apiService}/UserLeaveApplied/getleavetypes`, {
      headers,
      withCredentials: true,
    });
  }

  InsertOrUpdateLeaveRequest(
    formValues: LeaveRequest,
    file: File | null
  ): Observable<{ message: string }> {
    const formData = new FormData();

    // append normal fields
    formData.append('LoginId', formValues.loginId.toString() ?? '');
    formData.append('UserId', formValues.userId.toString() ?? '');
    formData.append('Id', formValues.id?.toString() ?? '');
    formData.append('LeaveTypeId', formValues.leaveTypeId.toString());
    formData.append('Year', new Date(formValues.startDate).getFullYear().toString());
    formData.append('StartDate', formValues.startDate);
    formData.append('EndDate', formValues.endDate);
    formData.append('NoOfDays', formValues.noOfDays?.toString() ?? '0');
    formData.append('LocationId', formValues.locationId?.toString() ?? '0');
    formData.append('Reason', formValues.reason ?? '');
    formData.append('Action', formValues.action ?? '');
    formData.append('FileName', file?.name ?? '');
    formData.append('LeaveStatusId', formValues.leaveStatusId.toString());

    if (file !== null) {
      formData.append('Data', file, file.name);
    }

    return this.http.post<{ message: string }>(
      `${this.apiService}/UserLeaveApplied/insertorupdate`,
      formData,
      { withCredentials: true }
    );
  }
}
