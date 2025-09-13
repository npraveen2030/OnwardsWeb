import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReimbursementService } from '../../services/reimbursement.service';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

@Component({
  selector: 'app-reimbursements',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TableModule, InputTextModule, ButtonModule],
  templateUrl: './reimbursements.component.html',
  styleUrl: './reimbursements.component.scss',
})
export class ReimbursementsComponent {
  Reimbursementmodal: any;
  reimbursementForm!: FormGroup;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  selectedFiles: File[] = [];

  products: Product[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private reimbursementService: ReimbursementService,
    private router: Router
  ) {
    for (let i = 1; i <= 50; i++) {
      this.products.push({
        id: i,
        name: `Product ${i}`,
        price: Math.floor(Math.random() * 1000),
        category: ['Electronics', 'Clothing', 'Books'][i % 3],
      });
    }
  }

  ngOnInit(): void {
    this.reimbursementForm = this.fb.group({
      amount: ['', Validators.required],
      date: ['', Validators.required],
      purpose: ['', Validators.required],
      action: ['', Validators.required],
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const bootstrap = (window as any).bootstrap;
      const ReimbursementmodalEl = document.getElementById('Reimbursementmodal');

      if (ReimbursementmodalEl && bootstrap?.Modal) {
        this.Reimbursementmodal = new bootstrap.Modal(ReimbursementmodalEl);
      }
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.reimbursementForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = [...this.selectedFiles, ...Array.from(input.files)];
      this.fileInput.nativeElement.value = '';
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  // Handle file drop
  onDrop(event: DragEvent) {
    event.preventDefault();

    if (event.dataTransfer?.files) {
      this.selectedFiles.push(...Array.from(event.dataTransfer.files));
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  saveForm() {
    if (this.reimbursementForm.invalid) {
      this.reimbursementForm.markAllAsTouched();
      return;
    }

    const formData = this.reimbursementForm.value;

    // send data to service
    // this.reimbursementService.addReimbursement(formData);

    // redirect to details page
    this.router.navigate(['/reimbursement-details']);
  }

  resetForm() {
    this.reimbursementForm.reset();
    this.selectedFiles = [];
    this.fileInput.nativeElement.value = '';
  }
}
