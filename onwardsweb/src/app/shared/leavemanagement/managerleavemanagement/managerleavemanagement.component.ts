import { Component } from '@angular/core';
import { ManagerleavesComponent } from './managerleaves/managerleaves.component';
import { ManagerattendanceComponent } from './managerattendance/managerattendance.component';

@Component({
  selector: 'app-managerleavemanagement',
  standalone: true,
  imports: [ManagerleavesComponent, ManagerattendanceComponent],
  templateUrl: './managerleavemanagement.component.html',
  styleUrl: './managerleavemanagement.component.scss',
})
export class ManagerleavemanagementComponent {
  activeTab: string = 'leaves';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
