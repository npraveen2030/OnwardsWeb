import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './personal.component.html',
  styleUrl: './personal.component.scss'
})
export class PersonalComponent {
  onCancel(form:any) {
    form.resetForm();
  }

  isInvalid(control: any): boolean {
    return control?.invalid && (control?.dirty || control?.touched);
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
