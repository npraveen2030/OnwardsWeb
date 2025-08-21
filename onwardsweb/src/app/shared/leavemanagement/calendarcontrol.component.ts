import {
  Component,
  ChangeDetectionStrategy,
  HostListener,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { addMonths, subMonths } from 'date-fns';
import {
  CalendarEvent,
  CalendarView,
  CalendarDateFormatter,
  CalendarMonthViewDay,
} from 'angular-calendar';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { CalendarWrapperModule } from '../../services/calendar-wrapper.service';
import { Router } from '@angular/router';
import { AutocompleteComponent } from './autocomplete.component';
import { LoginResponse } from '../../models/loginResponseModel';
import { LeaveManagementService } from '../../services/leavemanagement.service';
import { LeaveTypes } from '../../models/leavemanagementResponseModel';

@Component({
  selector: 'app-calendarcontrol',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendarcontrol.component.html',
  styleUrls: ['./calendarcontrol.component.scss'],
  imports: [CommonModule, CalendarWrapperModule, ReactiveFormsModule, AutocompleteComponent],
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
  fileName: string = '';
  fileData!: File | null;
  rightClickDay: Date | null = null;
  menuX = 0;
  menuY = 0;
  showContextMenu = false;
  userDetails!: LoginResponse;
  leavetypes: LeaveTypes[] = [];
  today = new Date();
  minDate = new Date(new Date().setDate(this.today.getDate() - 30)).toISOString().split('T')[0];

  // --> To be retrived form Backend
  events: CalendarEvent[] = [
    {
      start: new Date(),
      title: '',
      color: { primary: '#1e90ff', secondary: 'red' },
      allDay: true,
    },
    {
      start: new Date(new Date().setDate(new Date().getDate() + 2)),
      title: '',
      color: { primary: '#ff0000', secondary: 'red' },
      allDay: true,
    },
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private fb: FormBuilder,
    private leavemanagementservice: LeaveManagementService
  ) {
    this.leaveRequestForm = this.fb.group({
      employeename: ['', Validators.required],
      leavetype: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      dayPeriod: ['', Validators.required],
      phone: ['', Validators.required],
      notify: ['', Validators.required],
      reason: [''],
      file: [null],
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

      this.leavemanagementservice.GetLeaveTypes().subscribe({
        next: (response) => {
          this.leavetypes = response;
        },
        error: (err) => {
          console.error('Error fetching leave types', err);
        },
      });
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
    }
  }

  clearAttendanceForm() {
    this.attendanceForm.reset();
  }

  // ----------------------------------calender control ---------------------------

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

  previousMonth(): void {
    this.viewDate = subMonths(this.viewDate, 1);
  }

  nextMonth(): void {
    this.viewDate = addMonths(this.viewDate, 1);
  }

  // ----------------------------------------Context Menu------------------------------------------------------

  @HostListener('document:click')
  onGlobalClick() {
    this.showContextMenu = false;
  }

  showleaverequest() {
    this.showContextMenu = false;
    this.leaverequestModal.show();
  }

  showattendanceregularization() {
    this.showContextMenu = false;
    this.attendanceregularizationModal.show();
  }

  submit() {}

  //--------------------------------------------------file upload------------------------------------------
  onFileSelected(event: any): void {
    const file: File = event.target.files?.[0];
    if (file) {
      this.fileName = file.name;
      this.fileData = file;
      this.leaveRequestForm.patchValue({ file });
      this.leaveRequestForm.get('file')?.updateValueAndValidity();
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (this.fileData) return;
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.fileName = file.name;
      this.fileData = file;
      this.leaveRequestForm.patchValue({ file });
      this.leaveRequestForm.get('file')?.updateValueAndValidity();
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    (event.target as HTMLElement).classList.add('dragover');
  }

  onDragLeave(event: DragEvent): void {
    (event.target as HTMLElement).classList.remove('dragover');
  }

  RemoveFile(): void {
    this.fileName = '';
    this.fileData = null;
    this.leaveRequestForm.patchValue({ file: null });
    this.leaveRequestForm.get('file')?.updateValueAndValidity();
  }

  submitLeaveRequestForm() {}
}
