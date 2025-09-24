import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalInstance: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  initialize(modalId: string) {
    if (isPlatformBrowser(this.platformId)) {
      const bootstrap = (window as any).bootstrap;
      const modalElement = document.getElementById(modalId);

      if (modalElement && bootstrap?.Modal) {
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
    }
  }

  show() {
    this.modalInstance?.show();
  }

  hide() {
    this.modalInstance?.hide();
  }

  getInstance() {
    return this.modalInstance;
  }
}
