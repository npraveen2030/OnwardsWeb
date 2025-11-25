import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SchedulerDetails } from '../models/scheduler-details.model';

@Injectable({
  providedIn: 'root',
})
export class SchedulerSkillsService {
  private api = 'https://localhost:7255/api/SchedulerSkills';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {}

  getSchedulersBySkills(skills: string[]): Observable<SchedulerDetails[]> {
    return this.http.post<SchedulerDetails[]>(`${this.api}/getschedulersbyskills`, skills, {
      headers: this.headers,
      withCredentials: true,
    });
  }
}
