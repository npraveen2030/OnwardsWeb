import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { UserShiftLogResponse } from '../models/DashBoardResponseModel';
import { LeaveTypes } from '../models/leavemanagementResponseModel';

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
}
