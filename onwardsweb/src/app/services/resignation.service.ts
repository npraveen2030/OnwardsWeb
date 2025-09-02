import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resignation } from '../models/Resignation';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { approveResignations } from '../models/ApproveResignationRequestModel';

@Injectable({
  providedIn: 'root',
})
export class ResignationService {
  private apiService = 'https://localhost:7255/api'; // Base URL
  constructor(private http: HttpClient) {}

  getResignationDetailsByUserId(userId: number | null): Observable<Resignation> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<Resignation>(
      `${this.apiService}/Resignation/GetResignationDetailsByUserId/${userId}`,
      {
        headers,
        withCredentials: true,
      }
    );
  }

  insertorupdateResignation(resignationForm: FormGroup): Observable<{ message: string }> {
    const formData = new FormData();

    Object.keys(resignationForm.controls).forEach((key) => {
      if (key !== 'attachmentFile') {
        const value = resignationForm.get(key)?.value;
        if (value !== null && value !== undefined) {
          // Capitalize first letter to match C# model
          const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
          formData.append(pascalKey, value);
        }
      }
    });

    // Add file separately
    if (resignationForm.get('attachmentFile')?.value) {
      formData.append('AttachmentFile', resignationForm.get('attachmentFile')?.value);
    }

    return this.http.post<{ message: string }>(
      `${this.apiService}/Resignation/insertorupdate`,
      formData
    );
  }

  getResignationsByUserId(userId: number): Observable<Resignation[]> {
    return this.http.get<Resignation[]>(
      `${this.apiService}/Resignation/GetAllResignations/${userId}`
    );
  }

  approveResignations(approvals: approveResignations): Observable<any> {
    return this.http.post(`${this.apiService}/Resignation/approve`, approvals);
  }
}
