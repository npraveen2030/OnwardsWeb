import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ReferralTrackingResponse } from '../../models/referraltrackingmodel';
import { ReferralTrackingService } from '../../services/referraltracking.service';
import { LoginResponse } from '../../models/loginResponseModel';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-referral-tracking',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './referral-tracking.component.html',
  styleUrl: './referral-tracking.component.scss',
})
export class ReferralTrackingComponent {
  referrals: ReferralTrackingResponse[] = [];
  userDetails!: LoginResponse;
  referralId?: number;
  deletereferralmodal!: any;

  constructor(
    private referralTrackingService: ReferralTrackingService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userDetailsJson: string | null = sessionStorage.getItem('userDetails');

      if (userDetailsJson !== null) {
        this.userDetails = JSON.parse(userDetailsJson);
      }

      this.getreferrals();
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const bootstrap = (window as any).bootstrap;
      const deletereferralmodalEl = document.getElementById('deletereferralmodal');

      if (deletereferralmodalEl && bootstrap?.Modal) {
        this.deletereferralmodal = new bootstrap.Modal(deletereferralmodalEl);
      }
    }
  }

  getreferrals() {
    this.referralTrackingService.getReferrals(this.userDetails.id).subscribe((res) => {
      this.referrals = res;
    });
  }

  downloadReferralDocument(id: number, fileName: string): void {
    this.referralTrackingService.getReferralDocument(id).subscribe({
      next: (response) => {
        const blob = response.body as Blob;

        const url = window.URL.createObjectURL(blob);

        // Create temporary anchor element
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();

        // Cleanup
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error downloading document:', err);
      },
    });
  }

  deleteconfirmationmodal(id: number) {
    this.referralId = id;
    this.deletereferralmodal.show();
  }

  deleteReferral() {
    this.referralTrackingService.deleteReferral(this.referralId ?? 0).subscribe(() => {
      this.getreferrals();
      this.deletereferralmodal.hide();
      this.toastr.success('referral Deleted');
    });
  }
}
