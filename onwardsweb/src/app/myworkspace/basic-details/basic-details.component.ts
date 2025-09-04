import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-basic-details',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './basic-details.component.html',
  styleUrl: './basic-details.component.scss'
})
export class BasicDetailsComponent {
  jobs = [
  { companyName: '', designation: '', startDate: '', endDate: '' }
];

people: any[] = [
    { name: '', gender: '', dob: '', age: '' }
  ];

  selectedFileName: string[] = ['upload file...','upload file...', 'upload file...'];

onFileSelected(event: Event, index: number) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedFileName[index] = input.files[0].name; // store by index
  }
}

  addPerson() {
    this.people.push({ name: '', gender: '', dob: '', age: '' });
  }

   removePerson(index: number) {
    this.people.splice(index, 1);
  }

  activeTab: string = 'personal-info';
  dob: string = '';
age: number | null = null;

addJob() {
  this.jobs.push({ companyName: '', designation: '', startDate: '', endDate: '' });
}

removeJob(index: number) {
  this.jobs.splice(index, 1);
}

calculateAge() {
  if (this.dob) {
    const birthDate = new Date(this.dob);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // adjust if birthday hasn't happened yet this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      years--;
    }

    this.age = years;
  } else {
    this.age = null;
  }
}

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

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
