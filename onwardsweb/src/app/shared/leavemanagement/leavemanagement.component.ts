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
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { CalendarWrapperModule } from '../../services/calendar-wrapper.service';
import { Router } from '@angular/router';
import { AutocompleteComponent } from './autocomplete.component';

@Component({
  selector: 'app-leavemanagement',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './leavemanagement.component.html',
  styleUrls: ['./leavemanagement.component.scss'],
  imports: [
    CommonModule,
    CalendarWrapperModule,
    ReactiveFormsModule,
    AutocompleteComponent,
  ],
  providers: [CalendarDateFormatter],
})
export class LeaveManagementComponent {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  refresh = new Subject<void>();
  leaverequestModal: any;
  attendanceregularizationModal: any;
  leaveRequestForm: FormGroup;
  attendanceForm: FormGroup;

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

  rightClickDay: Date | null = null;
  menuX = 0;
  menuY = 0;
  showContextMenu = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.leaveRequestForm = this.fb.group({
      employeename: ['Gedam Nagesh (13339)', Validators.required],
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

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const bootstrap = (window as any).bootstrap;

      // Leave Request Modal
      const leaverequestEl = document.getElementById('leaverequestmodal');
      if (leaverequestEl && bootstrap?.Modal) {
        this.leaverequestModal = new bootstrap.Modal(leaverequestEl);
      }

      // Attendance Regularization Modal
      const attendanceEl = document.getElementById(
        'attendanceRegularizationModal'
      );
      if (attendanceEl && bootstrap?.Modal) {
        this.attendanceregularizationModal = new bootstrap.Modal(attendanceEl);
      }
    }
  }

  clear() {
    this.attendanceForm.reset({
      type: 'day',
      duration: '',
    });
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
}
