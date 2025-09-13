import { Component } from '@angular/core';
import { JobPostComponent } from './carreroppourtinities/jobpost.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-careerdashboard',
  standalone: true,
  imports: [CommonModule, JobPostComponent],
  templateUrl: './careerdashboard.component.html',
  styleUrl: './careerdashboard.component.scss'
})
export class CareerdashboardComponent {

}
