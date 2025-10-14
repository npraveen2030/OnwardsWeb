import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-managerleaves',
  standalone: true,
  imports: [TableModule, DatePipe],
  templateUrl: './managerleaves.component.html',
  styleUrl: './managerleaves.component.scss',
})
export class ManagerleavesComponent {
  projects: any;
  noDataMessage: any;
}
