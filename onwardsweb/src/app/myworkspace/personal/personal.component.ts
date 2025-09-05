import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './personal.component.html',
  styleUrl: './personal.component.scss',
})
export class PersonalComponent {
  PersonalInformationForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.PersonalInformationForm = this.fb.group({
      // Basic Info
      firstName: ['', Validators.required],
      middleName: ['', Validators.required],
      lastName: ['', Validators.required],
      personalEmailId: ['', [Validators.required, Validators.email]],

      // Additional Details
      nationality: ['', Validators.required],
      differentlyAbled: ['', Validators.required],
      vaccinationStatus: ['', Validators.required],
      bloodGroup: ['', Validators.required],
      bloodDonor: ['', Validators.required],
      panNo: ['', Validators.required],
      aadharNo: ['', Validators.required],

      // Present Address
      presentDoorNo: ['', Validators.required],
      presentAddressLine: ['', Validators.required],
      presentState: ['', Validators.required],
      presentPinCode: ['', Validators.required],

      sameAddress: [false],

      // Permanent Address (Flat fields)
      permanentDoorNo: ['', Validators.required],
      permanentAddressLine: ['', Validators.required],
      permanentState: ['', Validators.required],
      permanentPinCode: ['', Validators.required],

      // Compliance
      pfNo: ['', Validators.required],
      uanNo: ['', Validators.required],
      esicNo: ['', Validators.required],

      // Bank Details
      bankAccountNumber: ['', Validators.required],
      accountHolderName: ['', Validators.required],
      ifsc: ['', Validators.required],
      bankName: ['', Validators.required],
      branchName: ['', Validators.required],

      // Emergency Contact
      contactName: ['', Validators.required],
      contactRelationship: ['', Validators.required],
      primaryContactNumber: ['', Validators.required],
      secondaryContactNumber: [''],
    });

    this.PersonalInformationForm.get('sameAddress')?.valueChanges.subscribe((checked: boolean) => {
      if (checked) {
        this.copyPresentAddressToPermanent();
      }
    });
  }

  copyPresentAddressToPermanent(): void {
    this.PersonalInformationForm.patchValue({
      permanentDoorNo: this.PersonalInformationForm.get('presentDoorNo')?.value,
      permanentAddressLine: this.PersonalInformationForm.get('presentAddressLine')?.value,
      permanentState: this.PersonalInformationForm.get('presentState')?.value,
      permanentPinCode: this.PersonalInformationForm.get('presentPinCode')?.value,
    });
  }

  isInvalid(control: any): boolean {
    return control?.invalid && (control?.dirty || control?.touched);
  }

  onSubmit(): void {
    if (this.PersonalInformationForm.valid) {
      console.log('Form Submitted', this.PersonalInformationForm.value);
    } else {
      console.log('Form is invalid');
      this.PersonalInformationForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.PersonalInformationForm.reset();
  }
}
