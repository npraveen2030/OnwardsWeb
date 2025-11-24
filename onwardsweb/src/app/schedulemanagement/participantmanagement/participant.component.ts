import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { JobPostService } from '../../services/jobpost.service';
import { skill, user } from '../../models/jobpostresponse';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-userscheduleappointment',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, MultiSelectModule, FormsModule, Select],
  templateUrl: './participant.component.html',
  styleUrl: './participant.component.scss',
})
export class ParticipantComponent {
  skills: skill[] = [];
  users: user[] = [];
  constructor(private jobPostService: JobPostService) {}
  ngOnInit(): void {
    this.jobPostService.GetSkills().subscribe((res) => {
      this.skills = res;
    });
    this.jobPostService.Getusers().subscribe((res) => {
      this.users = res;
    });
  }

  selectedSkills: skill[] = [];

  onSkillChange(input: any) {
    console.log(input);
  }
}
