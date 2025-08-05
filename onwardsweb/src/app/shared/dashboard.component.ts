import {
  Component,
  Inject,
  PLATFORM_ID,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { DashBoardService } from '../services/dashboardservice.service';
import { UserShiftLogResponse } from '../models/DashBoardResponseModel';
import { LoginResponse } from '../models/loginResponseModel';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, AfterViewInit {
  loginModal: any;
  isLoggedin: string = '0';
  errorMessage: string = '';
  logintimedetails: UserShiftLogResponse = {
    logId: 0,
    shiftId: 0,
    date: '',
    shift: null,
    todayDate: '',
    shiftStartTime: '',
    loginTime: '',
    logOutTime: '',
    totalLoggedInHours: '',
    userId: 0,
    loginId: 0,
    createdBy: null,
    createdDate: null,
    modifiedBy: null,
    modifiedDate: null,
    isActive: false,
  };
  userDetails!: LoginResponse;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private dashboardservice: DashBoardService
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Retriving UserDetails from sessionStorage
      const userDetailsJson: string | null =
        sessionStorage.getItem('userDetails');

      if (userDetailsJson === null) {
        this.router.navigate(['/']);
      } else {
        this.userDetails = JSON.parse(userDetailsJson);
      }

      // Implementing session based logintime popup
      const isLoggedinJson: string | null =
        sessionStorage.getItem('isloggedin');

      if (isLoggedinJson === null) {
        sessionStorage.setItem('isloggedin', '0');
        this.getUserShiftLogDetails();
      } else {
        if (JSON.parse(isLoggedinJson) === '0') {
          this.getUserShiftLogDetails();
        }
      }
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId) && this.isLoggedin === '0') {
      const bootstrap = (window as any).bootstrap;
      const loginEl = document.getElementById('loginmodal');

      if (loginEl && bootstrap?.Modal) {
        this.loginModal = new bootstrap.Modal(loginEl);
        this.loginModal?.show();
      }
    }
  }

  getUserShiftLogDetails() {
    this.dashboardservice.getUserShiftLog(this.userDetails.id).subscribe({
      next: (response) => {
        this.logintimedetails.date = response.todayDate;
        this.logintimedetails.shiftStartTime = response.shiftStartTime;
        this.logintimedetails.loginTime = response.loginTime;
      },
      error: (err: any) => {
        // ------------------<need to modify error responses>--------------------
        if (err.status === 401) {
          this.errorMessage = 'UserShiftLog not found';
        } else {
          this.errorMessage = 'An error occurred. Please try again.';
        }
        console.error('Login error:', err);
      },
    });
  }

  setLoginTime() {
    this.dashboardservice
      .InsertOrUpdateUserShiftLog(this.userDetails.id)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.loginModal.hide();
          sessionStorage.setItem('isloggedin', '1');
        },
        error: (err: any) => {
          // ------------------<need to modify error responses>--------------------
          if (err.status === 401) {
            this.errorMessage = 'UserShiftLog not saved';
          } else {
            this.errorMessage = 'An error occurred. Please try again.';
          }
          console.error('Login error:', err);
        },
      });
  }
}
