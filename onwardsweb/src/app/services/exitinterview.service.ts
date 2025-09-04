import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ExitInterview, UserExitInterview } from '../models/exitinterviewResopnseModel';

@Injectable({
  providedIn: 'root',
})
export class ExitInterviewService {
  private apiService = 'https://localhost:7255/api'; // Base URL

  constructor(private http: HttpClient) {}

  getExitInterview(): Observable<ExitInterview[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .get<{ questions: ExitInterview[] }>(`${this.apiService}/ExitInterview/get`, {
        headers,
        withCredentials: true,
      })
      .pipe(map((response) => response.questions));
  }

  InsertOrUpdateUserExitInterview(Answers: UserExitInterview[]): Observable<{ message: string }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<{ message: string }>(
      `${this.apiService}/ExitInterview/insertorupdateanswers`,
      Answers,
      { headers, withCredentials: true }
    );
  }
}
