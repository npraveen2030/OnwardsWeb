import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-jobdescription',
  standalone: true,
  imports: [],
  templateUrl: './jobdescription.component.html',
  styleUrl: './jobdescription.component.scss',
})
export class JobdescriptionComponent {
  jobId!: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.jobId = Number(params.get('id'));
      console.log(this.jobId); // Use the id to fetch job details
    });
  }
}
