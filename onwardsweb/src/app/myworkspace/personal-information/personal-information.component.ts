import { Component } from '@angular/core';
import { BasicInformationComponent } from "../basic-information/basic-information.component";
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-personal-information',
  standalone: true,
  imports: [BasicInformationComponent, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './personal-information.component.html',
  styleUrl: './personal-information.component.scss'
})
export class PersonalInformationComponent {

  activeTab: string = 'personal-info'; 

// Method to check if a field is invalid and touched
  isInvalid(control: any): boolean {
    return control?.invalid && (control?.dirty || control?.touched);
  }

  onCancel(form:any) {
    form.resetForm();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  onSubmit(form: any) {
  if (form.valid) {
    confirm('Form Submitted Successfully');
  } else {
    Object.values(form.controls).forEach((control: any) => {
      control.markAsTouched(); // force errors to appear
    });
  }
}
}
