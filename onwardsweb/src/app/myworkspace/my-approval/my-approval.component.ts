import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Resignation } from '../../models/Resignation';
import { ResignationService } from '../../services/resignation.service';
import { LoginResponse } from '../../models/loginResponseModel';
import { isPlatformBrowser } from '@angular/common';
import { SharedModule } from '../../modules/shared/shared-module';
import { debug } from 'console';
import { approveResignations } from '../../models/ApproveResignationRequestModel';

@Component({
  selector: 'app-my-approval',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './my-approval.component.html',
  styleUrl: './my-approval.component.scss',
})
export class MyApprovalComponent implements OnInit {
  resignations: Resignation[] = [];
  masterSelected: boolean = false;
  userDetails: LoginResponse | null = null;
  ApproveModal: any;

  constructor(
    private resignationService: ResignationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Dummy Data for Example
    // this.resignations = [
    //   { userId: 1, employeeName: 'John Doe', createdDate: new Date(), status: 'Pending' },
    //   { userId: 2, employeeName: 'Jane Smith', createdDate: new Date(), status: 'Approved' },
    //   { userId: 3, employeeName: 'Mike Brown', createdDate: new Date(), status: 'Pending' },
    // ];
    if (isPlatformBrowser(this.platformId)) {
      const userStr = sessionStorage.getItem('userDetails');
      if (userStr !== null) {
        this.userDetails = JSON.parse(userStr);
      }
      this.loadResignations();
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const bootstrap = (window as any).bootstrap;
      const ApproveModal = document.getElementById('ApproveModal');

      if (ApproveModal && bootstrap?.Modal) {
        this.ApproveModal = new bootstrap.Modal(ApproveModal);
      }
    }
  }

  loadResignations(): void {
    this.resignationService.getResignationsByUserId(this.userDetails?.id ?? 0).subscribe({
      next: (data) => {
        // this.resignations = data;
        this.resignations = Array.isArray(data) ? data : [data];
        // debugger
      },
      error: (err) => {
        console.error('Error loading resignations:', err);
      },
    });
  }

  // Master Checkbox Select/Deselect (Only Pending)
  toggleAllSelection(): void {
    this.resignations.forEach((r) => {
      if (r.status === 'Pending') {
        r.selected = this.masterSelected;
      }
    });
  }

  // Update master checkbox if all pending rows selected
  updateMasterCheckbox(): void {
    const pending = this.resignations.filter((r) => r.status === 'Pending');
    this.masterSelected = pending.every((r) => r.selected === true);
  }

  approveSelected(): void {
    const selectedResignations = this.resignations.filter((r) => r.selected);
    if (selectedResignations.length === 0) {
      alert('No pending resignations selected.');
      return;
    }

    this.ApproveModal?.hide();

    let selectedResignationsIds = [];

    for (let resignation of selectedResignations) {
      selectedResignationsIds.push(resignation.userId);
    }

    const approveResignationsIds: approveResignations = {
      loginId: this.userDetails?.id ?? 0,
      ids: selectedResignationsIds,
    };

    this.resignationService.approveResignations(approveResignationsIds).subscribe({
      next: (res) => {
        console.log('Approved');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
