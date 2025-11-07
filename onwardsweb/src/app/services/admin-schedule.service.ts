import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminSchedule, AdminScheduleModel, Company } from '../models/admin-schedule.model';

@Injectable({
  providedIn: 'root',
})
export class AdminScheduleService {
  private api = 'https://localhost:7255/api/AdminSchedule';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {}

  getSchedules(): Observable<AdminSchedule[]> {
    return this.http.get<AdminSchedule[]>(`${this.api}/get`, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  saveSchedule(model: AdminScheduleModel): Observable<void> {
    return this.http.post<void>(`${this.api}/save`, model, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  deleteSchedule(id: number, loginId: number): Observable<void> {
    return this.http.post<void>(
      `${this.api}/delete`,
      { id, loginId },
      { headers: this.headers, withCredentials: true }
    );
  }

  getCompaniesForAdminSchedule(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.api}/getcompaniesforadminschedule`, {
      headers: this.headers,
      withCredentials: true,
    });
  }
}
