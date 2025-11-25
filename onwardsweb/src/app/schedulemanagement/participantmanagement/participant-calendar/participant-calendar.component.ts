import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-participant-calendar',
  standalone: true,
  imports: [TableModule, CommonModule],
  templateUrl: './participant-calendar.component.html',
  styleUrl: './participant-calendar.component.scss',
})
export class ParticipantCalendarComponent {
  @Input() SchedulerId!: number;
  @Input() SwitchToSearch!: () => void;

  userscheduleprofile: any;
  allTimeSlots: any;
}
