import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserShiftLogResponse } from '../models/DashBoardResponseModel';

@Injectable({
  providedIn: 'root',
})
export class DashBoardService {
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
      null, // <-- No request body, so pass `null`
      { headers, withCredentials: true } // <-- Correct place for headers and credentials
    );
  }
}
