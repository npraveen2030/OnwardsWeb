import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReferralTrackingRequest, ReferralTrackingResponse } from '../models/referraltrackingmodel';

@Injectable({
  providedIn: 'root',
})
export class ReferralTrackingService {
  private apiService = 'https://localhost:7255/api'; // Base URL

  constructor(private http: HttpClient) {}

  // Insert referral (with FormData for file upload)
  insertReferral(referral: ReferralTrackingRequest): Observable<{ message: string }> {
    const formData = new FormData();

    formData.append('JobId', referral.jobId.toString());
    formData.append('FirstName', referral.firstName);
    formData.append('LastName', referral.lastName);
    formData.append('Email', referral.email);
    if (referral.phone) {
      formData.append('Phone', referral.phone);
    }
    formData.append('LocationId', referral.locationId.toString());
    formData.append('FileData', referral.fileData); // File object
    formData.append('StatusId', referral.statusId.toString());
    formData.append('LoginId', referral.loginId.toString());

    return this.http.post<{ message: string }>(
      `${this.apiService}/ReferralTracking/insert`,
      formData,
      { withCredentials: true }
    );
  }

  // Get referrals by creator
  getReferrals(createdBy: number): Observable<ReferralTrackingResponse[]> {
    return this.http.get<ReferralTrackingResponse[]>(
      `${this.apiService}/ReferralTracking/get/${createdBy}`,
      { withCredentials: true }
    );
  }

  getReferralDocument(id: number) {
    return this.http.get<Blob>(`${this.apiService}/ReferralTracking/getdocument/${id}`, {
      responseType: 'blob' as 'json',
      withCredentials: true,
      observe: 'response',
    });
  }

  // Delete referral
  deleteReferral(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiService}/ReferralTracking/delete/${id}`,
      { withCredentials: true }
    );
  }
}
