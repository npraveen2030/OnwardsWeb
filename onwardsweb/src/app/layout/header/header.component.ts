import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LoginResponse } from '../../models/loginResponseModel';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login-service.service';
import { DashBoardService } from '../../services/dashboardservice.service';
import { UserShiftLogResponse } from '../../models/DashBoardResponseModel';
import { BreadcrumbComponent } from '../../shared/breadcrumb.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [BreadcrumbComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit {
  userDetails: LoginResponse | null = null;
  logoutModal: any;
  logouttimedetails: UserShiftLogResponse = {
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

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private loginservice: LoginService,
    private dashboardservice: DashBoardService
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const userStr = sessionStorage.getItem('userDetails');
      if (userStr !== null) {
        this.userDetails = JSON.parse(userStr);
      }
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const bootstrap = (window as any).bootstrap;

      const logoutEl = document.getElementById('logoutmodal');

      if (logoutEl && bootstrap?.Modal) {
        this.logoutModal = new bootstrap.Modal(logoutEl);
      }
    }
  }

  getInitials(fullName: string): string {
    return fullName
      .split(' ')
      .filter((part) => part.trim())
      .map((part) => part[0].toUpperCase())
      .join('');
  }

  signout() {
    this.dashboardservice.getUserShiftLog(this.userDetails?.id ?? 0).subscribe({
      next: (response) => {
        this.logouttimedetails.date = response.todayDate;
        this.logouttimedetails.shiftStartTime = response.shiftStartTime;
        this.logouttimedetails.loginTime = response.loginTime;
        this.logouttimedetails.logOutTime = response.logOutTime;
        this.logouttimedetails.totalLoggedInHours = response.totalLoggedInHours;
      },
    });
    this.logoutModal.show();
  }

  setLogoutTime() {
    this.logoutModal.hide();
    this.dashboardservice.InsertOrUpdateUserShiftLog(this.userDetails?.id ?? 0).subscribe({
      next: (response) => {
        console.log(response);
      },
    });
    this.loginservice.signout().subscribe({
      next: (response) => {
        console.log(response.message);
      },
    });
    sessionStorage.removeItem('userDetails');
    sessionStorage.removeItem('isloggedin');
    this.router.navigate(['/']);
  }
}
