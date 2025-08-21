import { Injectable } from '@angular/core';
import { ResignationType } from '../models/resignationTypeModel';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ResignationTypeService {
  private apiService = 'https://localhost:7255/api'; // Base URL
  constructor(private http: HttpClient) {}

  getResignationTypes(): Observable<ResignationType[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // return this.http.get<UserShiftLogResponse>(
    //   `${this.apiService}/UserShiftDetails/GetByUserId/${UserId}`,
    //   { headers, withCredentials: true }
    // );

    return this.http.get<ResignationType[]>(
      `${this.apiService}/ResignationType/GetResignationType`,
      {
        headers,
        withCredentials: true,
      }
    );
  }
}
