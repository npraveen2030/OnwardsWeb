import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PersonalDetailsModel } from '../models/personal-details.model';

@Injectable({
  providedIn: 'root',
})
export class PersonalDetailsService {
  private api = 'https://localhost:7255/api/PersonalDetails';

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {}

  /** SAVE Personal Details */
  savePersonalDetails(model: PersonalDetailsModel): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.api}/save`, model, {
      withCredentials: true,
    });
  }
}
