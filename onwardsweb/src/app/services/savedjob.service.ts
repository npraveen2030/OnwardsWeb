import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { savedjobrequest, savedjobresponse } from '../models/savedjobmodel';

@Injectable({
  providedIn: 'root',
})
export class SavedJobService {
  private apiService = 'https://localhost:7255/api'; // Base URL

  constructor(private http: HttpClient) {}

  getSavedJobs(userId: number): Observable<savedjobresponse[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<savedjobresponse[]>(`${this.apiService}/SavedJob/get`, {
      headers,
      params: { UserId: userId.toString() },
      withCredentials: true,
    });
  }

  insertsavedjob(details: savedjobrequest): Observable<boolean> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<boolean>(`${this.apiService}/SavedJob/insert`, details, {
      headers,
      withCredentials: true,
    });
  }

  deletesavedjob(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiService}/SavedJob/delete/${id}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true,
    });
  }
}
