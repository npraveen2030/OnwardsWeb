import { Component } from '@angular/core';
import { EmailService } from '../services/email.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-send-email',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Send Email</h2>
    <form (ngSubmit)="send()">
      <input [(ngModel)]="toEmail" placeholder="Recipient Email" name="toEmail" required />
      <input [(ngModel)]="subject" placeholder="Subject" name="subject" required />
      <textarea [(ngModel)]="body" placeholder="Body" name="body" required></textarea>
      <button type="submit">Send Email</button>
    </form>
    <p *ngIf="message">{{ message }}</p>
  `,
})
export class SendEmailComponent {
  toEmail = '';
  subject = '';
  body = '';
  message = '';

  constructor(private emailService: EmailService) {}

  send() {
    this.emailService.sendEmail(this.toEmail, this.subject, this.body).subscribe({
      next: () => (this.message = 'Email sent successfully!'),
      error: (err) => (this.message = 'Error sending email: ' + err.message),
    });
  }
}
