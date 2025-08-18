import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { UserShiftLogResponse } from '../models/DashBoardResponseModel';

@Injectable({
  providedIn: 'root',
})
export class LeaveManagementService {
  private apiService = 'https://localhost:7255/api'; // Base URL

  constructor(private http: HttpClient) {}

  getUserShiftLog(UserId: number): Observable<UserShiftLogResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<UserShiftLogResponse>(
      `${this.apiService}/UserShiftDetails/GetByUserId/${UserId}`,
      { headers, withCredentials: true }
    );
  }

  InsertOrUpdateUserShiftLog(userId: number): Observable<UserShiftLogResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<UserShiftLogResponse>(
      `${this.apiService}/UserShiftDetails/InsertOrUpdate/${userId}`,
      null,
      { headers, withCredentials: true }
    );
  }

  search(first: string, second: string): Observable<string[]> {
    const params = new HttpParams().set('first', first).set('second', second);
    return this.http
      .get<string[]>(`${this.apiService}/UserDetails/GetByUserName`, {
        params,
        withCredentials: true,
      })
      .pipe(
        // ensure we always return a list
        map((res) => res ?? []),
        catchError(() => of([]))
      );
  }
}
