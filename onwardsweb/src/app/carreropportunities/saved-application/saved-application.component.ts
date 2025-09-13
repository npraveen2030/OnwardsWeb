import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { JobApplication } from '../../models/career/jobapplication';
import { CareerService } from '../../services/career/career.service';

@Component({
  selector: 'app-saved-application',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './saved-application.component.html',
  styleUrl: './saved-application.component.scss',
})
export class SavedApplicationComponent {
  jobApplications: JobApplication[] = [];
  itemsPerPage = 10;

  constructor(private careerService: CareerService) {}

  ngOnInit(): void {
    this.careerService.getSavedApplications().subscribe((data) => {
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
