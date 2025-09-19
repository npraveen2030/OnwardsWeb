import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AllJobDetails,
  company,
  JobDetailsresponse,
  location,
  project,
  role,
  skill,
  user,
} from '../models/jobpostresponse';
import { jobdetails } from '../models/jobpostrequest';

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

  GetRoles(): Observable<role[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<role[]>(`${this.apiService}/JobPost/getroles`, {
      headers,
      withCredentials: true,
    });
  }

  GetProjects(): Observable<project[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<project[]>(`${this.apiService}/JobPost/getprojects`, {
      headers,
      withCredentials: true,
    });
  }

  Getlocations(): Observable<location[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<location[]>(`${this.apiService}/Location`, {
      headers,
      withCredentials: true,
    });
  }

  Getusers(): Observable<user[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<user[]>(`${this.apiService}/JobPost/getusers`, {
      headers,
      withCredentials: true,
    });
  }

  Getcompanies(): Observable<company[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<company[]>(`${this.apiService}/JobPost/getcompanies`, {
      headers,
      withCredentials: true,
    });
  }

  InsertJobDetails(details: jobdetails): Observable<{ message: string }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    debugger;
    return this.http.post<{ message: string }>(`${this.apiService}/JobDetails/insert`, details, {
      headers,
      withCredentials: true,
    });
  }

  UpdateJobDetails(details: jobdetails): Observable<{ message: string }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.put<{ message: string }>(`${this.apiService}/JobDetails/update`, details, {
      headers,
      withCredentials: true,
    });
  }

  DeleteJobDetails(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiService}/JobDetails/delete/${id}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true,
    });
  }

  GetAllJobDetails(userId?: number): Observable<AllJobDetails[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<AllJobDetails[]>(`${this.apiService}/JobDetails/getall`, {
      headers,
      withCredentials: true,
      params: userId ? { userId: userId.toString() } : {},
    });
  }

  GetJobDetilsById(id: number): Observable<JobDetailsresponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<JobDetailsresponse>(`${this.apiService}/JobDetails/${id}`, {
      headers,
      withCredentials: true,
    });
  }
}
