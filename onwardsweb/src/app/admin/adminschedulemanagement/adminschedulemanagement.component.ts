import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { LoginResponse } from '../../models/loginResponseModel';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TableModule } from 'primeng/table';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';
import { AdminScheduleService } from '../../services/admin-schedule.service';
import { AdminSchedule, AdminScheduleModel } from '../../models/admin-schedule.model';

@Component({
  selector: 'app-adminschedulemanagement',
  standalone: true,
  imports: [TableModule, CommonModule, ReactiveFormsModule],
  templateUrl: './adminschedulemanagement.component.html',
  styleUrl: './adminschedulemanagement.component.scss',
})
export class AdminschedulemanagementComponent {
  adminSchedules: AdminSchedule[] = [];
  selectedSchedule?: AdminSchedule;
  companies: any = [];
  noDataMessage: string = '';
  insertorupdateschedulemodal: any;
  deleteschedulemodal: any;
  ScheduleForm!: FormGroup;
  isInsert: boolean = true;
  userDetails!: LoginResponse;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private toastr: ToastrService,
    private adminScheduleService: AdminScheduleService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.ScheduleForm = this.fb.group({
      id: [''],
      companyId: ['', Validators.required],
      noOfDays: [0, Validators.required],
      userScheduleHoliday: [false],
      userScheduleWeekOff: [false],
    });
    this.noDataMessage = environment.noDataMessage;

    if (isPlatformBrowser(this.platformId)) {
      const userDetailsJson: string | null = sessionStorage.getItem('userDetails');

      if (userDetailsJson !== null) {
        this.userDetails = JSON.parse(userDetailsJson);
      }
    }

    this.getAdminSchedules();
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const bootstrap = (window as any).bootstrap;
      const insertorupdateschedulemodalEl = document.getElementById('insertorupdateschedule');
      const deleteschedulemodalEl = document.getElementById('deleteschedule');

      if (insertorupdateschedulemodalEl && bootstrap?.Modal) {
        this.insertorupdateschedulemodal = new bootstrap.Modal(insertorupdateschedulemodalEl);
      }

      if (deleteschedulemodalEl && bootstrap?.Modal) {
        this.deleteschedulemodal = new bootstrap.Modal(deleteschedulemodalEl);
      }
    }
  }

  getAdminSchedules() {
    this.adminScheduleService.getSchedules().subscribe({
      next: (res) => {
        this.adminSchedules = res;
      },
    });
  }

  addScheduleClick() {
    this.isInsert = true;
    this.adminScheduleService.getCompaniesForAdminSchedule().subscribe({
      next: (res) => {
        this.companies = res;
      },
    });
    this.insertorupdateschedulemodal.show();
  }

  updateScheduleClick(schedule: AdminSchedule) {
    this.isInsert = false;
    this.selectedSchedule = schedule;
    this.ScheduleForm.patchValue({
      id: schedule.id,
      companyId: schedule.companyId,
      noOfDays: schedule.noOfDays,
      userScheduleHoliday: schedule.userScheduleHoliday,
      userScheduleWeekOff: schedule.userScheduleWeekOff,
    });
    this.adminScheduleService.getCompaniesForAdminSchedule().subscribe({
      next: (res) => {
        this.companies = res;
      },
    });
    this.insertorupdateschedulemodal.show();
  }

  onSubmit(): void {
    if (this.ScheduleForm.valid) {
      const payload: AdminScheduleModel = {
        id:
          this.ScheduleForm.get('id')?.value === ''
            ? undefined
            : this.ScheduleForm.get('id')?.value,
        companyId: parseInt(this.ScheduleForm.get('companyId')?.value, 10),
        noOfDays: this.ScheduleForm.get('noOfDays')?.value,
        userScheduleHoliday: this.ScheduleForm.get('userScheduleHoliday')?.value,
        userScheduleWeekOff: this.ScheduleForm.get('userScheduleWeekOff')?.value,
        loginId: this.userDetails.id,
      };
      this.adminScheduleService.saveSchedule(payload).subscribe({
        next: () => {
          this.getAdminSchedules();
          this.closeModal();
        },
      });
    } else {
      this.ScheduleForm.markAllAsTouched();
    }
  }

  onReset(): void {
    if (this.isInsert) {
      this.ScheduleForm.reset({
        id: '',
        companyId: '',
        noOfDays: 0,
        userScheduleHoliday: false,
        userScheduleWeekOff: false,
      });
    } else {
      this.ScheduleForm.reset({
        id: this.selectedSchedule?.id,
        companyId: this.selectedSchedule?.companyId,
        noOfDays: this.selectedSchedule?.noOfDays,
        userScheduleHoliday: this.selectedSchedule?.userScheduleHoliday,
        userScheduleWeekOff: this.selectedSchedule?.userScheduleWeekOff,
      });
    }
  }

  closeModal() {
    this.ScheduleForm.reset({
      id: '',
      companyId: '',
      noOfDays: 0,
      userScheduleHoliday: false,
      userScheduleWeekOff: false,
    });
    this.insertorupdateschedulemodal.hide();
  }

  onDeletePopup(schedule: AdminSchedule) {
    this.selectedSchedule = schedule;
    this.deleteschedulemodal.show();
  }

  onDelete() {
    this.adminScheduleService
      .deleteSchedule(this.selectedSchedule?.id ?? 0, this.userDetails.id)
      .subscribe({
        next: () => {
          this.getAdminSchedules();
          this.deleteschedulemodal.hide();
        },
      });
  }

  isInvalid(controlName: string): boolean {
    const control = this.ScheduleForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
