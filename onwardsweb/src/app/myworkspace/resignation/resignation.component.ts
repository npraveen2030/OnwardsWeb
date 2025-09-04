import { Component } from '@angular/core';
import { ResignationInformationComponent } from '../resignation-information/resignation-information.component';
import { BasicInformationComponent } from '../basic-information/basic-information.component';
import { Router, RouterOutlet } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { ExitInterviewComponent } from '../exit-interview/exit-interview.component';
import { MyApprovalComponent } from '../my-approval/my-approval.component';
import { SharedModule } from '../../modules/shared/shared-module';

@Component({
  selector: 'app-resignation',
  standalone: true,
  imports: [
    ResignationInformationComponent,
    BasicInformationComponent,
    ExitInterviewComponent,
    MyApprovalComponent,
    SharedModule
],
  templateUrl: './resignation.component.html',
  styleUrl: './resignation.component.scss',
})
export class ResignationComponent {
  activeTab: string = 'resignation'; // default tab
  constructor(private router: Router) {}

  goToResignation() {
    this.router.navigate(['/exit-interview']);
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
