import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionGuard implements CanActivate {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(): boolean | UrlTree {
    if (isPlatformBrowser(this.platformId)) {
      if (sessionStorage.getItem('userDetails') === null) {
        return this.router.parseUrl('/');
      } else {
        return true;
      }
    }

    return true;
  }

  canActivateChild(): boolean | UrlTree {
    return this.canActivate();
  }
}
