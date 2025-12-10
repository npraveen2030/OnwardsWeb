import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-basic-details',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './basic-details.component.html',
  styleUrl: './basic-details.component.scss',
})
export class BasicDetailsComponent {
  EducationForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.EducationForm = this.fb.group({
      /* ------------------ EDUCATION ------------------ */
      qualification: ['', Validators.required],
      specialization: ['', Validators.required],
      collegeName: ['', Validators.required],
      yearOfPassing: ['', Validators.required],
      boardUniversity: ['', Validators.required],
      percentage: ['', Validators.required],

      /* ------------------ CERTIFICATION ------------------ */
      courseName: [''],
      instituteName: [''],
      courseYear: [''],

      /* ------------------ SKILLS ------------------ */
      primarySkill: [''],
      secondarySkill: [''],

      /* ------------------ EXPERIENCE (YEARS) ------------------ */
      previousExperience: [''],
      totalExperience: [''],
      relevantExperience: [''],
      currentEmployer: [''],
      currentDesignation: [''],
      previousOnwardExperience: [''],
      previousOnwardEmployeeCode: [''],

      /* ------------------ PREVIOUS EXPERIENCE ROW (Static) ------------------ */
      companyName: [''],
      designation: [''],
      startDate: [''],
      endDate: [''],

      /* ------------------ MARITAL STATUS ------------------ */
      maritalStatus: ['Unmarried'],
      title: [''],
      spouseName: [''],
      haveChildren: [false],

      maritalName: [''],
      maritalGender: [''],
      maritalDob: [''],
      maritalAge: [''],

      /* ------------------ DOCUMENTS ------------------ */
      btechFileName: ['upload file...'],
      experienceLetterFile: ['upload file...'],
      passbookFile: ['upload file...'],
      relievingLetterFile: ['upload file...'],
      aadhaarFile: ['upload file...'],
    });

    /* ------------------ MARITAL STATUS VALIDATION ------------------ */
    this.EducationForm.get('maritalStatus')?.valueChanges.subscribe((value) => {
      if (value === 'Married') {
        this.EducationForm.get('title')?.setValidators(Validators.required);
        this.EducationForm.get('spouseName')?.setValidators(Validators.required);
      } else {
        this.EducationForm.get('title')?.clearValidators();
        this.EducationForm.get('spouseName')?.clearValidators();
        this.EducationForm.patchValue({
          title: '',
          spouseName: '',
        });
      }
      this.EducationForm.get('title')?.updateValueAndValidity();
      this.EducationForm.get('spouseName')?.updateValueAndValidity();
    });

    /* ------------------ AUTO AGE CALCULATION ------------------ */
    this.EducationForm.get('maritalDob')?.valueChanges.subscribe((value) => {
      if (!value) return;

      const dob = new Date(value);
      const today = new Date();

      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;

      this.EducationForm.patchValue({ maritalAge: age });
    });
  }

  /* ------------------ ADD CERTIFICATION ------------------ */
  onAddCertification() {
    alert('Add Certification clicked (dynamic expansion can be implemented here)');
  }

  /* ------------------ ADD PREVIOUS EXPERIENCE ------------------ */
  onAddPreviousExperience() {
    alert('Add Previous Experience clicked (dynamic rows can be added)');
  }

  /* ------------------ DOCUMENT FILE CHANGE ------------------ */
  onFileSelected(event: any, field: string) {
    const file = event.target.files[0];
    if (file) {
      this.EducationForm.patchValue({ [field]: file.name });
    }
  }

  /* ------------------ SUBMIT ------------------ */
  onSubmit() {
    if (this.EducationForm.invalid) {
      this.EducationForm.markAllAsTouched();
      return;
    }

    console.log('FINAL FORM DATA:', this.EducationForm.value);
  }

  /* ------------------ CANCEL BUTTON ------------------ */
  onCancel() {
    this.EducationForm.reset();
  }
}
