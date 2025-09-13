import { Component, OnInit } from '@angular/core';
import { JobApplication } from '../../models/career/jobapplication';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AutoComplete } from 'primeng/autocomplete';
import { CareerService } from '../../services/career/career.service';
// import { JobApplicationService } from './job-application.service';
// import { JobApplication } from './job-application.model';

@Component({
  selector: 'app-jobapplication',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jobapplication.component.html',
  styleUrl: './jobapplication.component.scss',
})
export class JobApplicationComponent implements OnInit {
  jobApplications: JobApplication[] = [];
  itemsPerPage = 10;

  constructor(private careerService: CareerService) {}

  ngOnInit(): void {
    this.careerService.getJobApplications().subscribe((data) => {
      this.jobApplications = data;
    });
  }

  onItemsPerPageChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.itemsPerPage = +select.value;
    // Pagination logic can be added later
  }

  findMoreJobs(): void {
    alert('Redirecting to job search page...');
  }
}
