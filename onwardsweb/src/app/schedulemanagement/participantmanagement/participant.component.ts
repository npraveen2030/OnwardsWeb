import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { JobPostService } from '../../services/jobpost.service';
import { skill, user } from '../../models/jobpostresponse';
import { Select } from 'primeng/select';
import { SchedulerSkillsService } from '../../services/scheduler-skills.service';
import { SchedulerDetails } from '../../models/scheduler-details.model';
import { ParticipantCalendarComponent } from './participant-calendar/participant-calendar.component';

@Component({
  selector: 'app-userscheduleappointment',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    MultiSelectModule,
    FormsModule,
    Select,
    ParticipantCalendarComponent,
  ],
  templateUrl: './participant.component.html',
  styleUrl: './participant.component.scss',
})
export class ParticipantComponent {
  skills: skill[] = [];
  selectedSkills: string[] = [];
  schedulers: SchedulerDetails[] = [];
  issearch: boolean = true;
  selectedSchedulerId!: number;

  constructor(
    private jobPostService: JobPostService,
    private schedulerSkillService: SchedulerSkillsService
  ) {}
  ngOnInit(): void {
    this.jobPostService.GetSkills().subscribe((res) => {
      this.skills = res;
    });

    this.schedulerSkillService.getSchedulersBySkills([]).subscribe({
      next: (res) => {
        this.schedulers = res;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onSkillChange() {
    this.schedulerSkillService.getSchedulersBySkills(this.selectedSkills).subscribe({
      next: (res) => {
        this.schedulers = res;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  selectedId(id: number) {
    this.selectedSchedulerId = id;
    this.issearch = false;
  }

  swithtosearch() {
    this.issearch = true;
  }
}
