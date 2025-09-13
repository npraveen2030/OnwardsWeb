import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { skill } from '../models/jobpostresponse';

@Injectable({
  providedIn: 'root',
})
export class JobPostService {
  private apiService = 'https://localhost:7255/api'; // Base URL

  constructor(private http: HttpClient) {}

  GetSkills(): Observable<skill[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<skill[]>(`${this.apiService}/JobPost/getskills`, {
      headers,
      withCredentials: true,
    });
  }
}
