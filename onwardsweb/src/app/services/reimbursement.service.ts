import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReimbursementService {
  constructor(private http: HttpClient) {}

  // getExitInterview(): Observable<ExitInterview[]> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   });

  //   return this.http
  //     .get<{ questions: ExitInterview[] }>(`${this.apiService}/ExitInterview/get`, {
  //       headers,
  //       withCredentials: true,
  //     })
  //     .pipe(map((response) => response.questions));
  // }

  // InsertOrUpdateReimbursement(Answers: Reimbur): Observable<{ message: string }> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   });

  //   return this.http.post<{ message: string }>(
  //     `${this.apiService}/ExitInterview/insertorupdateanswers`,
  //     Answers,
  //     { headers, withCredentials: true }
  //   );
  // }
}
