import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReimbursementService } from '../../services/reimbursement.service';

@Component({
  selector: 'app-reimbursement-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reimbursement-details.component.html',
  styleUrl: './reimbursement-details.component.scss',
})
export class ReimbursementDetailsComponent implements OnInit {
  activeTab: string = 'personal-info';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  reimbursements: any[] = [];

  constructor(private reimbursementService: ReimbursementService) {}

  ngOnInit() {
    // this.reimbursements = this.reimbursementService.getReimbursements();
  }
}
