import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JobApplicationRequest, JobApplicationResponse } from '../models/jobapplication';

@Injectable({
  providedIn: 'root',
})
export class JobApplicationService {
  private apiService = 'https://localhost:7255/api'; // Base URL

  constructor(private http: HttpClient) {}

  /**
   * Get all job applications for a specific user
   */
  getJobApplications(userId: number): Observable<JobApplicationResponse[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<JobApplicationResponse[]>(`${this.apiService}/JobApplication/get`, {
      headers,
      params: { userId: userId.toString() },
      withCredentials: true,
    });
  }

  /**
   * Insert or update a job application
   */
  insertOrUpdateJobApplication(details: JobApplicationRequest): Observable<boolean> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<boolean>(`${this.apiService}/JobApplication/insertorupdate`, details, {
      headers,
      withCredentials: true,
    });
  }

  /**
   * Delete (withdraw) a job application by Id
   */
  deleteJobApplication(id: number, loginId: number): Observable<{ message: string }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.delete<{ message: string }>(
      `${this.apiService}/JobApplication/delete/${id}/${loginId}`,
      {
        headers,
        params: { loginId: loginId.toString() },
        withCredentials: true,
      }
    );
  }
}
