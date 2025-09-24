import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private baseUrl = 'https://localhost:7255/api';

  constructor(private http: HttpClient) {}

  sendEmail(toEmail: string, subject: string, body: string) {
    const emailData = { toEmail, subject, body };
    return this.http.post(`${this.baseUrl}/email/send`, emailData);
  }
}
