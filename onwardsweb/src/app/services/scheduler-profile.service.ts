import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SchedulerProfile, SchedulerProfileSaveModel } from '../models/schedulerprofile.model';

@Injectable({
  providedIn: 'root',
})
export class SchedulerProfileService {
  private api = 'https://localhost:7255/api/SchedulerProfile';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {}

  // ✔ GET profile
  getProfile(userId: number): Observable<SchedulerProfile> {
    return this.http.get<SchedulerProfile>(`${this.api}/get/${userId}`, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  // ✔ SAVE profile (insert or update)
  saveProfile(model: SchedulerProfileSaveModel): Observable<any> {
    return this.http.post<any>(`${this.api}/save`, model, {
      headers: this.headers,
      withCredentials: true,
    });
  }
}
