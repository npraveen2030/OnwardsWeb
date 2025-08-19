import { Component } from '@angular/core';
import { CalendarControlComponent } from './calendarcontrol.component';
import { LeavesappliedComponent } from './leavesapplied.component';

@Component({
  selector: 'app-leavemanagement',
  standalone: true,
  imports: [CalendarControlComponent, LeavesappliedComponent],
  templateUrl: './leavemanagement.component.html',
  styleUrl: './leavemanagement.component.scss',
})
export class LeavemanagementComponent {}
