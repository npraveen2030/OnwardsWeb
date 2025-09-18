import { Component } from '@angular/core';
import { JobPostComponent } from './jobpost.component';

@Component({
  selector: 'app-jobsearch',
  standalone: true,
  imports: [JobPostComponent],
  templateUrl: './jobsearch.component.html',
  styleUrl: './jobsearch.component.scss',
})
export class JobsearchComponent {}
