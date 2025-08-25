import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resignation } from '../models/Resignation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResignationService {
  private apiService = 'https://localhost:7255/api'; // Base URL
  constructor(private http: HttpClient) {}

  getResignationDetailsByUserId(userId: number | null): Observable<Resignation> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<Resignation>(
      `${this.apiService}/Resignation/GetResignationDetailsByUserId/${userId}`,
      {
        headers,
        withCredentials: true,
      }
    );
  }

  insertResignation(resignation: Resignation): Observable<Resignation> {
    return this.http.post<Resignation>(`${this.apiService}/Resignation/Insert`, resignation);
  }

  updateResignation(resignation: Resignation): Observable<Resignation> {
    return this.http.post<Resignation>(`${this.apiService}/Resignation/Update`, resignation);
  }
}
