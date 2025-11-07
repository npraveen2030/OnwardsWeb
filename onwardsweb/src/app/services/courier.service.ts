import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Courier, CourierList, CourierUser } from '../models/CourierModel';

@Injectable({
  providedIn: 'root',
})
export class CourierService {
  private apiService = 'https://localhost:7255/api'; // base URL

  constructor(private http: HttpClient) {}

  getUsersForCourier(): Observable<CourierUser[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get<CourierUser[]>(`${this.apiService}/Courier/getusersforcourier`, {
      headers,
      withCredentials: true,
    });
  }

  insertOrUpdateCourier(courier: Courier): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(`${this.apiService}/Courier/insert-or-update`, courier, {
      headers,
      withCredentials: true,
    });
  }

  getCouriers(): Observable<CourierList[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get<CourierList[]>(`${this.apiService}/Courier/getcouriers`, {
      headers,
      withCredentials: true,
    });
  }
}
