import {
  Component,
  ChangeDetectionStrategy,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { addMonths, subMonths, startOfDay } from 'date-fns';
import {
  CalendarEvent,
  CalendarView,
  CalendarDateFormatter,
  CalendarMonthViewDay,
} from 'angular-calendar';
import { Subject } from 'rxjs';
import { CalendarWrapperModule } from './calendar-wrapper.module';

@Component({
  selector: 'app-monthcalendar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './monthcalendar.component.html',
  styleUrls: ['./monthcalendar.component.scss'],
  imports: [CommonModule, CalendarWrapperModule],
  providers: [CalendarDateFormatter],
})
export class MonthcalendarComponent {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  refresh = new Subject<void>();

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

  handleEvent(event: CalendarEvent): void {
    console.log('Event clicked:', event);
  }

  onRightClick(event: MouseEvent, day: CalendarMonthViewDay): void {
    event.preventDefault();
    event.stopPropagation(); // ⛔ Prevent global click listener from immediately hiding it

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
}
