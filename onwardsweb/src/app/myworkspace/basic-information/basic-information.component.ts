import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { LoginResponse } from '../../models/loginResponseModel';
import { isPlatformBrowser } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-basic-information',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './basic-information.component.html',
  styleUrl: './basic-information.component.scss'
})
export class BasicInformationComponent {
userDetails!: LoginResponse

constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const userDetailsJson: string | null = sessionStorage.getItem('userDetails');

      if (userDetailsJson !== null) {
        this.userDetails = JSON.parse(userDetailsJson);
      }
    }
  }
}
