import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReimbursementService } from '../../services/reimbursement.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reimbursements',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reimbursements.component.html',
  styleUrl: './reimbursements.component.scss'
})
export class ReimbursementsComponent {
  reimbursementForm: FormGroup;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder,
    private reimbursementService:ReimbursementService,
    private router: Router
  ) {
    this.reimbursementForm = this.fb.group({
      amount: ['', Validators.required],
      date: ['', Validators.required],
      purpose: ['', Validators.required],
      action: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.reimbursementForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  // ✅ Save form to local computer
  saveForm() {
  if (this.reimbursementForm.invalid) {
    this.reimbursementForm.markAllAsTouched();
    return;
  }

  const formData = this.reimbursementForm.value;

  // send data to service
  this.reimbursementService.addReimbursement(formData);

  // redirect to details page
  this.router.navigate(['/reimbursement-details']);
}


  // ✅ Reset form
  cancelForm() {
    this.reimbursementForm.reset();
    this.selectedFile = null;
  }

}
