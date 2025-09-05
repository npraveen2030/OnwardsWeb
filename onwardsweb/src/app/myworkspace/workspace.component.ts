import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.scss'
})
export class WorkspaceComponent {
goToReimbursements() {
  this.router.navigate(['/reimbursements']);
}
constructor(private router: Router) {}

  goToResignation() {
    this.router.navigate(['/resignation']);
  }

  goToPersonalInfo() {
    this.router.navigate(['/personal-info']);

  }
}
