import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { ResignationReasonService } from '../../services/resignation-reason.service';
import { ResignationTypeService } from '../../services/resignation-type.service';
import { ResignationReason } from '../../models/resignationReasonModel';
import { ResignationType } from '../../models/resignationTypeModel';
import { isPlatformBrowser } from '@angular/common';
// import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../layout/shared/shared-module';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-resignation-information',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './resignation-information.component.html',
  styleUrl: './resignation-information.component.scss',
})
export class ResignationInformationComponent implements OnInit {
  reasons: ResignationReason[] = [];
  types: ResignationType[] = [];

  selectedReasonId: number | null = null;
  selectedTypeId: number | null = null;
  errorMessage: string | undefined;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private reasonService: ResignationReasonService,
    private typeService: ResignationTypeService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadReasons();
      this.loadTypes();
    }
    // this.loadReasonsAndTypes();
  }

  // loadReasonsAndTypes(): void {
  //   forkJoin({
  //     reasons: this.reasonService
  //       .getResignationReason()
  //       .pipe(catchError((err) => of({ error: err }))),
  //     types: this.typeService.getResignationTypes().pipe(catchError((err) => of({ error: err }))),
  //   }).subscribe((result) => {
  //     // Check if reasons has error
  //     if ('error' in result.reasons) {
  //       console.error('ResignationReason failed', result.reasons.error);
  //     } else {
  //       this.reasons = result.reasons; // Safe: it's ResignationReason[]
  //     }

  //     // Check if types has error
  //     if ('error' in result.types) {
  //       console.error('ResignationType failed', result.types.error);
  //     } else {
  //       this.types = result.types; // Safe: it's ResignationType[]
  //     }
  //   });
  //   // forkJoin({
  //   //   reasons: this.reasonService
  //   //     .getResignationReason()
  //   //     .pipe(catchError((err) => of({ error: err }))),
  //   //   types: this.typeService.getResignationTypes().pipe(catchError((err) => of({ error: err }))),
  //   // }).subscribe((result) => {
  //   //   if (result.reasons.error) {
  //   //     console.error('ResignationReason failed', result.reasons.error);
  //   //   } else {
  //   //     console.log('Reasons:', result.reasons);
  //   //   }

  //   //   if (result.types.error) {
  //   //     console.error('ResignationType failed', result.types.error);
  //   //   } else {
  //   //     console.log('Types:', result.types);
  //   //   }
  //   // });
  // }

  loadReasons(): void {
    this.reasonService.getResignationReason().subscribe({
      next: (data) => {
        this.reasons = data;
      },
      error: (err) => console.error('Error fetching resignation reasons', err),
    });
  }

  loadTypes(): void {
    // this.typeService.getResignationTypes().subscribe({
    //   next: (data) => (this.types = data),
    //   error: (err) => console.error('Error fetching resignation types', err),
    // });

    this.typeService.getResignationTypes().subscribe({
      next: (response) => {
        this.types = response;
      },
      error: (err: any) => {
        // ------------------<need to modify error responses>--------------------
        if (err.status === 401) {
          this.errorMessage = 'Training details not found';
        } else {
          this.errorMessage = 'An error occurred. Please try again.';
        }
        console.error('Login error:', err);
      },
    });
  }

  onSubmit(): void {
    console.log('Selected ReasonId:', this.selectedReasonId);
    console.log('Selected TypeId:', this.selectedTypeId);
  }
}
