import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PersonalDetailsService } from '../../services/personal-details.service';
import { IdValueDto } from '../../models/personal-details.model';
import { UserPersonalDetailsService } from '../../services/user-personal-details.service';
import { PersonalDetailsModel } from '../../models/personal-details.model';
import { LoginResponse } from '../../models/loginResponseModel';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './personal.component.html',
  styleUrl: './personal.component.scss',
})
export class PersonalComponent {
  PersonalInformationForm!: FormGroup;

  nationalities: IdValueDto[] = [];
  yesNoList: IdValueDto[] = [];
  vaccinationOptions: IdValueDto[] = [];
  bloodGroups: IdValueDto[] = [];
  genders: IdValueDto[] = [];
  userDetails!: LoginResponse;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private userpersonalDetailsService: UserPersonalDetailsService,
    private personalDetailsService: PersonalDetailsService
  ) {}

  ngOnInit(): void {
    // ************** FORM CONTROLS **************
    this.PersonalInformationForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: ['', Validators.required],
      lastName: ['', Validators.required],

      personalEmailID: ['', [Validators.required, Validators.email]],
      primaryContactNumber_BasicDetails: ['', Validators.required],
      gender: ['', Validators.required],
      fatherOrHusbandName: ['', Validators.required],
      dob: ['', Validators.required],

      nationality: ['', Validators.required],
      differentlyAbled: ['', Validators.required],
      vaccinationStatus: ['', Validators.required],
      bloodGroup: ['', Validators.required],
      bloodDonor: ['', Validators.required],

      panNumber: ['', Validators.required],
      aadhaarCardno: ['', Validators.required],

      presentDoorNo: ['', Validators.required],
      presentAddressLine: ['', Validators.required],
      presentState: ['', Validators.required],
      presentPinCode: ['', Validators.required],

      sameAddress: [false],

      permanentDoorNo: ['', Validators.required],
      permanentAddressLine: ['', Validators.required],
      permanentState: ['', Validators.required],
      permanentPinCode: ['', Validators.required],

      pfNo: ['', Validators.required],
      uanNo: ['', Validators.required],
      esicNo: ['', Validators.required],

      bankAccountNumber: ['', Validators.required],
      accountHolderName: ['', Validators.required],
      ifsc: ['', Validators.required],
      bankName: ['', Validators.required],
      branchName: ['', Validators.required],

      contactName: ['', Validators.required],
      contactRelationship: ['', Validators.required],
      primaryContactNumber_EmergencyContactDetails: ['', Validators.required],
      secondaryContactNumber: [''],
    });

    // ************** AUTO-COPY ADDRESS **************
    this.PersonalInformationForm.get('sameAddress')?.valueChanges.subscribe((checked: boolean) => {
      if (checked) {
        this.copyPresentToPermanent();

        this.PersonalInformationForm.get('permanentDoorNo')?.disable();
        this.PersonalInformationForm.get('permanentAddressLine')?.disable();
        this.PersonalInformationForm.get('permanentState')?.disable();
        this.PersonalInformationForm.get('permanentPinCode')?.disable();
      } else {
        this.PersonalInformationForm.get('permanentDoorNo')?.enable();
        this.PersonalInformationForm.get('permanentAddressLine')?.enable();
        this.PersonalInformationForm.get('permanentState')?.enable();
        this.PersonalInformationForm.get('permanentPinCode')?.enable();
      }
    });

    // ************** LOAD DROPDOWNS **************
    this.userpersonalDetailsService
      .getNationalityOptions()
      .subscribe((x) => (this.nationalities = x));
    this.userpersonalDetailsService.getYesNoOptions().subscribe((x) => (this.yesNoList = x));
    this.userpersonalDetailsService
      .getVaccinationStatusOptions()
      .subscribe((x) => (this.vaccinationOptions = x));
    this.userpersonalDetailsService.getBloodGroups().subscribe((x) => (this.bloodGroups = x));
    this.userpersonalDetailsService.getGenderOptions().subscribe((x) => (this.genders = x));

    if (isPlatformBrowser(this.platformId)) {
      const userDetailsJson: string | null = sessionStorage.getItem('userDetails');

      if (userDetailsJson !== null) {
        this.userDetails = JSON.parse(userDetailsJson);
      }

      this.loadUserData();
    }
  }

  // ************** COPY ADDRESS **************
  copyPresentToPermanent(): void {
    this.PersonalInformationForm.patchValue({
      permanentDoorNo: this.PersonalInformationForm.get('presentDoorNo')?.value,
      permanentAddressLine: this.PersonalInformationForm.get('presentAddressLine')?.value,
      permanentState: this.PersonalInformationForm.get('presentState')?.value,
      permanentPinCode: this.PersonalInformationForm.get('presentPinCode')?.value,
    });
  }

  loadUserData(): void {
    if (!this.userDetails?.id) return;

    this.userpersonalDetailsService.getUserPersonalDetails(this.userDetails.id).subscribe({
      next: (data: any) => {
        console.log('Fetched User Personal Details:', data);

        // FIX: backend returns camelCase: userAddresses
        const addresses = data.userAddresses || [];

        const present = addresses.find((a: any) => a.isPresentAddress);
        const permanent = addresses.find((a: any) => !a.isPresentAddress);

        this.PersonalInformationForm.patchValue({
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          personalEmailID: data.personalEmailID,

          primaryContactNumber_BasicDetails: data.primaryContactNumber_BasicDetails,
          gender: data.gender,
          fatherOrHusbandName: data.fatherOrHusbandName,
          dob: data.dob?.substring(0, 10),

          nationality: data.nationality,
          differentlyAbled: data.differentlyAbled,
          vaccinationStatus: data.vaccinationStatus,
          bloodGroup: data.bloodGroup,
          bloodDonor: data.bloodDonor,

          panNumber: data.panNumber,
          aadhaarCardno: data.aadhaarCardno,

          // Present address
          presentDoorNo: present?.doorNo ?? '',
          presentAddressLine: present?.addressLine ?? '',
          presentState: present?.state ?? '',
          presentPinCode: present?.pincode ?? '',

          sameAddress: permanent?.sameAsPresent ?? false,

          // Permanent address
          permanentDoorNo: permanent?.doorNo ?? '',
          permanentAddressLine: permanent?.addressLine ?? '',
          permanentState: permanent?.state ?? '',
          permanentPinCode: permanent?.pincode ?? '',

          // Compliance
          pfNo: data.pfNo,
          uanNo: data.uanNo,
          esicNo: data.esicNo,

          // Bank Details
          bankAccountNumber: data.bankAccountNumber,
          accountHolderName: data.accountHolderName,
          ifsc: data.ifsccode,
          bankName: data.bankName,
          branchName: data.branchName,

          // Emergency Contact
          contactName: data.contactName,
          contactRelationship: data.contactRelationship,
          primaryContactNumber_EmergencyContactDetails:
            data.primaryContactNumber_EmergencyContactDetails,
          secondaryContactNumber: data.secondaryContactNumber,
        });

        if (permanent?.sameAsPresent) {
          this.PersonalInformationForm.get('permanentDoorNo')?.disable();
          this.PersonalInformationForm.get('permanentAddressLine')?.disable();
          this.PersonalInformationForm.get('permanentState')?.disable();
          this.PersonalInformationForm.get('permanentPinCode')?.disable();
        }
      },
      error: (err) => {
        console.error('Error loading user details:', err);
      },
    });
  }

  // ************** VALIDATION **************
  isInvalid(control: any): boolean {
    return control?.invalid && (control?.touched || control?.dirty);
  }

  // ************** SUBMIT **************
  onSubmit(): void {
    if (this.PersonalInformationForm.invalid) {
      this.PersonalInformationForm.markAllAsTouched();
      return;
    }

    // IMPORTANT: getRawValue() includes disabled fields
    const raw = this.PersonalInformationForm.getRawValue();

    // ************** FINAL PAYLOAD **************
    const payload: PersonalDetailsModel = {
      UserId: this.userDetails.id,
      LoginId: this.userDetails.id,
      CreatedBy: this.userDetails.id,
      CreatedDate: new Date().toISOString(),
      ModifiedBy: 0,
      ModifiedDate: new Date().toISOString(),
      IsActive: true,

      FirstName: raw.firstName,
      MiddleName: raw.middleName,
      LastName: raw.lastName,
      PersonalEmailID: raw.personalEmailID,

      PrimaryContactNumber_BasicDetails: raw.primaryContactNumber_BasicDetails,
      Gender: raw.gender,
      FatherOrHusbandName: raw.fatherOrHusbandName,
      DOB: raw.dob,

      Nationality: raw.nationality,
      DifferentlyAbled: raw.differentlyAbled,
      VaccinationStatus: raw.vaccinationStatus,
      BloodGroup: raw.bloodGroup,
      BloodDonor: raw.bloodDonor,

      PanNumber: raw.panNumber,
      AadhaarCardno: raw.aadhaarCardno,

      UserAddresses: [
        {
          UserId: this.userDetails.id,
          LoginId: this.userDetails.id,
          CreatedBy: this.userDetails.id,
          CreatedDate: new Date().toISOString(),
          ModifiedBy: this.userDetails.id,
          ModifiedDate: new Date().toISOString(),
          IsActive: true,

          DoorNo: raw.presentDoorNo,
          AddressLine: raw.presentAddressLine,
          State: raw.presentState,
          Pincode: raw.presentPinCode,

          IsPresentAddress: true,
          SameAsPresent: raw.sameAddress,
        },
        {
          UserId: this.userDetails.id,
          LoginId: this.userDetails.id,
          CreatedBy: this.userDetails.id,
          CreatedDate: new Date().toISOString(),
          ModifiedBy: this.userDetails.id,
          ModifiedDate: new Date().toISOString(),
          IsActive: true,

          DoorNo: raw.permanentDoorNo,
          AddressLine: raw.permanentAddressLine,
          State: raw.permanentState,
          Pincode: raw.permanentPinCode,

          IsPresentAddress: false,
          SameAsPresent: raw.sameAddress,
        },
      ],

      PFNo: raw.pfNo,
      UANNo: raw.uanNo,
      ESICNo: raw.esicNo,

      BankAccountNumber: raw.bankAccountNumber,
      AccountHolderName: raw.accountHolderName,
      IFSCCode: raw.ifsc,
      BankName: raw.bankName,
      BranchName: raw.branchName,

      ContactName: raw.contactName,
      ContactRelationship: raw.contactRelationship,
      PrimaryContactNumber_EmergencyContactDetails:
        raw.primaryContactNumber_EmergencyContactDetails,

      SecondaryContactNumber: raw.secondaryContactNumber,
    };

    console.log('FINAL PAYLOAD TO BACKEND:', payload);

    this.personalDetailsService.savePersonalDetails(payload).subscribe({
      next: (res) => console.log('Saved successfully', res),
      error: (err) => {
        console.log('Save error:', err);
        console.log('Backend validation errors:', err.error);
        console.log('VALIDATION ERRORS:', err.error?.errors);
      },
    });
  }

  // ************** CANCEL **************
  onCancel(): void {
    this.PersonalInformationForm.reset();
  }
}
