import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResignationReason } from '../models/resignationReasonModel';

@Injectable({
  providedIn: 'root',
})
export class ResignationReasonService {
  private apiService = 'https://localhost:7255/api'; // Base URL
  constructor(private http: HttpClient) {}

  // return this.http.get<UserShiftLogResponse>(
  //   `${this.apiService}/UserShiftDetails/GetByUserId/${UserId}`,
  //   { headers, withCredentials: true }
  // );

  getResignationReason(): Observable<ResignationReason[]> {
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<ResignationReason[]>(`${this.apiService}/ResignationReason/GetResignationReason`, {
      headers,
      withCredentials: true,
    });
  }
}
