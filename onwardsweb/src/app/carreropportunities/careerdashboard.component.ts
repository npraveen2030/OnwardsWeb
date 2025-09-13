import { Component } from '@angular/core';
import { JobPostComponent } from './carreroppourtinities/jobpost.component';
import { CommonModule } from '@angular/common';
import { JobApplicationComponent } from './jobapplication/jobapplication.component';
import { SavedJobComponent } from './saved-job/saved-job.component';
import { SavedApplicationComponent } from './saved-application/saved-application.component';

@Component({
  selector: 'app-careerdashboard',
  standalone: true,
  imports: [
    CommonModule,
    JobPostComponent,
    JobApplicationComponent,
    SavedJobComponent,
    SavedApplicationComponent,
  ],
  templateUrl: './careerdashboard.component.html',
  styleUrl: './careerdashboard.component.scss',
})
export class CareerdashboardComponent {}
