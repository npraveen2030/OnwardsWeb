import { Component } from '@angular/core';
import { CareerService } from '../../services/career/career.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Referral } from '../../models/career/referral';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-referral-tracking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './referral-tracking.component.html',
  styleUrl: './referral-tracking.component.scss',
})
export class ReferralTrackingComponent {
  referralForm: FormGroup;
  referrals: Referral[] = [];
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private careerService: CareerService) {
    this.referralForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      country: ['', Validators.required],
      resume: [null],
    });

    this.careerService.referrals$.subscribe((data) => {
      this.referrals = data;
    });
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  submit() {
    if (this.referralForm.valid) {
      const formValue = this.referralForm.value;
      const newReferral: Referral = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        phone: formValue.phone,
        country: formValue.country,
        resume: this.selectedFile || undefined,
      };

      this.careerService.addReferral(newReferral);
      this.referralForm.reset();
      this.selectedFile = null;
    }
  }
}
