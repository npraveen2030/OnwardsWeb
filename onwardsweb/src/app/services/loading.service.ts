import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingCounter = 0;
  private _loading$ = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loading$.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  show() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.loadingCounter++;
    if (this.loadingCounter === 1) {
      this._loading$.next(true); // show loader
    }
  }

  hide() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.loadingCounter--;
    if (this.loadingCounter <= 0) {
      this.loadingCounter = 0;
      this._loading$.next(false); // hide loader
    }
  }

  reset() {
    this.loadingCounter = 0;
    this._loading$.next(false);
  }
}
