import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/login-request';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginResponse } from '../models/login-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
 private apiService = 'https://localhost:7255/api'; // Base URL

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const payload: LoginRequest = {
      employeeCode: username,
      password: password
    };

    return this.http.post<LoginResponse>(`${this.apiService}/auth/ValidateLogin`, payload, { headers });
  }
}
