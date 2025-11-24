import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminSchedule, AdminScheduleModel, Company } from '../models/admin-schedule.model';
import { UserScheduleProfile, UserScheduleTVP } from '../models/user-schedule.model';

@Injectable({
  providedIn: 'root',
})
export class UserScheduleService {
  private api = 'https://localhost:7255/api/UserSchedule';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {}

  getUserScheduleForScheduler(
    schedulerId: number,
    companyId: number,
    locationId: number
  ): Observable<UserScheduleProfile[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const params = new HttpParams()
      .set('schedulerId', schedulerId)
      .set('companyId', companyId)
      .set('locationId', locationId);

    return this.http.get<UserScheduleProfile[]>(`${this.api}/getschedule`, {
      headers,
      params,
      withCredentials: true,
    });
  }

  insertOrUpdateSchedule(data: UserScheduleTVP[]): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.api}/submit`, data, {
      headers: this.headers,
      withCredentials: true,
    });
  }
}
