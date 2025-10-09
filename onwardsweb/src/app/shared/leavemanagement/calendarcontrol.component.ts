import {
  Component,
  ChangeDetectionStrategy,
  HostListener,
  PLATFORM_ID,
  Inject,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { addMonths, subMonths } from 'date-fns';
import {
  CalendarEvent,
  CalendarView,
  CalendarDateFormatter,
  CalendarMonthViewDay,
} from 'angular-calendar';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import { map, Subject } from 'rxjs';
import { CalendarWrapperModule } from '../../services/calendar-wrapper.service';
import { LoginResponse } from '../../models/loginResponseModel';
import { LeaveManagementService } from '../../services/leavemanagement.service';
import { LeaveTypes } from '../../models/leavemanagementResponseModel';
import { LeaveRequest } from '../../models/leavemanagementRequestModel';
import { user } from '../../models/jobpostresponse';
import { JobPostService } from '../../services/jobpost.service';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-calendarcontrol',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendarcontrol.component.html',
  styleUrls: ['./calendarcontrol.component.scss'],
  imports: [CommonModule, CalendarWrapperModule, ReactiveFormsModule, AutoComplete, FormsModule],
  providers: [CalendarDateFormatter],
})
export class CalendarControlComponent {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  refresh = new Subject<void>();
  leaverequestModal: any;
  attendanceregularizationModal: any;
  leaveRequestForm: FormGroup;
  attendanceForm: FormGroup;
  rightClickDay: Date | null = null;
  menuX = 0;
  menuY = 0;
  showContextMenu = false;
  userDetails!: LoginResponse;
  leavetypes: LeaveTypes[] = [];
  today = new Date();
  minDate = new Date(new Date().setDate(this.today.getDate() - 30)).toISOString().split('T')[0];
  showTime: boolean = false;
  events: CalendarEvent[] = [];
  users: user[] = [];
  usersuggestions: user[] = [];
  selectedFile: File | null = null;
  fileError: string | null = null;
  times: any = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private jobPostService: JobPostService,
    private leavemanagementservice: LeaveManagementService,
    private toastr: ToastrService
  ) {
    this.leaveRequestForm = this.fb.group({
      employeename: ['', Validators.required],
      leavetype: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      dayPeriod: ['full', Validators.required],
      phone: [''],
      notify: ['', Validators.required],
      reason: ['', Validators.required],
    });
    this.attendanceForm = this.fb.group({
      employeeName: ['', Validators.required],
      type: ['day', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      duration: [{ value: '', disabled: true }],
      reason: ['', [Validators.required, Validators.maxLength(250)]],
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const userDetailsJson: string | null = sessionStorage.getItem('userDetails');

      if (userDetailsJson !== null) {
        this.userDetails = JSON.parse(userDetailsJson);
      }

      this.leaveRequestForm.patchValue({
        employeename: `${this.userDetails.fullName} (${this.userDetails.employeeCode})`,
      });

      this.leavemanagementservice.GetLeaveTypes(this.userDetails.id).subscribe({
        next: (response) => {
          this.leavetypes = response;
        },
        error: (err) => {
          console.error('Error fetching leave types', err);
        },
      });

      this.jobPostService.Getusers().subscribe((res) => {
        this.users = res;
      });

      this.getCalenderEvents();
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const bootstrap = (window as any).bootstrap;

      // Leave Request Modal
      const leaverequestEl = document.getElementById('leaverequestmodal');
      if (leaverequestEl && bootstrap?.Modal) {
        this.leaverequestModal = new bootstrap.Modal(leaverequestEl);
      }

      // Attendance Regularization Modal
      const attendanceEl = document.getElementById('attendanceRegularizationModal');
      if (attendanceEl && bootstrap?.Modal) {
        this.attendanceregularizationModal = new bootstrap.Modal(attendanceEl);
      }

      this.attendanceregularizationModal.show();
    }
  }

  // ----------------------------------calender control ---------------------------

  previousMonth(): void {
    this.viewDate = subMonths(this.viewDate, 1);
    this.getCalenderEvents();
  }

  nextMonth(): void {
    this.viewDate = addMonths(this.viewDate, 1);
    this.getCalenderEvents();
  }

  refreshMonth(): void {
    this.viewDate = new Date();
    this.getCalenderEvents();
  }

  private formatTo12Hour(time: string | null): string | null {
    if (!time) return null;

    const [hour, minute] = time.split(':').map(Number);
    if (isNaN(hour) || isNaN(minute)) return null;

    const date = new Date();
    date.setHours(hour, minute);

    // Converts to "h:mm AM/PM"
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  getLoginTime(day: Date): string | null {
    const record = this.times.find(
      (i: any) => i.date && new Date(i.date).toDateString() === new Date(day).toDateString()
    );
    return this.formatTo12Hour(record?.loginTime ?? null);
  }

  getLogoutTime(day: Date): string | null {
    const record = this.times.find(
      (i: any) => i.date && new Date(i.date).toDateString() === new Date(day).toDateString()
    );
    return this.formatTo12Hour(record?.logOutTime ?? null);
  }

  getColorById(id: number): string {
    switch (id) {
      case 1:
        return '#198754'; // Present (Green - bg-success)
      case 2:
        return '#dc3545'; // Absent (Red - bg-danger)
      case 3:
        return '#0d6efd'; // Leave (Blue - bg-primary)
      case 4:
        return '#6c757d'; // Week Off (Gray - bg-secondary)
      case 5:
        return '#ffc107'; // Holiday (Yellow - bg-warning)
      case 6:
        return '#0dcaf0'; // Multiple Events (Cyan - bg-info)
      default:
        return '#adb5bd'; // Default (Light gray)
    }
  }

  getCalenderEvents() {
    this.leavemanagementservice
      .GetCalanderEvents(
        this.userDetails.id,
        this.viewDate.getMonth() + 1,
        this.viewDate.getFullYear()
      )
      .pipe(
        map((res) => {
          const events = res.map((e) => ({
            start: new Date(e.date),
            title: '',
            color: {
              primary: this.getColorById(e.statusId),
              secondary: this.getColorById(e.statusId),
            },
            allDay: true,
          }));

          const times = res.map((e) => ({
            date: new Date(e.date),
            loginTime: e.loginTime,
            logOutTime: e.logOutTime,
          }));

          return { events, times };
        })
      )
      .subscribe({
        next: (res) => {
          this.events = res.events;
          this.times = res.times;
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching calendar events:', err);
        },
      });
  }

  // ----------------------------------------Context Menu------------------------------------------------------

  onRightClick(event: MouseEvent, day: CalendarMonthViewDay): void {
    event.preventDefault();
    event.stopPropagation();

    this.showContextMenu = true;
    this.rightClickDay = day.date;
    this.menuX = event.clientX;
    this.menuY = event.clientY;
  }

  handleAction(action: string) {
    console.log('Context action:', action, 'on', this.rightClickDay);
    this.showContextMenu = false;
  }

  @HostListener('document:click')
  onGlobalClick() {
    this.showContextMenu = false;
  }

  toLocalDateString(date: Date): string {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  }

  showleaverequest() {
    this.showContextMenu = false;
    if (this.rightClickDay !== null) {
      this.leaveRequestForm.patchValue({
        startDate: this.toLocalDateString(this.rightClickDay),
        endDate: this.toLocalDateString(this.rightClickDay),
      });
    }

    this.leaverequestModal.show();
  }

  showattendanceregularization() {
    this.showContextMenu = false;
    if (this.rightClickDay !== null) {
      this.attendanceForm.patchValue({
        employeeName: `${this.userDetails.fullName} (${this.userDetails.employeeCode})`,
        startDate: this.toLocalDateString(this.rightClickDay),
        endDate: this.toLocalDateString(this.rightClickDay),
      });
    }
    this.attendanceregularizationModal.show();
  }
  //--------------------------------------------------file upload------------------------------------------

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const file = input.files[0];

      if (file.type !== 'application/pdf') {
        this.fileError = 'Only PDF files are allowed.';
        return;
      }

      //  Allow only files ≤ 1 MB (1 MB = 1 * 1024 * 1024 bytes)
      if (file.size > 1 * 1024 * 1024) {
        this.fileError = 'File size must be less than or equal to 1 MB.';
        return;
      }

      this.selectedFile = file;
      this.fileError = null;
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      const file = event.dataTransfer.files[0];

      if (file.type !== 'application/pdf') {
        this.fileError = 'Only PDF files are allowed.';
        return;
      }

      //  Allow only files ≤ 1 MB (1 MB = 1 * 1024 * 1024 bytes)
      if (file.size > 1 * 1024 * 1024) {
        this.fileError = 'File size must be less than or equal to 1 MB.';
        return;
      }

      this.selectedFile = file;
      this.fileError = null;
    }
  }

  removeFile() {
    this.selectedFile = null;
  }

  //--------------------Leave Request----------------------------------
  searchuser(event: AutoCompleteCompleteEvent) {
    if (event.query.replace(/\s/g, '').length >= 3) {
      const terms = event.query.toLowerCase().split(/\s+/).filter(Boolean);

      this.usersuggestions = this.users.filter((user) => {
        const names = user.userName.toLowerCase().split(/\s+/).filter(Boolean);

        return terms.every((term, index) => {
          return !names[index] || names[index].includes(term);
        });
      });
    } else {
      this.usersuggestions = [];
    }
  }

  halfdayhandler(event: Event) {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    if (value === 'half') {
      this.leaveRequestForm.patchValue({
        endDate: this.leaveRequestForm.get('startDate')?.value,
      });
    }
  }

  setendDate() {
    this.leaveRequestForm.patchValue({
      endDate: this.leaveRequestForm.get('startDate')?.value,
    });
  }

  submitLeaveRequestForm(): void {
    if (this.leaveRequestForm.valid) {
      let leaverequest: LeaveRequest = {
        loginId: this.userDetails.id,
        userId: this.userDetails.id,
        leaveTypeId: this.leaveRequestForm.get('leavetype')?.value,
        locationId: this.userDetails.locationId,
        year: 0,
        reason: this.leaveRequestForm.get('reason')?.value,
        startDate: this.leaveRequestForm.get('startDate')?.value,
        endDate: this.leaveRequestForm.get('endDate')?.value,
        isFullDay: this.leaveRequestForm.get('dayPeriod')?.value === 'full' ? true : false,
        phoneNo: this.leaveRequestForm.get('phone')?.value,
        leaveStatusId: 1, // Requested
        notifiedUserId: this.leaveRequestForm.get('notify')?.value.id,
      };

      this.leavemanagementservice.InsertLeaveRequest(leaverequest, this.selectedFile).subscribe({
        next: (res) => {
          if (res.success) {
            this.cancelLeaveRequest();
            this.toastr.success(res.message);
          } else {
            this.toastr.warning(res.message);
          }
        },
        error: (err) => {
          throw new Error(err.message);
        },
      });
    } else {
      this.leaveRequestForm.markAllAsTouched();
      return;
    }
  }

  resetLeaveRequest() {
    this.leaveRequestForm.reset({
      leavetype: '',
      dayPeriod: 'full',
      employeename: `${this.userDetails.fullName} (${this.userDetails.employeeCode})`,
      startDate: this.toLocalDateString(this.rightClickDay ?? new Date()),
      endDate: this.toLocalDateString(this.rightClickDay ?? new Date()),
    });
    this.fileError = null;
  }

  cancelLeaveRequest() {
    this.leaverequestModal.hide();
    this.resetLeaveRequest();
  }

  isInvalidLeaveRequest(controlName: string): boolean {
    const control = this.leaveRequestForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  //--------------------Attendance Regularization----------------------------------
  submitAttendanceRegualrization() {
    if (this.attendanceForm.valid) {
    } else {
      this.attendanceForm.markAllAsTouched();
      return;
    }
  }

  clearAttendanceForm() {
    this.attendanceForm.reset();
  }

  isInvalidAttendanceReg(controlName: string): boolean {
    const control = this.attendanceForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
