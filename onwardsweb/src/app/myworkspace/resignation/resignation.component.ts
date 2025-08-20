import { Component } from '@angular/core';
import { ResignationInformationComponent } from '../resignation-information/resignation-information.component';
import { BasicInformationComponent } from '../basic-information/basic-information.component';

@Component({
  selector: 'app-resignation',
  standalone: true,
  imports: [ResignationInformationComponent,BasicInformationComponent],
  templateUrl: './resignation.component.html',
  styleUrl: './resignation.component.scss',
})
export class ResignationComponent {}
