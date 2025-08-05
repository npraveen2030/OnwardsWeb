import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/loginRequestModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginResponse } from '../models/loginResponseModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiService = 'https://localhost:7255/api'; // Base URL

  constructor(private http: HttpClient) {}

  login(
    username: string,
    password: string
  ): Observable<{ userDetails: LoginResponse }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const payload: LoginRequest = {
      employeeCode: username,
      password: password,
    };

    return this.http.post<{ userDetails: LoginResponse }>(
      `${this.apiService}/auth/ValidateLogin`,
      payload,
      { headers, withCredentials: true }
    );
  }

  signout(): Observable<{ message: string }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<{ message: string }>(
      `${this.apiService}/auth/logout`,
      null,
      { headers, withCredentials: true }
    );
  }
}
