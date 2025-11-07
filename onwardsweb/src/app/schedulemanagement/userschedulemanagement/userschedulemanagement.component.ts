import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { environment } from '../../../environments/environment';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { LoginResponse } from '../../models/loginResponseModel';
import { UserScheduleService } from '../../services/user-schedule.service';
import { AdminSchedule } from '../../models/admin-schedule.model';
import { UserScheduleProfile } from '../../models/user-schedule.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-userschedulemanagement',
  standalone: true,
  imports: [TableModule, DatePipe, CommonModule, FormsModule],
  templateUrl: './userschedulemanagement.component.html',
  styleUrl: './userschedulemanagement.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserschedulemanagementComponent {
  noDataMessage = '';
  userDetails!: LoginResponse;
  adminscheduledetails?: AdminSchedule;
  userschedules: UserScheduleProfile[] = [];
  // Id,Date,Time,SchedulerId,ParticipantId

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private userScheduleService: UserScheduleService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userDetailsJson: string | null = sessionStorage.getItem('userDetails');

      if (userDetailsJson !== null) {
        this.userDetails = JSON.parse(userDetailsJson);
      }
    }

    this.noDataMessage = environment.noDataMessage;
    this.userScheduleService
      .getUserScheduleForScheduler(
        this.userDetails.id,
        this.userDetails.companyId,
        this.userDetails.locationId
      )
      .subscribe({
        next: (res) => {
          this.userschedules = res;
          console.log('Schedule Loaded:', res);
        },
        error: (err) => {
          console.error('Error loading schedule', err);
        },
        complete: () => {
          this.cdr.markForCheck();
        },
      });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const bootstrap = (window as any).bootstrap;
      const insertorupdateschedulemodalEl = document.getElementById('insertorupdateschedule');

      // if (insertorupdateschedulemodalEl && bootstrap?.Modal) {
      //   this.insertorupdateschedulemodal = new bootstrap.Modal(insertorupdateschedulemodalEl);
      // }
    }
  }

  onSlotChange(schedule: any, field: string, event: any) {
    const value = event.target.checked;

    if (value) {
      schedule[field] = 0;
    } else {
      schedule[field] = null;
    }

    console.log('Updated Row:', schedule);
  }
}
