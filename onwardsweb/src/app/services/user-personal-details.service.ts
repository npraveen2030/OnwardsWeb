import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IdValueDto, PersonalDetailsModel } from '../models/personal-details.model';

@Injectable({
  providedIn: 'root',
})
export class UserPersonalDetailsService {
  private api = 'https://localhost:7255/api/UserPersonalDetails';

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {}

  getUserPersonalDetails(userId: number): Observable<PersonalDetailsModel> {
    return this.http.get<PersonalDetailsModel>(`${this.api}/details/${userId}`, {
      withCredentials: true,
    });
  }

  // ------------------------------------------------------------
  //                 DROPDOWN API CALLS
  // ------------------------------------------------------------

  /** Nationality Options */
  getNationalityOptions(): Observable<IdValueDto[]> {
    return this.http.get<IdValueDto[]>(`${this.api}/nationality-options`, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  /** Yes/No Options → Differently Abled, Blood Donor, etc. */
  getYesNoOptions(): Observable<IdValueDto[]> {
    return this.http.get<IdValueDto[]>(`${this.api}/yesno-options`, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  /** Vaccination Status Dropdown */
  getVaccinationStatusOptions(): Observable<IdValueDto[]> {
    return this.http.get<IdValueDto[]>(`${this.api}/vaccination-options`, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  /** Blood Groups Dropdown */
  getBloodGroups(): Observable<IdValueDto[]> {
    return this.http.get<IdValueDto[]>(`${this.api}/bloodgroups`, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  getGenderOptions() {
    return this.http.get<IdValueDto[]>(`${this.api}/gender-options`, {
      headers: this.headers,
      withCredentials: true,
    });
  }
}
