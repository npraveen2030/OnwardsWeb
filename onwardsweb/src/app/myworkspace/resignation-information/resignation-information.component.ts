import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { ResignationReasonService } from '../../services/resignation-reason.service';
import { ResignationTypeService } from '../../services/resignation-type.service';
import { ResignationReason } from '../../models/resignationReasonModel';
import { ResignationType } from '../../models/resignationTypeModel';
import { isPlatformBrowser } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../modules/shared/shared-module';
import { ResignationService } from '../../services/resignation.service';
import { Resignation } from '../../models/Resignation';
import { LoginResponse } from '../../models/loginResponseModel';

@Component({
  selector: 'app-resignation-information',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './resignation-information.component.html',
  styleUrl: './resignation-information.component.scss',
})
export class ResignationInformationComponent implements OnInit {
  userDetails: LoginResponse | null = null;

  reasons: ResignationReason[] = [];
  types: ResignationType[] = [];
  resignationDetails: Resignation | undefined; 

  selectedReasonId: number | null = null;
  selectedTypeId: number | null = null;
  errorMessage: string | undefined;

  resignationForm!: FormGroup;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private reasonService: ResignationReasonService,
    private typeService: ResignationTypeService,
    private resignationService: ResignationService,
    private fb: FormBuilder
  ) {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.resignationForm.patchValue({ attachmentFile: file });
    }
  }
  
  onSubmit(): void {
    if (this.resignationForm.valid) {
      console.log(this.resignationForm.value);
      console.log('Valid');

      const formValue = this.resignationForm.value;

      if (formValue.id && formValue.id > 0) {

        const resignation: Resignation = {
          ...this.resignationForm.value,
          userId: this.userDetails?.id ?? 0, 
          loginId: this.userDetails?.id ?? 0, 
        };
        debugger;
        this.resignationService.updateResignation(resignation).subscribe({
          next: (res) => {
            alert('Resignation updated successfully!');
          },
          error: (err) => {
            console.error(err);
            alert('Error while updated resignation');
          },
        });
      } else {
        // 🔹 Insert case
        const resignation: Resignation = this.resignationForm.value;
        debugger;
        this.resignationService.insertResignation(resignation).subscribe({
          next: (res) => {
            alert('Resignation inserted successfully!');
          },
          error: (err) => {
            console.error(err);
            alert('Error while inserting resignation');
          },
        });
      }
    } else {
      console.log('In Valid');
      this.resignationForm.markAllAsTouched();
    }
  }

  onPullback() {
    console.log('Pullback Requested:', this.resignationForm.value.pullbackComment);
  }

  onCancel() {
    this.resignationForm.reset();
  }

  ngOnInit(): void { 

    if (isPlatformBrowser(this.platformId)) {
      const userStr = sessionStorage.getItem('userDetails');
      if (userStr !== null) {
        this.userDetails = JSON.parse(userStr);
      }
      this.loadReasonsAndTypes();
    }

    this.resignationForm = this.fb.group({
      id: [0],
      userId: this.userDetails?.id ?? 0,
      resignationTypeId: [0, Validators.min(1)], 
      resignationReasonId: [0, Validators.min(1)],
      resignationLetterDate: ['', Validators.required],
      requestedRelievingDate: ['', Validators.required],
      actualRelievingDate: ['', Validators.required], 
      noticePeriod: [90, [Validators.required, Validators.min(0)]],
      endOfNoticePeriod: [90, Validators.required],
      nextEmployer: [''],
      mailingAddress: ['', Validators.required],
      address: ['', Validators.required],
      personalEmailId: ['', [Validators.required, Validators.email]],
      comments: [''],
      attachmentFile: [null],
      statusId: [1],
      approvedBy: [null],
      approvalDate: [null],
      approverRemarks: [null],
      pullbackComment: ['', Validators.required],
      loginId: this.userDetails?.id ?? 0,
    });
    debugger;
  }

  loadReasonsAndTypes(): void {
    forkJoin({
      reasons: this.reasonService
        .getResignationReason()
        .pipe(catchError((err) => of({ error: err }))),

      types: this.typeService.getResignationTypes().pipe(catchError((err) => of({ error: err }))),
      resignationDetails: this.resignationService
        .getResignationDetailsByUserId(this.userDetails?.id ?? 0)
        .pipe(catchError((err) => of({ error: err }))),
    }).subscribe((result) => {
      this.resignationForm.patchValue(result.resignationDetails);

      // Check if reasons has error
      if ('error' in result.reasons) {
        console.error('ResignationReason failed', result.reasons.error);
      } else {
        this.reasons = result.reasons; // Safe: it's ResignationReason[]
      }

      // Check if types has error
      if ('error' in result.types) {
        console.error('ResignationType failed', result.types.error);
      } else {
        this.types = result.types; // Safe: it's ResignationType[]
      }

      if ('error' in result.resignationDetails) {
        console.error('ResignationType failed', result.resignationDetails.error);
      } else {
        this.resignationDetails = result.resignationDetails;
      }
    });
 
  }

  loadReasons(): void {
    this.reasonService.getResignationReason().subscribe({
      next: (data) => {
        this.reasons = data;
      },
      error: (err) => console.error('Error fetching resignation reasons', err),
    });
  }

  loadTypes(): void {

    this.typeService.getResignationTypes().subscribe({
      next: (response) => {
        this.types = response;
      },
      error: (err: any) => {
        if (err.status === 401) {
          this.errorMessage = 'Training details not found';
        } else {
          this.errorMessage = 'An error occurred. Please try again.';
        }
        console.error('Login error:', err);
      },
    });
  }

  isInvalid(controlName: string, errorName?: string): boolean {
    const control = this.resignationForm.get(controlName);
    if (!control) return false;
    return errorName
      ? control.touched && !!control.errors?.[errorName]
      : control.touched && control.invalid;
  }
  
}
