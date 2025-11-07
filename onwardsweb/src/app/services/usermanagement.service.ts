import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { usermanagementresponse, UserRequest } from '../models/usermanagementModel';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private apiService = 'https://localhost:7255/api'; // Base URL

  constructor(private http: HttpClient) {}

  InsertOrUpdateUser(user: UserRequest) {
    return this.http.post<{ success: string; message: string }>(
      `${this.apiService}/UserDetails/insertorupdate`,
      user
    );
  }

  DeleteUser(id: number, loginId: number): Observable<{ message: string }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.delete<{ message: string }>(
      `${this.apiService}/UserDetails/${id}/${loginId}`,
      { headers, withCredentials: true }
    );
  }

  GetUsersForAdmin(): Observable<usermanagementresponse[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<usermanagementresponse[]>(
      `${this.apiService}/UserDetails/getusersforadmin`,
      {
        headers,
        withCredentials: true,
      }
    );
  }

  GetAllGrades(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get<any[]>(`${this.apiService}/UserDetails/grades`, {
      headers,
      withCredentials: true,
    });
  }

  GetAllDepartments(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get<any[]>(`${this.apiService}/UserDetails/departments`, {
      headers,
      withCredentials: true,
    });
  }

  GetAllTypes(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get<any[]>(`${this.apiService}/UserDetails/types`, {
      headers,
      withCredentials: true,
    });
  }

  GetAllShifts(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<any[]>(`${this.apiService}/UserDetails/shifts`, {
      headers,
      withCredentials: true,
    });
  }

  checkDuplicateEmail(email: string, userId?: number): Observable<boolean> {
    const body = { email, userId };
    return this.http
      .post<{ isUnique: boolean }>(`${this.apiService}/UserDetails/DuplicateEmailCheck`, body)
      .pipe(
        map((response) => !!response.isUnique),
        catchError(() => of(false))
      );
  }
}
