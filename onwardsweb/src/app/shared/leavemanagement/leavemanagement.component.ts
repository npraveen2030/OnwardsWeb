import { Component } from '@angular/core';
import { CalendarControlComponent } from './calendarcontrol.component';

@Component({
  selector: 'app-leavemanagement',
  standalone: true,
  imports: [CalendarControlComponent],
  templateUrl: './leavemanagement.component.html',
  styleUrl: './leavemanagement.component.scss',
})
export class LeavemanagementComponent {}
