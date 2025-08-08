import {
  Component,
  ChangeDetectionStrategy,
  HostListener,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { addMonths, subMonths, startOfDay } from 'date-fns';
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
import { CalendarWrapperModule } from '../services/calendar-wrapper.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
} from 'rxjs/operators';

@Component({
  selector: 'app-leavemanagement',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './leavemanagement.component.html',
  styleUrls: ['./leavemanagement.component.scss'],
  imports: [CommonModule, CalendarWrapperModule, ReactiveFormsModule],
  providers: [CalendarDateFormatter],
})
export class LeaveManagementComponent {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  refresh = new Subject<void>();
  leaverequestModal: any;
  leaveRequestForm: FormGroup;

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

  notifyOpen = false;
  notifyActiveIndex = -1;
  notifyOptions: string[] = [
    'Sameer Mohammad',
    'Samuel Green',
    'Eero Saarinen',
    'Sameer Singh',
    'Ameer Khan',
    'Seerat Kaur',
    'Mohammad Sami',
    'Engineer Team',
    'Pearl Eerie',
  ];
  filteredNotify$!: Observable<string[]>;

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
  }

  ngOnInit() {
    const notifyCtrl = this.leaveRequestForm.get('notify')!;
    this.filteredNotify$ = notifyCtrl.valueChanges.pipe(
      startWith(notifyCtrl.value ?? ''),
      debounceTime(120),
      distinctUntilChanged(),
      map((v) => this.filterNotify((v ?? '').toString()))
    );
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const bootstrap = (window as any).bootstrap;
      const leaverequestEl = document.getElementById('leaverequestmodal');

      if (leaverequestEl && bootstrap?.Modal) {
        this.leaverequestModal = new bootstrap.Modal(leaverequestEl);
      }
    }
  }

  //--------------------------------------- AutoComplete Search input------------------------------------
  private filterNotify(input: string): string[] {
    const terms = input
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((t) => t.toLowerCase());

    if (!terms.length) return this.notifyOptions;

    return this.notifyOptions.filter((opt) => {
      const o = opt.toLowerCase();
      return terms.some((t) => o.includes(t));
    });
  }

  selectNotify(opt: string) {
    this.leaveRequestForm.patchValue({ notify: opt });
    this.notifyOpen = false;
    this.notifyActiveIndex = -1;
  }

  onNotifyKeydown(e: KeyboardEvent, list: string[] | null) {
    const items = list ?? [];
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.notifyActiveIndex = (this.notifyActiveIndex + 1) % items.length;
      this.notifyOpen = true;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.notifyActiveIndex =
        (this.notifyActiveIndex <= 0 ? items.length : this.notifyActiveIndex) -
        1;
      this.notifyOpen = true;
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (this.notifyActiveIndex >= 0)
        this.selectNotify(items[this.notifyActiveIndex]);
    } else if (e.key === 'Escape') {
      this.notifyOpen = false;
    }
  }

  closeNotifyDropdownSoon() {
    setTimeout(() => (this.notifyOpen = false), 120);
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

  @HostListener('document:click')
  onGlobalClick() {
    this.showContextMenu = false;
  }

  showleaverequest() {
    this.showContextMenu = false;
    this.leaverequestModal.show();
  }

  submit() {}
}
